from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

from src.models import PodcastScript


PROJECT_ROOT = Path(__file__).resolve().parents[1]

DEFAULT_OUTPUT_DIR = (
    PROJECT_ROOT
    / "outputs"
    / "generated"
)

SCRIPT_MODEL = os.getenv(
    "OPENAI_SCRIPT_MODEL",
    "gpt-4o-mini",
)

TTS_MODEL = os.getenv(
    "OPENAI_TTS_MODEL",
    "tts-1",
)

DEFAULT_VOICE = os.getenv(
    "OPENAI_TTS_VOICE",
    "nova",
)

MAX_SOURCE_CHARACTERS = 25_000
MAX_TTS_CHARACTERS = 4_096


SYSTEM_PROMPT = """
You are an expert podcast script writer adapting an authorized
excerpt from The Quality of the Question into a spoken-word episode.

Follow these rules:

- Use only information contained in the source supplied by the user.
- Preserve the author's central argument and meaning.
- Do not invent quotations, statistics, personal experiences,
  business cases, people, locations, or biographical information.
- Do not reproduce the complete source word for word.
- Adapt the material into natural spoken English.
- Use one narrator.
- Maintain a thoughtful, intelligent, reflective, and human tone.
- Include an opening hook, a brief book introduction, the relevant
  journey or context, one central story, the core lesson, key
  takeaways, one reflection question, one practical listener action,
  and a short closing teaser.
- Produce between 450 and 550 words.
- Keep the complete spoken narration below 3,900 characters.
- Return the result using the required PodcastScript structure.
""".strip()


@dataclass(frozen=True)
class EpisodeFiles:
    """
    Paths created for an approved podcast episode.
    """

    audio_path: Path
    transcript_json_path: Path
    transcript_markdown_path: Path


def get_openai_client() -> OpenAI:
    """
    Load the local API key and create an OpenAI client.
    """

    load_dotenv(PROJECT_ROOT / ".env")

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise ValueError(
            "OPENAI_API_KEY was not found. Create a .env file "
            "in the repository root and add your API key."
        )

    return OpenAI(api_key=api_key)


def validate_source_text(source_text: str) -> str:
    """
    Validate and clean the authorized source entered in the app.
    """

    cleaned_source = (source_text or "").strip()

    if not cleaned_source:
        raise ValueError(
            "The authorized source textbox is empty."
        )

    if len(cleaned_source) > MAX_SOURCE_CHARACTERS:
        raise ValueError(
            "The source is too long for this MVP. "
            f"Use no more than {MAX_SOURCE_CHARACTERS:,} characters."
        )

    return cleaned_source


def generate_podcast_script(
    source_text: str,
    client: OpenAI | None = None,
) -> PodcastScript:
    """
    Transform the textbox content into a validated podcast script.
    """

    cleaned_source = validate_source_text(source_text)
    active_client = client or get_openai_client()

    try:
        completion = active_client.chat.completions.parse(
            model=SCRIPT_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": cleaned_source,
                },
            ],
            response_format=PodcastScript,
            max_tokens=1_800,
        )
    except Exception as error:
        raise RuntimeError(
            "The podcast script could not be generated. "
            "Check the API key, internet connection, and model access. "
            f"Original error: {error}"
        ) from error

    message = completion.choices[0].message

    refusal = getattr(message, "refusal", None)

    if refusal:
        raise RuntimeError(
            f"The model declined the request: {refusal}"
        )

    podcast_script = message.parsed

    if podcast_script is None:
        raise ValueError(
            "The model did not return a valid PodcastScript response."
        )

    return podcast_script


def format_podcast_script(
    podcast_script: PodcastScript,
) -> str:
    """
    Format the structured response for editing and human review.
    """

    takeaways = "\n".join(
        f"- {takeaway}"
        for takeaway in podcast_script.key_takeaways
    )

    return f"""# {podcast_script.episode_title}

## Opening Hook

{podcast_script.opening_hook}

## Book Introduction

{podcast_script.book_introduction}

## Book Journey

{podcast_script.book_journey}

## Central Story

{podcast_script.chapter_one_story}

## Core Lesson

{podcast_script.core_lesson}

## Key Takeaways

{takeaways}

## Reflection Question

{podcast_script.reflection_question}

## Listener Action

{podcast_script.listener_action}

## Closing

{podcast_script.closing_teaser}
""".strip()


