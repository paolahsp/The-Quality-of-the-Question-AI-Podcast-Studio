# Landing Integration Guide

This package contains a ready-to-use interactive landing lab.

## Folder to copy

Copy the entire `landing` folder into the root of:

`The-Quality-of-the-Question-AI-Podcast-Studio`

Expected repository structure:

```text
The-Quality-of-the-Question-AI-Podcast-Studio/
├── landing/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── data/
│   ├── source_texts/
│   │   └── book_intro_source.md
│   └── scripts/
│       └── book_intro_podcast_script.md
├── outputs/
│   └── demo/
│       └── book_intro_podcast.mp3   # add after TTS generation
├── app.py                           # Gradio app
└── README.md
```

## Test locally

From the repository root:

```bash
python -m http.server 8000
```

Open:

`http://localhost:8000/landing/`

Do not open the HTML with a `file:///` URL because browser file loading can fail.

## Current behavior

- Loads the authorized source from the repository when available.
- Loads the approved script from the repository when available.
- Uses safe embedded fallback content when those files cannot be fetched.
- Supports editing, copy, reset, Markdown download, review decisions, notes, comparison, approval, approval invalidation, and audio locking.
- Loads demo audio from `outputs/demo/book_intro_podcast.mp3`.
- Links to local Gradio at `http://127.0.0.1:7860`.

## Before deployment

1. Generate the demo MP3 and place it at:
   `outputs/demo/book_intro_podcast.mp3`
2. Replace the local Gradio URL in `landing/index.html` with the deployed Gradio URL.
3. Test browser console for errors.
4. Confirm that `.env`, the full manuscript, and private backups are not tracked.
5. Update the main README with landing and Gradio run instructions.

## Git commands

From the repository root:

```bash
git add landing
git diff --cached --name-only
git commit -m "Add interactive podcast studio landing lab"
git push origin main
```
