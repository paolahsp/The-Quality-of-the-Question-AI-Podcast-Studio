from __future__ import annotations

import os
import threading
import webbrowser
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------
# Fix invalid local SSL environment variables
# ---------------------------------------------------------

for variable_name in (
    "SSL_CERT_FILE",
    "REQUESTS_CA_BUNDLE",
    "CURL_CA_BUNDLE",
):
    configured_path = os.environ.get(variable_name)

    if configured_path and not Path(configured_path).exists():
        os.environ.pop(variable_name, None)

import gradio as gr
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse

from src.podcast_pipeline import (
    format_podcast_script,
    generate_podcast_script,
)


# ---------------------------------------------------------
# Project paths
# ---------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent

SOURCE_FILE = (
    PROJECT_ROOT
    / "data"
    / "source_texts"
    / "book_intro_source.md"
)

SCRIPT_FILE = (
    PROJECT_ROOT
    / "data"
    / "scripts"
    / "book_intro_podcast_script.md"
)

DEMO_AUDIO_FILE = (
    PROJECT_ROOT
    / "outputs"
    / "demo"
    / "book_intro_podcast.mp3"
)

GENERATED_OUTPUTS_DIR = (
    PROJECT_ROOT
    / "outputs"
    / "generated"
)

# Keep frontend files in ``landing/``. For compatibility with an earlier flat
# layout, the project root is also checked automatically.
FRONTEND_DIR = next(
    (
        candidate
        for candidate in (
            PROJECT_ROOT / "landing",
            PROJECT_ROOT,
        )
        if (candidate / "index.html").is_file()
    ),
    PROJECT_ROOT / "landing",
)

INDEX_FILE = FRONTEND_DIR / "index.html"
SCRIPT_ASSET_FILE = FRONTEND_DIR / "script.js"
STYLE_FILE = next(
    (
        candidate
        for candidate in (
            FRONTEND_DIR / "styles.css",
            FRONTEND_DIR / "style.css",
        )
        if candidate.is_file()
    ),
    FRONTEND_DIR / "styles.css",
)


# ---------------------------------------------------------
# General utilities
# ---------------------------------------------------------

def read_text_file(file_path: Path) -> str:
    """
    Read a UTF-8 text file safely.

    Returns an empty string if the file is missing,
    empty, or cannot be read.
    """
    if not file_path.exists():
        return ""

    try:
        return file_path.read_text(encoding="utf-8").strip()
    except OSError:
        return ""


def count_words(text: str) -> int:
    """Count words in the supplied text."""
    if not text or not text.strip():
        return 0

    return len(text.split())


def estimate_duration(
    text: str,
    words_per_minute: int = 145,
) -> str:
    """
    Estimate spoken duration using an average narration pace.
    """
    words = count_words(text)

    if words == 0:
        return "0:00"

    total_seconds = round(
        (words / words_per_minute) * 60
    )

    minutes, seconds = divmod(
        total_seconds,
        60,
    )

    return f"{minutes}:{seconds:02d}"


def build_source_metadata(source_text: str) -> str:
    """Build source statistics."""
    words = count_words(source_text)
    characters = len(source_text or "")

    return (
        f"**Source length:** {words} words  \n"
        f"**Characters:** {characters}"
    )


def build_script_metadata(script_text: str) -> str:
    """Build script statistics."""
    words = count_words(script_text)
    duration = estimate_duration(script_text)

    return (
        f"**Script length:** {words} words  \n"
        f"**Estimated narration:** {duration} minutes"
    )


def create_approval_message(
    approved: bool,
    version: str,
) -> str:
    """Create the current approval message."""
    if approved:
        return (
            f"✅ Script version **{version}** "
            "is approved for narration."
        )

    return (
        f"Script version **{version}** "
        "has not been approved."
    )


# ---------------------------------------------------------
# Source callbacks
# ---------------------------------------------------------

def load_authorized_source() -> tuple[str, str, str]:
    """
    Load the authorized editorial source file.
    """
    source_text = read_text_file(SOURCE_FILE)

    if not source_text:
        return (
            "",
            "⚠️ The authorized source file was not found or is empty.",
            build_source_metadata(""),
        )

    return (
        source_text,
        "✅ Authorized source loaded successfully.",
        build_source_metadata(source_text),
    )


