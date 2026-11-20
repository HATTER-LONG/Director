"""Offline checks for task completion and media retrieval; no server required."""

import io
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit

import comfy_client as client


class ClientTests(unittest.TestCase):
    def test_execution_failure_is_reported_with_or_without_partial_output(self):
        for outputs in ({}, {"preview": {"images": [{"filename": "preview.png"}]}}):
            with self.subTest(outputs=outputs):
                record = {"outputs": outputs, "status": {
                    "status_str": "error", "completed": False,
                    "messages": [["execution_error", {"exception_message": "CUDA out of memory"}]],
                }}
                with patch.object(client, "_get", return_value={"job": record}):
                    with self.assertRaisesRegex(RuntimeError, "job.*CUDA out of memory"):
                        client.wait("job")

    def test_interruption_and_error_without_details_fail(self):
        for status in (
            {"completed": False, "messages": [["execution_interrupted", {}]]},
            {"status_str": "error", "completed": True},
        ):
            with self.subTest(status=status):
                with patch.object(client, "_get", return_value={"job": {"status": status}}):
                    with self.assertRaisesRegex(RuntimeError, "job.*failed"):
                        client.wait("job")

    def test_outputs_do_not_replace_completion_status(self):
        pending = {"status": {"completed": False}, "outputs": {"preview": {}}}
        completed = {"status": {"completed": True}, "outputs": {}}
        with patch.object(client, "_get", side_effect=[{}, {"job": pending}, {"job": completed}]), \
                patch.object(client.time, "sleep"):
            self.assertIs(client.wait("job"), completed)

    def test_timeout_keeps_task_id_without_resubmitting(self):
        with patch.object(client.time, "time", side_effect=[0, 0, 2]), \
                patch.object(client.time, "sleep"), \
                patch.object(client, "_get", return_value={}), \
                patch.object(client, "queue") as queue:
            with self.assertRaisesRegex(TimeoutError, "job"):
                client.wait("job", timeout=1)
            queue.assert_not_called()

    def test_failed_download_preserves_previous_file_and_removes_partial(self):
        class BrokenResponse(io.BytesIO):
            def read(self, size=-1):
                if self.tell():
                    raise OSError("connection lost")
                return super().read(3)

        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "voice.wav"
            destination.write_bytes(b"previous take")
            record = {"outputs": {"node": {"audio": [{"filename": "voice.wav"}]}}}
            with patch.object(client.urllib.request, "urlopen", return_value=BrokenResponse(b"partial")):
                with self.assertRaisesRegex(OSError, "connection lost"):
                    client.download_outputs(record, directory)
            self.assertEqual(destination.read_bytes(), b"previous take")
            self.assertEqual(list(Path(directory).iterdir()), [destination])

    def test_audio_and_existing_media_are_downloaded_in_chunks(self):
        payload = b"media" * 100000
        requested = []

        class ChunkedResponse(io.BytesIO):
            def read(self, size=-1):
                self_test.assertGreater(size, 0, "Do not read the entire media file into RAM")
                return super().read(size)

        def open_media(url, timeout):
            requested.append(parse_qs(urlsplit(url).query))
            return ChunkedResponse(payload)

        self_test = self
        outputs = {key: [{"filename": name, "subfolder": "take 1", "type": "output"}]
                   for key, name in [("images", "frame.png"), ("gifs", "preview.gif"),
                                     ("videos", "clip.mp4"), ("audio", "voice.wav")]}
        with tempfile.TemporaryDirectory() as directory, \
                patch.object(client.urllib.request, "urlopen", side_effect=open_media):
            saved = client.download_outputs({"outputs": {"node": outputs}}, directory)
            self.assertEqual({Path(p).name for p in saved},
                             {"frame.png", "preview.gif", "clip.mp4", "voice.wav"})
            for path in saved:
                self.assertEqual(Path(path).read_bytes(), payload)
        self.assertEqual(len(requested), 4)
        self.assertTrue(all(q["subfolder"] == ["take 1"] for q in requested))


if __name__ == "__main__":
    unittest.main()
