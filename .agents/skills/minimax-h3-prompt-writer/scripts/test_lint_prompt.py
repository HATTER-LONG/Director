"""Offline regressions for project timing, official timing and keyframe alignment."""
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from lint_prompt import lint


def base(body):
    return (f'integrated_multimodal_description: {body}\n'
            'overall_soundscape: Room tone.\nnon_diegetic_music: N/A')


ORDERED = base('[Shot 1] A woman opens the door.\n[Shot 2] A man looks up.')
EXACT = ORDERED.replace('[Shot 2]', '[Shot 2] At 00:03.000,')


class PromptProfiles(unittest.TestCase):
    def test_project_ordered_two_shots(self):
        result = lint(ORDERED, 't2va', 6)
        self.assertEqual(result['errors'], [])
        self.assertEqual(result['timing'], 'ordered')

    def test_official_requires_timestamps(self):
        self.assertTrue(lint(ORDERED, 't2va', 6, profile='official')['errors'])
        self.assertEqual(lint(EXACT, 't2va', 6, profile='official')['errors'], [])

    def test_explicit_exact_project_mode(self):
        self.assertTrue(lint(EXACT, 't2va', 6)['errors'])
        self.assertEqual(lint(EXACT, 't2va', 6, timing='exact')['errors'], [])

    def test_increasing_cuts_and_duration(self):
        for stamp in ['00:00.000', '00:06.000', '00:60.000']:
            with self.subTest(stamp=stamp):
                self.assertTrue(lint(EXACT.replace('00:03.000', stamp), 't2va', 6, timing='exact')['errors'])
        three = EXACT.replace('overall_soundscape:', '[Shot 3] At 00:02.000, He leaves.\noverall_soundscape:')
        self.assertTrue(lint(three, 't2va', 6, timing='exact')['errors'])

    def test_partial_times_do_not_invent_windows(self):
        text = base('[Shot 1] A waits.\n[Shot 2] B says <d>[English] One two three four.</d>\n'
                    '[Shot 3] At 00:05.000, A leaves.')
        result = lint(text, 't2va', 6, timing='exact')
        self.assertTrue(result['errors'])
        self.assertFalse(any('words/s' in w for w in result['warnings']))

    def test_shot_numbers_and_fields_still_checked(self):
        self.assertTrue(lint(ORDERED.replace('[Shot 2]', '[Shot 3]'), 't2va', 6)['errors'])
        self.assertTrue(lint(ORDERED.replace('overall_soundscape:', 'sound:'), 't2va', 6)['errors'])

    def test_keyframe_alignment_independent_of_cut_timestamps(self):
        prefixes = {
            'i2va': 'For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.',
            'fl2va': 'How the reference pictures align with the target video — Picture 1 (from Shot 1) aligns with the 0.00-second mark of the target video; Picture 2 (from Shot 2) aligns with the 6.00-second mark of the target video.',
            'l2va': 'How the reference pictures align with the target video — <Picture 1> (from [Shot 2]) aligns with the 6.00-second mark of the target video.',
        }
        for mode, prefix in prefixes.items():
            with self.subTest(mode=mode):
                text = prefix + '\n\n' + ORDERED
                self.assertEqual(lint(text, mode, 6)['errors'], [])
                self.assertTrue(lint(text.replace('\n\n', '\n', 1), mode, 6)['errors'])
        self.assertTrue(lint(prefixes['fl2va'].replace('6.00', '5.00') + '\n\n' + ORDERED, 'fl2va', 6)['errors'])

    def test_ref2va_labels(self):
        text = ('subject_definitions: <Subject 1> is the woman in <Picture 1>.\n'
                'summary: reference generation\nretention_analysis: <Subject 1> is retained.\n'
                'detailed_description: [Shot 1] <Subject 1> waits.\n[Shot 2] She turns.\n'
                'overall_soundscape: Wind.\nnon_diegetic_music: N/A')
        self.assertEqual(lint(text, 'ref2va', 6)['errors'], [])
        self.assertTrue(lint(text.replace('She turns.', '<Subject 2> turns.'), 'ref2va', 6)['errors'])

    def test_dialogue_project_marker_and_chinese_punctuation(self):
        text = base('[Shot 1] She says <d>[Chinese] 等一下。</d>[END_OF_DIALOGUE]')
        self.assertEqual(lint(text, 't2va', 6)['warnings'], [])
        missing = text.replace('[END_OF_DIALOGUE]', '')
        self.assertTrue(lint(missing, 't2va', 6)['warnings'])
        self.assertEqual(lint(missing, 't2va', 6, profile='official')['warnings'], [])
        self.assertTrue(lint(text.replace('</d>', ''), 't2va', 6)['errors'])

    def test_invalid_duration(self):
        for duration in [0, -1, float('nan'), float('inf')]:
            self.assertTrue(lint(ORDERED, 't2va', duration)['errors'])

    def test_cli_exit_status(self):
        script = Path(__file__).with_name('lint_prompt.py')
        with tempfile.TemporaryDirectory() as directory:
            prompt = Path(directory) / 'prompt.txt'
            prompt.write_text(ORDERED, encoding='utf-8')
            args = [sys.executable, str(script), str(prompt), '--mode', 't2va', '--duration', '6']
            self.assertEqual(subprocess.run(args, capture_output=True).returncode, 0)
            self.assertEqual(subprocess.run(args + ['--profile', 'official'], capture_output=True).returncode, 1)


if __name__ == '__main__':
    unittest.main()