def clear_source() -> tuple[str, str, str]:
    """Clear the source input."""
    return (
        "",
        "Source cleared.",
        build_source_metadata(""),
    )


def update_source_metadata(source_text: str) -> str:
    """Update source statistics while editing."""
    return build_source_metadata(source_text)


# ---------------------------------------------------------
# Script callbacks
# ---------------------------------------------------------

def generate_script_from_source(
    source_text: str,
) -> tuple[str, str, str, bool, str, str]:
    """
    Generate a podcast script from the authorized source text.
    """
    if not source_text or not source_text.strip():
        return (
            "",
            "❌ Paste or load authorized source text before continuing.",
            build_script_metadata(""),
            False,
            "v1.0",
            create_approval_message(False, "v1.0"),
        )

    try:
        podcast_script = generate_podcast_script(source_text)
        script_text = format_podcast_script(podcast_script)
    except Exception as error:
        return (
            "",
            f"❌ Script generation failed: {error}",
            build_script_metadata(""),
            False,
            "v1.0",
            create_approval_message(False, "v1.0"),
        )

    return (
        script_text,
        (
            "✅ Podcast script generated from the authorized "
            "source. Review and edit it before approval."
        ),
        build_script_metadata(script_text),
        False,
        "v1.0",
        create_approval_message(False, "v1.0"),
    )


def update_script_metadata(script_text: str) -> str:
    """Update script statistics while editing."""
    return build_script_metadata(script_text)


def reset_script() -> tuple[
    str,
    str,
    str,
    bool,
    str,
    bool,
]:
    """Clear the generated script and reset the review state."""
    return (
        "",
        "Script cleared. Generate a new script from the authorized source.",
        build_script_metadata(""),
        False,
        "v1.0",
        False,
    )


def invalidate_approval_after_edit(
    script_text: str,
    is_approved: bool,
    current_version: str,
) -> tuple[bool, str, str]:
    """
    Invalidate approval after an approved script is edited.

    The version increases only once per approved version.
    """
    if not script_text or not script_text.strip():
        return (
            False,
            current_version,
            "❌ The script is empty and cannot be approved.",
        )

    if not is_approved:
        return (
            False,
            current_version,
            create_approval_message(
                False,
                current_version,
            ),
        )

    try:
        numeric_version = float(
            current_version.replace("v", "")
        )
    except ValueError:
        numeric_version = 1.0

    next_version = f"v{numeric_version + 0.1:.1f}"

    return (
        False,
        next_version,
        (
            "⚠️ Approval invalidated because the approved "
            f"script was edited. Current version: **{next_version}**. "
            "A new human review is required."
        ),
    )


# ---------------------------------------------------------
# Human review callbacks
# ---------------------------------------------------------

def calculate_review_summary(
    source_fidelity: str,
    factual_accuracy: str,
    attribution: str,
    spoken_language: str,
    tone_audience: str,
    episode_structure: str,
    length_pacing: str,
    copyright_privacy: str,
) -> str:
    """
    Calculate review completion and revision totals.
    """
    decisions = [
        source_fidelity,
        factual_accuracy,
        attribution,
        spoken_language,
        tone_audience,
        episode_structure,
        length_pacing,
        copyright_privacy,
    ]

    completed = sum(
        bool(decision)
        for decision in decisions
    )

    passed = sum(
        decision == "Pass"
        for decision in decisions
    )

    revisions = sum(
        decision == "Needs Revision"
        for decision in decisions
    )

    not_applicable = sum(
        decision == "Not Applicable"
        for decision in decisions
    )

    return (
        f"**Completed:** {completed}/8  \n"
        f"**Passed:** {passed}  \n"
        f"**Needs revision:** {revisions}  \n"
        f"**Not applicable:** {not_applicable}"
    )


