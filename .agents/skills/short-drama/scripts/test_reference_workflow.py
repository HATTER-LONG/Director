"""Regression checks for reference-led storyboards without forced endpoint images."""
import unittest

from creator_markdown_check import validate_documents

SHOT = """## SHOT-EP001-001 · 听见门响
- 来源：EP001-SC001
- 时长：5s
- 视觉依据：无
- 图片提示词项：无
- 输入参考图：REF-ROOM（顺序：1）· refs/room.png《走廊》（用途：地理；控制：空间；不得控制：动作）
- 起点：中景，人物面对关闭的门，右手垂在身侧。
- 终点：人物转向门把。
"""


def check(shot):
    return validate_documents({"分镜.md": shot}, None, partial=True)


class ReferenceWorkflowTests(unittest.TestCase):
    def test_complete_references_need_no_frozen_image_prompt(self):
        self.assertEqual(check(SHOT), [])

    def test_end_state_reference_does_not_require_start_image(self):
        self.assertEqual(check(SHOT.replace("用途：地理", "用途：结束帧")), [])

    def test_missing_opening_is_still_an_error(self):
        shot = "\n".join(line for line in SHOT.splitlines() if not line.startswith("- 起点："))
        self.assertTrue(any("须写明起点" in e for e in check(shot)))

    def test_existing_keyframe_workflow_still_passes(self):
        self.assertEqual(check(SHOT + "\n### 冻结关键帧提示词\n> A person faces a closed door.\n"), [])

    def test_empty_keyframe_heading_is_not_silently_ignored(self):
        self.assertTrue(any("不是唯一且非空" in e for e in check(SHOT + "\n### 冻结关键帧提示词\n")))

    def test_duplicate_keyframe_heading_fails(self):
        prompt = "\n### 冻结关键帧提示词\n> A person faces a closed door.\n"
        self.assertTrue(any("不是唯一且非空" in e for e in check(SHOT + prompt + prompt)))

    def test_reference_order_must_still_match(self):
        self.assertTrue(any("连续编号" in e for e in check(SHOT.replace("顺序：1", "顺序：2"))))

    def test_actual_reference_file_must_exist(self):
        from pathlib import Path
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as directory:
            errors = validate_documents({"分镜.md": SHOT}, Path(directory), partial=True)
            self.assertTrue(any("room.png" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