def prepare_narration_text(
    approved_script_text: str,
) -> str:
    """
    Remove Markdown formatting from the approved editable script.
    """

    if not approved_script_text or not approved_script_text.strip():
        raise ValueError(
            "The approved script is empty."
        )

    narration_lines: list[str] = []

    for original_line in approved_script_text.splitlines():
        line = original_line.strip()

        if not line:
            narration_lines.append("")
            continue

        if line.startswith("#"):
            continue

        line = re.sub(
            r"^[-*]\s+",
            "",
            line,
        )

        line = line.replace("**", "")
        line = line.replace("__", "")
        line = line.replace("*", "")
        line = line.replace("_", "")

        narration_lines.append(line)

    narration_text = "\n".join(
        narration_lines
    ).strip()

    narration_text = re.sub(
        r"\n{3,}",
        "\n\n",
        narration_text,
    )

    if not narration_text:
        raise ValueError(
            "The script does not contain narratable text."
        )

    if len(narration_text) > MAX_TTS_CHARACTERS:
        raise ValueError(
            "The approved narration is too long for one TTS request. "
            f"It contains {len(narration_text):,} characters; "
            f"the current limit is {MAX_TTS_CHARACTERS:,}. "
            "Shorten the script and approve the new version."
        )

    return narration_text


def generate_audio_bytes(
    approved_script_text: str,
    voice: str = DEFAULT_VOICE,
    client: OpenAI | None = None,
) -> bytes:
    """
    Generate MP3 audio from the approved script.
    """

    narration_text = prepare_narration_text(
        approved_script_text
    )

    active_client = client or get_openai_client()

    try:
        response = active_client.audio.speech.create(
            model=TTS_MODEL,
            voice=voice,
            input=narration_text,
            response_format="mp3",
        )
    except Exception as error:
        raise RuntimeError(
            "The podcast audio could not be generated. "
            "Check the API key, model access, and internet connection. "
            f"Original error: {error}"
        ) from error

    audio_bytes = response.content

    if not audio_bytes:
        raise ValueError(
            "The Text-to-Speech API returned an empty audio file."
        )

    return audio_bytes


def save_episode_outputs(
    approved_script_text: str,
    structured_script: PodcastScript,
    audio_bytes: bytes,
    output_directory: Path | None = None,
) -> EpisodeFiles:
    """
    Save the approved transcript and generated MP3.
    """

    if not audio_bytes:
        raise ValueError(
            "Audio data is empty and cannot be saved."
        )

    destination = (
        output_directory
        if output_directory is not None
        else DEFAULT_OUTPUT_DIR
    )

    destination.mkdir(
        parents=True,
        exist_ok=True,
    )

    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    base_name = f"book_podcast_{timestamp}"

    audio_path = destination / f"{base_name}.mp3"

    transcript_json_path = (
        destination
        / f"{base_name}_transcript.json"
    )

    transcript_markdown_path = (
        destination
        / f"{base_name}_transcript.md"
    )

    generated_at = datetime.now(
        timezone.utc
    ).isoformat()

    transcript_payload = {
        "generated_at": generated_at,
        "script_model": SCRIPT_MODEL,
        "tts_model": TTS_MODEL,
        "approved_script": approved_script_text,
        "structured_script": structured_script.model_dump(),
    }

    try:
        audio_path.write_bytes(
            audio_bytes
        )

        transcript_json_path.write_text(
            json.dumps(
                transcript_payload,
                indent=2,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )

        transcript_markdown_path.write_text(
            approved_script_text,
            encoding="utf-8",
        )
    except OSError as error:
        raise RuntimeError(
            "The generated episode files could not be saved. "
            f"Original error: {error}"
        ) from error

    return EpisodeFiles(
        audio_path=audio_path,
        transcript_json_path=transcript_json_path,
        transcript_markdown_path=transcript_markdown_path,
    )