def approve_script(
    script_text: str,
    source_fidelity: str,
    factual_accuracy: str,
    attribution: str,
    spoken_language: str,
    tone_audience: str,
    episode_structure: str,
    length_pacing: str,
    copyright_privacy: str,
    final_confirmation: bool,
    current_version: str,
) -> tuple[bool, str, str]:
    """
    Validate and approve the script for narration.
    """
    if not script_text or not script_text.strip():
        return (
            False,
            "❌ The script cannot be approved because it is empty.",
            "Locked",
        )

    decisions = [
        source_fidelity,
        factual_accuracy,
        attribution,
        spoken_language,
        tone_audience,
        episode_structure,
        length_pacing,
        copyright_privacy,
    ]

    if any(not decision for decision in decisions):
        return (
            False,
            (
                "❌ Complete all eight review criteria "
                "before approval."
            ),
            "Locked",
        )

    if "Needs Revision" in decisions:
        return (
            False,
            (
                "❌ Approval is blocked because at least "
                "one criterion needs revision."
            ),
            "Locked",
        )

    if not final_confirmation:
        return (
            False,
            (
                "❌ Select the final confirmation before "
                "approving the script."
            ),
            "Locked",
        )

    approved_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    return (
        True,
        (
            "✅ Script approved for narration.  \n"
            f"**Approved version:** {current_version}  \n"
            f"**Approval time:** {approved_at}"
        ),
        "Ready for narration",
    )


def request_changes(
    reviewer_notes: str,
) -> tuple[bool, str, str]:
    """
    Mark the script as requiring changes.
    """
    notes_message = (
        reviewer_notes.strip()
        if reviewer_notes and reviewer_notes.strip()
        else "No reviewer notes were added."
    )

    return (
        False,
        (
            "⚠️ Changes requested. Review the notes and "
            "update the script.  \n\n"
            f"**Reviewer notes:** {notes_message}"
        ),
        "Locked",
    )


# ---------------------------------------------------------
# Transcript and audio callbacks
# ---------------------------------------------------------

def save_transcript(
    script_text: str,
) -> tuple[str | None, str]:
    """
    Save the current script as a downloadable Markdown file.
    """
    if not script_text or not script_text.strip():
        return (
            None,
            "❌ There is no transcript to download.",
        )

    GENERATED_OUTPUTS_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    output_file = (
        GENERATED_OUTPUTS_DIR
        / "book_intro_podcast_transcript.md"
    )

    try:
        output_file.write_text(
            script_text,
            encoding="utf-8",
        )
    except OSError as error:
        return (
            None,
            (
                "❌ The transcript could not be saved: "
                f"{error}"
            ),
        )

    return (
        str(output_file),
        "✅ Transcript prepared for download.",
    )


def load_demo_audio(
    is_approved: bool,
) -> tuple[str | None, str]:
    """
    Load the authorized demo audio after script approval.
    """
    if not is_approved:
        return (
            None,
            (
                "❌ Complete the human review and approve "
                "the script before loading audio."
            ),
        )

    if not DEMO_AUDIO_FILE.exists():
        return (
            None,
            (
                "⚠️ Demo audio was not found. Generate the "
                "MP3 later and save it at:\n\n"
                "`outputs/demo/book_intro_podcast.mp3`"
            ),
        )

    return (
        str(DEMO_AUDIO_FILE),
        "✅ Authorized demo audio loaded.",
    )


# ---------------------------------------------------------
# Build Gradio interface
# ---------------------------------------------------------

