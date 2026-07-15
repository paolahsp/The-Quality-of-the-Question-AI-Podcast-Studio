from pathlib import Path


def test_landing_contains_polish_state_elements() -> None:
    html_path = Path(__file__).resolve().parents[1] / "landing" / "index.html"
    html = html_path.read_text(encoding="utf-8")

    assert 'id="workflowHighlight"' in html
    assert 'id="workflowHighlightTitle"' in html
    assert 'id="workflowHighlightBody"' in html
