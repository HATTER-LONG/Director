"""Check scratch placement, cleanup and the Remotion subprocess environment."""

import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import edit_tool as edit


CUT_LIST = """# EP001 剪辑单

## CUT-EP001-001 · 测试片段
- 来源：MOTION-EP001-001 · media.mp4
- 入点：0
- 出点：0.5
- 时长：0.5
- 取舍：测试完整区间
- 声音：保留原声
- 字幕：无
"""


class RenderResourceTests(unittest.TestCase):
    @unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "requires FFmpeg")
    def test_media_scratch_stays_under_output_and_is_cleaned_on_success_or_failure(self):
        for fail in (False, True):
            with self.subTest(fail=fail), tempfile.TemporaryDirectory() as directory:
                episode = Path(directory)
                (episode / "剪辑单.md").write_text(CUT_LIST, encoding="utf-8")
                subprocess.run([
                    "ffmpeg", "-v", "error", "-f", "lavfi", "-i", "color=size=96x160:rate=24",
                    "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000", "-t", "0.5",
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac",
                    str(episode / "media.mp4"),
                ], check=True, capture_output=True)
                delivery, cuts, _ = edit.parse_cut_list(episode / "剪辑单.md")
                scratch_paths = []
                real_run = edit._run

                def observe(command):
                    output = Path(command[-1])
                    if output.name in {"pictures.mp4", "0000.wav"}:
                        self.assertEqual(output.parent.parent, episode / edit.OUTPUT_DIRECTORY)
                        self.assertTrue(output.parent.is_dir())
                        scratch_paths.append(output.parent)
                        if fail:
                            raise edit.EditError("injected rendering failure")
                    return real_run(command)

                with patch.object(edit, "_run", side_effect=observe):
                    if fail:
                        with self.assertRaisesRegex(edit.EditError, "injected"):
                            edit.render(episode, episode, cuts, delivery, burn_subtitles=False)
                    else:
                        result = edit.render(episode, episode, cuts, delivery, burn_subtitles=False)
                        self.assertAlmostEqual(edit.probe_duration(Path(result["成片"])), 0.5, delta=0.05)
                        self.assertEqual(len(scratch_paths), 2)
                self.assertTrue(scratch_paths)
                self.assertTrue(all(not path.exists() for path in scratch_paths))
                self.assertTrue((episode / "media.mp4").is_file())

    def test_remotion_inherits_the_media_scratch_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            scratch = root / ".render-test"
            scratch.mkdir()

            def run(command, **kwargs):
                for key in ("TMPDIR", "TMP", "TEMP"):
                    self.assertEqual(kwargs["env"][key], str(scratch))
                self.assertIn("--concurrency=2", command)
                Path(command[4]).write_bytes(b"overlay")
                return subprocess.CompletedProcess(command, 0, "", "")

            with patch.object(edit, "_sync_remotion_workspace", return_value=root), \
                    patch.object(edit, "_missing_remotion_packages", return_value=[]), \
                    patch.object(edit, "_which", return_value="npx"), \
                    patch.object(edit.subprocess, "run", side_effect=run):
                output = edit._render_remotion_overlay(
                    root, [], [], {"width": 96, "height": 160, "fps": 24}, 0.5, root,
                    temp_directory=scratch,
                )
                self.assertEqual(output.read_bytes(), b"overlay")


if __name__ == "__main__":
    unittest.main()