with gr.Blocks(
    title="The Quality of the Question | AI Podcast Studio",
) as demo:

    approval_state = gr.State(False)
    script_version_state = gr.State("v1.0")

    gr.Markdown(
        """
        # The Quality of the Question

        ## AI Podcast Studio Lab

        Transform authorized book content into a reviewed
        podcast script and narrated audio.

        **Current mode:** OpenAI Pipeline
        """
    )

    gr.Markdown(
        """
        ### Workflow

        Authorized Source → Podcast Script →
        Human Review → Audio
        """
    )

    # -----------------------------------------------------
    # Source and script
    # -----------------------------------------------------

    with gr.Row():

        with gr.Column():
            gr.Markdown(
                "## 1. Authorized Source Input"
            )

            source_text = gr.Textbox(
                label="Authorized source",
                placeholder=(
                    "Load the approved book introduction "
                    "or paste authorized content here."
                ),
                lines=20,
            )

            source_metadata = gr.Markdown(
                build_source_metadata("")
            )

            with gr.Row():
                load_source_button = gr.Button(
                    "Load Authorized Book Source",
                    variant="primary",
                )

                clear_source_button = gr.Button(
                    "Clear Source"
                )

            source_status = gr.Markdown(
                "No authorized source loaded."
            )

        with gr.Column():
            gr.Markdown(
                "## 2. Podcast Script Output"
            )

            script_text = gr.Textbox(
                label="Editable podcast script",
                placeholder=(
                    "The podcast script will appear here."
                ),
                lines=20,
            )

            script_metadata = gr.Markdown(
                build_script_metadata("")
            )

            script_version_display = gr.Markdown(
                "**Current version:** v1.0"
            )

            with gr.Row():
                load_script_button = gr.Button(
                    "Generate Podcast Script",
                    variant="primary",
                )

                reset_script_button = gr.Button(
                    "Reset Script"
                )

            script_status = gr.Markdown(
                "Waiting for authorized source."
            )

    gr.Markdown("---")

    # -----------------------------------------------------
    # Human review
    # -----------------------------------------------------

    gr.Markdown(
        """
        ## 3. Human Review Workspace

        Review the script before narration.

        This is a manual editorial review.
        No automated fact-checking is performed.
        """
    )

    with gr.Row():

        with gr.Column():

            source_fidelity = gr.Radio(
                choices=[
                    "Pass",
                    "Needs Revision",
                    "Not Applicable",
                ],
                label="Source Fidelity",
                info=(
                    "The script preserves the central "
                    "meaning of the authorized source."
                ),
            )

            factual_accuracy = gr.Radio(
                choices=[
                    "Pass",
                    "Needs Revision",
                    "Not Applicable",
                ],
                label="Factual Accuracy",
                info=(
                    "No facts, quotations, locations, "
                    "events, or people were invented."
                ),
            )

            attribution = gr.Radio(
                choices=[
                    "Pass",
                    "Needs Revision",
                    "Not Applicable",
                ],
                label="Correct Attribution",
                info=(
                    "Personal experiences and quotations "
                    "are attributed correctly."
                ),
            )

            spoken_language = gr.Radio(
                choices=[
                    "Pass",
                    "Needs Revision",
                    "Not Applicable",
                ],
                label="Spoken Language",
                info=(
                    "The language sounds natural when "
                    "read aloud."
                ),
            )

        with gr.Column():

            tone_audience = gr.Radio(
                choices=[
                    "Pass",
                    "Needs Revision",
                    "Not Applicable",
                ],
                label="Tone and Audience",
                info=(
                    "The tone matches the intended audience "
                    "and podcast format."
                ),
            )

            episode_structure = gr.Radio(
                choices=[
                    "Pass",
                    "Needs Revision",
                    "Not Applicable",
                ],
                label="Episode Structure",
                info=(
                    "The script includes a hook, story, "
                    "takeaway, reflection, and closing."
                ),
            )

            length_pacing = gr.Radio(
                choices=[
                    "Pass",
                    "Needs Revision",
                    "Not Applicable",
                ],
                label="Length and Pacing",
                info=(
                    "The script fits the selected target "
                    "duration."
                ),
            )

            copyright_privacy = gr.Radio(
                choices=[
                    "Pass",
                    "Needs Revision",
                    "Not Applicable",
                ],
                label="Copyright and Privacy",
                info=(
                    "Only authorized content is used and "
                    "the private manuscript remains private."
                ),
            )

    with gr.Row():

        with gr.Column():
            reviewer_notes = gr.Textbox(
                label="Reviewer Notes",
                placeholder=(
                    "Record corrections, unsupported claims, "
                    "pacing issues, or editorial changes."
                ),
                lines=8,
            )

        with gr.Column():
            review_summary = gr.Markdown(
                """
                **Completed:** 0/8  
                **Passed:** 0  
                **Needs revision:** 0  
                **Not applicable:** 0
                """
            )

            final_confirmation = gr.Checkbox(
                label=(
                    "I reviewed the final script version "
                    "and confirm it is ready for narration."
                )
            )

            with gr.Row():
                request_changes_button = gr.Button(
                    "Request Changes"
                )

                approve_button = gr.Button(
                    "Approve for Narration",
                    variant="primary",
                )

            approval_status = gr.Markdown(
                create_approval_message(
                    False,
                    "v1.0",
                )
            )

    gr.Markdown("---")

    # -----------------------------------------------------
    # Downloads
    # -----------------------------------------------------

    with gr.Row():

        with gr.Column():
            gr.Markdown(
                "## Transcript Download"
            )

            prepare_transcript_button = gr.Button(
                "Prepare Transcript Download"
            )

            transcript_download = gr.File(
                label="Transcript file",
                interactive=False,
            )

            transcript_status = gr.Markdown(
                "No transcript prepared."
            )

        with gr.Column():
            gr.Markdown(
                "## 4. Narration and Audio Output"
            )

            audio_lock_status = gr.Markdown(
                "**Audio status:** Locked"
            )

            load_audio_button = gr.Button(
                "Load Authorized Demo Audio",
                variant="primary",
            )

            audio_player = gr.Audio(
                label="Podcast audio",
                type="filepath",
            )

            audio_status = gr.Markdown(
                "Audio remains locked until approval."
            )

    gr.Markdown(
        """
        ---

        **Project Team:** Paola Hintze, Marja, and John

        This prototype uses only authorized editorial material.
        The complete book manuscript remains private.

        © 2026 Paola Hintze. All rights reserved.
        """
    )

    # -----------------------------------------------------
    # Event connections
    # -----------------------------------------------------

    load_source_button.click(
        fn=load_authorized_source,
        outputs=[
            source_text,
            source_status,
            source_metadata,
        ],
    )

    clear_source_button.click(
        fn=clear_source,
        outputs=[
            source_text,
            source_status,
            source_metadata,
        ],
    )

    source_text.input(
        fn=update_source_metadata,
        inputs=[source_text],
        outputs=[source_metadata],
    )

    load_script_button.click(
        fn=generate_script_from_source,
        inputs=[source_text],
        outputs=[
            script_text,
            script_status,
            script_metadata,
            approval_state,
            script_version_state,
            approval_status,
        ],
    ).then(
        fn=lambda version: (
            f"**Current version:** {version}"
        ),
        inputs=[script_version_state],
        outputs=[script_version_display],
    )

    reset_script_button.click(
        fn=reset_script,
        outputs=[
            script_text,
            script_status,
            script_metadata,
            approval_state,
            script_version_state,
            final_confirmation,
        ],
    ).then(
        fn=lambda version: (
            f"**Current version:** {version}"
        ),
        inputs=[script_version_state],
        outputs=[script_version_display],
    ).then(
        fn=lambda approved, version: (
            create_approval_message(
                approved,
                version,
            )
        ),
        inputs=[
            approval_state,
            script_version_state,
        ],
        outputs=[approval_status],
    )

    script_text.input(
        fn=update_script_metadata,
        inputs=[script_text],
        outputs=[script_metadata],
    )

    script_text.input(
        fn=invalidate_approval_after_edit,
        inputs=[
            script_text,
            approval_state,
            script_version_state,
        ],
        outputs=[
            approval_state,
            script_version_state,
            approval_status,
        ],
    ).then(
        fn=lambda version: (
            f"**Current version:** {version}"
        ),
        inputs=[script_version_state],
        outputs=[script_version_display],
    ).then(
        fn=lambda: "**Audio status:** Locked",
        outputs=[audio_lock_status],
    )

    review_inputs = [
        source_fidelity,
        factual_accuracy,
        attribution,
        spoken_language,
        tone_audience,
        episode_structure,
        length_pacing,
        copyright_privacy,
    ]

    for review_component in review_inputs:
        review_component.change(
            fn=calculate_review_summary,
            inputs=review_inputs,
            outputs=[review_summary],
        )

    request_changes_button.click(
        fn=request_changes,
        inputs=[reviewer_notes],
        outputs=[
            approval_state,
            approval_status,
            audio_lock_status,
        ],
    )

    approve_button.click(
        fn=approve_script,
        inputs=[
            script_text,
            source_fidelity,
            factual_accuracy,
            attribution,
            spoken_language,
            tone_audience,
            episode_structure,
            length_pacing,
            copyright_privacy,
            final_confirmation,
            script_version_state,
        ],
        outputs=[
            approval_state,
            approval_status,
            audio_lock_status,
        ],
    )

    prepare_transcript_button.click(
        fn=save_transcript,
        inputs=[script_text],
        outputs=[
            transcript_download,
            transcript_status,
        ],
    )

    load_audio_button.click(
        fn=load_demo_audio,
        inputs=[approval_state],
        outputs=[
            audio_player,
            audio_status,
        ],
    )


