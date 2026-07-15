import os
import sys
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import app as app_module


class AppSmokeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app_module.web_app)

    def test_health_reports_runtime_status(self) -> None:
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("status", payload)
        self.assertIn("openai_configured", payload)

    def test_generate_script_falls_back_when_openai_is_unavailable(self) -> None:
        response = self.client.post(
            "/api/generate-script",
            json={"source_text": "A short test source for the podcast studio."},
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("script", payload)
        self.assertTrue(bool(payload["script"]))
        self.assertIn("## Opening Hook", payload["script"])


if __name__ == "__main__":
    unittest.main()