# ---------------------------------------------------------
# Landing page + mounted Gradio application
# ---------------------------------------------------------

web_app = FastAPI(
    title="The Quality of the Question | AI Podcast Studio",
    docs_url=None,
    redoc_url=None,
)


def require_frontend_file(file_path: Path) -> Path:
    """Return a frontend file or fail with a clear HTTP 404 response."""
    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail=f"Missing required frontend file: {file_path.name}",
        )
    return file_path


@web_app.get("/", include_in_schema=False)
def landing_page() -> FileResponse:
    """Serve the custom editorial landing page."""
    return FileResponse(
        require_frontend_file(INDEX_FILE),
        media_type="text/html",
    )


@web_app.get("/style.css", include_in_schema=False)
@web_app.get("/styles.css", include_in_schema=False)
def landing_styles() -> FileResponse:
    """Serve the landing-page stylesheet."""
    return FileResponse(
        require_frontend_file(STYLE_FILE),
        media_type="text/css",
    )


@web_app.get("/script.js", include_in_schema=False)
def landing_script() -> FileResponse:
    """Serve the landing-page interaction code."""
    return FileResponse(
        require_frontend_file(SCRIPT_ASSET_FILE),
        media_type="application/javascript",
    )


@web_app.get("/api/demo/source", include_in_schema=False)
def demo_source_api() -> dict[str, str]:
    """Return the authorized demo source used by both interfaces."""
    return {"text": read_text_file(SOURCE_FILE)}


@web_app.get("/api/demo/script", include_in_schema=False)
def demo_script_api() -> dict[str, str]:
    """Return the approved demo script used by both interfaces."""
    return {"text": read_text_file(SCRIPT_FILE)}


@web_app.get("/demo-audio", include_in_schema=False)
def demo_audio() -> FileResponse:
    """Serve the approved demo MP3 without exposing the output directory."""
    if not DEMO_AUDIO_FILE.is_file():
        raise HTTPException(
            status_code=404,
            detail=(
                "Demo audio not found. Add "
                "outputs/demo/book_intro_podcast.mp3 first."
            ),
        )

    return FileResponse(
        DEMO_AUDIO_FILE,
        media_type="audio/mpeg",
        filename=DEMO_AUDIO_FILE.name,
    )


@web_app.get("/health", include_in_schema=False)
def health_check() -> dict[str, str]:
    """Small endpoint for local smoke tests and deployment checks."""
    return {"status": "ok"}


# Gradio remains the live functional studio, now available under /studio.
# The custom HTML landing page remains the first screen at the root URL.
app = gr.mount_gradio_app(
    web_app,
    demo,
    path="/studio",
)


def open_landing_page(port: int) -> None:
    """Open the local landing page after the web server starts."""
    webbrowser.open_new_tab(f"http://127.0.0.1:{port}/")


# ---------------------------------------------------------
# Application entry point
# ---------------------------------------------------------

if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "7860"))

    browser_timer = threading.Timer(
        1.0,
        open_landing_page,
        args=(port,),
    )
    browser_timer.daemon = True
    browser_timer.start()

    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info",
    )