# Mini-Project Plan

## The Quality of the Question: AI Podcast Studio

### Team Members

- Paola Hintze
- Marja
- John

---

## 1. Project Context

This project is the mini-project titled **Generate a Small Podcast from Notes**, which precedes the complete Project 1: Podcast Studio.

The purpose of this stage is to practice the essential AI podcast workflow without building a large or overly complex application.

The project will therefore remain intentionally focused:

- One short authorized book excerpt
- One AI-generated podcast script
- One narrator
- One generated audio file
- One minimal Gradio interface
- Clear error handling
- Complete GitHub documentation

The source material will be an authorized excerpt from *The Quality of the Question*, written by team member Paola Hintze.

This source satisfies the project’s text-based data-input requirement.

---

## 2. Project Overview

*The Quality of the Question: AI Podcast Studio* is a Python application that transforms an authorized excerpt from an entrepreneurship book into a short, structured podcast episode.

The application will allow the user to:

1. Load or select a short book excerpt.
2. Choose basic podcast settings.
3. Generate a podcast-style script using a language model.
4. Review and edit the generated script.
5. Convert the approved script into audio using text-to-speech.
6. Listen to the final audio.
7. Download the podcast audio and transcript.

The project will be developed collaboratively in Visual Studio Code and managed through a shared GitHub repository.

---

## 3. Problem Statement

Entrepreneurship books contain valuable ideas, stories, and practical exercises, but readers do not always have enough time to consume long-form written content.

Traditional text-to-speech tools only read the original text aloud. They do not reorganize it into a shorter and more engaging learning experience.

This project addresses that problem by using AI to transform selected book content into a concise podcast episode that preserves:

- The main argument
- The central question
- One relevant story or example
- Key takeaways
- A reflection question
- A practical action for the listener

---

## 4. Target User

The initial target user is an aspiring entrepreneur, student, or early-stage founder who wants to learn one practical entrepreneurship concept during a commute, study session, or short break.

---

## 5. Project Objective

The objective is to build and demonstrate the complete AI podcast pipeline required by the project brief.

```text
Data Input
    ↓
Text Cleaning and Preparation
    ↓
LLM Content Transformation
    ↓
Structured Podcast Script
    ↓
Human Review and Editing
    ↓
Text-to-Speech Generation
    ↓
Podcast Audio and Transcript
```

The final application must demonstrate how written source material becomes a reviewed and playable podcast episode.

---

## 6. Required Pipeline

### 6.1 Data Input

The application will process a short excerpt from *The Quality of the Question*.

For the MVP, the source will be stored as a plain-text or Markdown file.

Using plain text avoids unnecessary PDF parsing and keeps the mini-project focused on the required AI pipeline.

### 6.2 Content Transformation

A language-model API call will transform the excerpt into a structured podcast script.

The model will be instructed to:

- Use only information from the provided source
- Preserve the author’s meaning
- Adapt the content for spoken delivery
- Avoid inventing quotations, facts, statistics, or stories
- Produce a concise podcast episode
- Return a consistent structured response

### 6.3 Human Review

The generated script will appear in an editable field before audio generation.

The user must be able to review and modify the script.

This step ensures that AI assists with the creative process while the human user maintains final editorial control.

### 6.4 Audio Generation

The approved script will be sent to a text-to-speech service.

The system will generate one final audio file in MP3 format.

### 6.5 User Interface

A minimal Gradio interface will connect the complete workflow:

```text
Book Excerpt
    ↓
Generate Script
    ↓
Review or Edit Script
    ↓
Generate Audio
    ↓
Listen and Download
```

### 6.6 Error Handling

The application must display understandable user-facing messages when:

- The API key is missing
- The source text is empty
- The uploaded file is invalid
- The language-model request fails
- The model returns an invalid response
- Text-to-speech generation fails
- The output file cannot be created

---

## 7. Minimum Viable Product

The MVP will use a short authorized excerpt from Chapter 1, *The First Question*.

The first version will use a **single narrator**.

The user will be able to:

1. Load or select the authorized excerpt.
2. Choose an episode length.
3. Choose a podcast tone.
4. Choose a target audience.
5. Generate a structured podcast script.
6. Review and edit the generated script.
7. Convert the approved script into audio.
8. Listen to the audio inside the application.
9. Download the audio.
10. Download the approved transcript.

### MVP Scope Limitations

The MVP will not initially include:

- Two-speaker conversations
- Multiple voices in one episode
- Background music
- PDF parsing
- RSS feeds
- External news or data aggregation
- Speech-to-text input
- Whisper transcription
- Long-document chunking
- Multiple chapter generation
- FastAPI unless explicitly required by the instructor

These features may be considered only after the core pipeline works reliably.

---

## 8. Podcast Episode Structure

Each generated episode will follow the same editorial structure.

### 1. Episode Title

A concise title connected to the selected excerpt.

### 2. Opening Question

A short question that introduces the central topic.

### 3. Introduction

A brief explanation of what the listener will learn.

### 4. Story or Situation

One personal story or business case contained in the source excerpt.

### 5. Core Idea

A clear explanation of the excerpt’s central concept.

### 6. Practical Example

One shortened example from the source material.

### 7. Key Takeaways

Two or three important lessons.

### 8. Reflection Question

A question that encourages the listener to connect the idea to their own project.

### 9. Weekly Action

One practical exercise inspired by the source excerpt.

### 10. Closing

A short final statement connected to the theme of the book.

---

## 9. Proposed Structured AI Output

The language model should return a structured response instead of an uncontrolled block of text.

The proposed structure is:

```json
{
  "episode_title": "The First Question",
  "opening_question": "What if the problem you see is not the real problem?",
  "introduction": "Welcome to The Quality of the Question...",
  "story": "...",
  "core_idea": "...",
  "practical_example": "...",
  "key_takeaways": [
    "...",
    "...",
    "..."
  ],
  "reflection_question": "...",
  "weekly_action": "...",
  "closing": "..."
}
```

The application will validate the response before presenting it to the user or generating audio.

Pydantic may be used to define and validate this structure.

---

## 10. Prompt Guidelines

The system prompt will include rules similar to the following:

```text
Use only information contained in the provided source excerpt.

Preserve the author's central argument and meaning.

Do not invent quotations, statistics, personal experiences,
business cases, or biographical information.

Do not copy the complete excerpt word for word.

Adapt the material into a natural spoken podcast format.

Use one narrator.

Maintain a thoughtful, intelligent, direct, and human tone.

Include an opening question, key takeaways,
one reflection question, and one practical action.

Return the result using the required structured format.
```

The AI should assist with adaptation, but it should not replace human editorial review.

---

## 11. Technical Approach

### Programming Language

- Python

### Development Environment

- Visual Studio Code

### Interface

- Gradio

### Language-Model Provider

Initial recommendation:

- OpenAI API

Final provider decision must be confirmed by the group before implementation.

### Text-to-Speech Provider

Initial recommendation:

- OpenAI Text-to-Speech

This option aligns with the course example and is simpler for the MVP.

ElevenLabs may be considered later as an optional alternative.

### Supporting Libraries

Possible dependencies include:

```text
openai
gradio
python-dotenv
pydantic
```

FastAPI will only be added if the instructor confirms that a separate API layer is required.

---

## 12. Relevant Course Materials

The team should search for these course files by file name because folder structures may differ between students.

| Project Step | Course File | Relevant Pattern |
|---|---|---|
| LLM transformation | `m1_08_generative-ai.ipynb` | API calls, system and user roles, structured output, Pydantic |
| Audio generation | `tts.ipynb` | OpenAI TTS and available voices |
| Optional voice input | `stt.ipynb` | Speech-to-text patterns, not required for the MVP |
| Optional audio processing | `transformer_audio.ipynb` | Audio transformation examples, not required for the MVP |
| Optional Whisper reference | `Lab_Whisper STT Implementation.md` | Speech transcription, not required for text input |
| Transcript reference | `transcript.txt` | Plain-text transcript pattern |
| Transcript reference | `transcript.json` | Structured transcript pattern |
| Subtitle reference | `transcript.srt` | Timestamped transcript pattern |

The following are not required for this mini-project:

- PDF parsing
- RSS ingestion
- External API aggregation
- Whisper speech-to-text
- Audio recording input

---

## 13. Team Responsibilities

### Paola — Data Input, Product, and Editorial Lead

Paola will be responsible for the source material, product definition, prompt content, and editorial integrity.

#### Main Responsibilities

- Define the project concept
- Define the target user
- Select the authorized Chapter 1 excerpt
- Confirm permission to use the excerpt
- Clean and organize the source text
- Define the data structure passed to the AI pipeline
- Design the podcast episode structure
- Create and test the prompt
- Review generated scripts for accuracy
- Ensure the AI does not invent information
- Protect the complete manuscript
- Prepare the project introduction and final presentation takeaways
- Review the README and documentation

#### Main Files

```text
src/book_loader.py
src/content_manager.py
prompts/podcast_prompt.txt
data/sample_chapters/chapter_01_excerpt.md
```

---

### John — LLM and TTS Backend Lead

John will be responsible for the transformation and audio-generation pipeline.

#### Main Responsibilities

- Connect the application to the language-model API
- Generate structured podcast scripts
- Define or implement the Pydantic response model
- Validate the AI response
- Handle API errors and retries
- Connect the text-to-speech service
- Generate and save MP3 files
- Save transcript and episode metadata
- Create backend tests
- Help connect the backend to the interface

#### Main Files

```text
src/models.py
src/llm_processor.py
src/tts_generator.py
src/podcast_pipeline.py
tests/test_llm_processor.py
tests/test_tts_generator.py
tests/test_pipeline.py
```

---

### Marja — Gradio Interface, Integration, and Demo Lead

Marja will be responsible for the user interface and demonstration experience.

#### Main Responsibilities

- Build the Gradio interface
- Add source-text input or chapter selection
- Add tone, audience, length, and voice controls
- Add the script-generation button
- Display the editable podcast script
- Add the audio-generation button
- Display the audio player
- Add transcript and audio download controls
- Display loading and error messages
- Connect the interface to the backend pipeline
- Test the workflow from the user’s perspective
- Prepare interface screenshots
- Coordinate the live or recorded demonstration

#### Main Files

```text
app.py
src/ui_helpers.py
tests/test_interface.py
assets/
```

---

## 14. Shared Responsibilities

All team members will participate in:

- Repository organization
- Integration testing
- Pull-request reviews
- README writing
- Requirements-file review
- Final application testing
- Sample audio review
- Presentation rehearsal
- Q&A preparation

Every team member should understand:

1. What the application does
2. How the source text is loaded
3. How the LLM transforms the text
4. How the response is validated
5. Why human review is included
6. How the script becomes audio
7. What their personal contribution was

---

## 15. Proposed Repository Structure

```text
quality-of-the-question-podcast-studio/
│
├── app.py
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
│
├── src/
│   ├── __init__.py
│   ├── book_loader.py
│   ├── content_manager.py
│   ├── models.py
│   ├── llm_processor.py
│   ├── tts_generator.py
│   ├── podcast_pipeline.py
│   └── ui_helpers.py
│
├── prompts/
│   └── podcast_prompt.txt
│
├── data/
│   └── sample_chapters/
│       └── chapter_01_excerpt.md
│
├── outputs/
│   └── .gitkeep
│
├── private_content/
│   └── full_manuscript_not_uploaded.md
│
├── assets/
│   └── interface_preview.png
│
├── tests/
│   ├── test_book_loader.py
│   ├── test_llm_processor.py
│   ├── test_tts_generator.py
│   ├── test_pipeline.py
│   └── test_interface.py
│
└── docs/
    ├── project_plan.md
    ├── architecture.md
    ├── team_contributions.md
    └── demo_plan.md
```

The `private_content` folder will exist only on local computers and must not be uploaded to GitHub.

---

## 16. Data Structure

The project should use a clear Python data structure to pass content between modules.

Example:

```python
source_data = {
    "title": "The First Question",
    "source_type": "book_excerpt",
    "author": "Paola Hintze",
    "source_text": "...",
    "word_count": 750
}
```

A dataclass or Pydantic model may also be used.

The objective is to avoid passing unrelated loose variables between modules.

---

## 17. API Key and Cost Strategy

Before development begins, the team must decide:

- Which team member will provide the development API key
- Which provider will be used
- How API usage will be monitored
- Whether each member will use an individual key

Rules:

- API keys must be stored in `.env`
- API keys must never be committed
- `.env.example` must contain only placeholder values
- Development tests should use short excerpts
- TTS tests should use short scripts
- Audio should not be regenerated unless necessary
- At least one final high-quality audio file should be generated for the demo

Example `.env.example`:

```text
OPENAI_API_KEY=your_api_key_here
```

---

## 18. Copyright and Content Protection

The complete manuscript will not be uploaded to the public GitHub repository.

Only a short excerpt explicitly authorized by the author will be included for educational demonstration purposes.

The following files and folders must be excluded in `.gitignore`:

```text
.env
private_content/
outputs/*
!outputs/.gitkeep
*.mp3
__pycache__/
.venv/
```

### Copyright Notice

> The source manuscript, *The Quality of the Question*, is © 2026 Paola Hintze. All rights reserved. This repository contains only an authorized excerpt for educational demonstration purposes. The original manuscript may not be reproduced or redistributed.

The software will be credited separately:

> Podcast Studio software developed by Paola Hintze, Marja, and John.

---

## 19. Development Phases

### Phase 1 — Repository and Decisions

#### Tasks

- Create the shared GitHub repository
- Add Marja and John as collaborators
- Confirm that everyone can clone, pull, and push
- Create the project structure
- Add `.gitignore`
- Add `.env.example`
- Decide the LLM provider
- Decide the TTS provider
- Confirm one-narrator MVP
- Confirm the authorized excerpt
- Confirm group-coding expectations with the instructor

#### Expected Result

A shared repository with clear scope, secure configuration, and confirmed team access.

---

### Phase 2 — Data Input and Content Preparation

#### Tasks

- Prepare a short authorized excerpt
- Store it as plain text or Markdown
- Clean unnecessary formatting
- Define the source-data structure
- Load the text with Python
- Validate that the input is not empty
- Create the initial prompt

#### Owner

Paola

#### Expected Result

The project can load and validate the source text.

---

### Phase 3 — LLM Content Transformation

#### Tasks

- Connect to the selected language-model API
- Create the system and user prompts
- Generate structured output
- Validate the model response
- Convert the structured response into an editable podcast script
- Handle API and validation errors

#### Owner

John

#### Expected Result

The project can generate a complete podcast script from the command line.

---

### Phase 4 — Text-to-Speech Generation

#### Tasks

- Convert the approved script into speech
- Select one voice
- Save the result as an MP3 file
- Use unique output filenames
- Handle TTS errors
- Verify that the generated file can be played

#### Owner

John

#### Expected Result

The project can generate one clear and playable podcast audio file.

---

### Phase 5 — Gradio Interface

#### Tasks

- Add source-text input or chapter selection
- Add episode configuration controls
- Add the Generate Script button
- Display the editable script
- Add the Generate Audio button
- Display the audio player
- Add transcript download
- Add audio download
- Display user-friendly status and error messages

#### Owner

Marja

#### Expected Result

The complete workflow can be operated through the Gradio interface.

---

### Phase 6 — Integration and Testing

#### Tasks

- Connect all modules
- Test a valid excerpt
- Test empty input
- Test a missing API key
- Test invalid model output
- Test LLM failure
- Test TTS failure
- Test editing before audio generation
- Test transcript saving
- Test MP3 saving
- Test the application from a clean installation
- Confirm that no secret or private manuscript content is committed

#### Owners

All team members

#### Expected Result

A stable end-to-end application with understandable error handling.

---

### Phase 7 — Documentation and Presentation

#### Tasks

- Complete the README
- Add installation instructions
- Add environment-variable instructions
- Add the project architecture
- Add screenshots
- Add team contributions
- Generate the final sample audio
- Prepare the live or recorded demo
- Create presentation backup materials
- Rehearse the 5–7 minute presentation

#### Owners

All team members

#### Expected Result

A complete GitHub submission and a polished demonstration.

---

## 20. GitHub Workflow

The team will use one shared GitHub repository.

The `main` branch should remain stable.

Each team member should create a focused feature branch.

Suggested branches:

```text
feature/paola-data-and-prompt
feature/john-llm-and-tts
feature/marja-gradio-interface
```

Suggested workflow:

1. Pull the newest version of `main`.
2. Create or update a feature branch.
3. Complete one focused task.
4. Test the change locally.
5. Commit the change with a descriptive message.
6. Push the branch.
7. Open a pull request.
8. Ask another team member to review it.
9. Merge only after the change works.

Example commit messages:

```text
Add authorized chapter excerpt loader
Define podcast response model
Implement LLM script generation
Add OpenAI text-to-speech generation
Build editable Gradio script interface
Add missing API key handling
Document local setup process
```

The commit history should show development progress.

The team should avoid one large final commit containing the entire project.

---

## 21. Open Questions and Decisions

### Decisions Already Made

- The source is a book written by a team member.
- The repository is shared by all three team members.
- The repository has been created by Paola.
- Only an authorized excerpt will be public.
- The MVP will use text input.
- The MVP will use one narrator.
- Gradio will be used for the interface.
- The complete manuscript will remain private.

### Decisions Still Required

- Which exact Chapter 1 excerpt will be used?
- What maximum word count will be allowed?
- Which language-model provider will be used?
- Which text-to-speech provider will be used?
- Which voice will be used?
- Whose API key will be used during integration?
- Does every team member need a separate key?
- Does the instructor expect one shared codebase or independent coding?
- Is FastAPI actually required, or is Gradio sufficient?
- Should the final sample MP3 be included in GitHub or shown only during the demo?

These decisions should be resolved before major implementation begins.

---

## 22. Task Checklist

### Repository and Setup

- [x] Create shared GitHub repository
- [x] Create initial project plan
- [ ] Add Marja as a collaborator
- [ ] Add John as a collaborator
- [ ] Confirm clone, pull, and push access for all members
- [ ] Add `.gitignore`
- [ ] Add `.env.example`
- [ ] Add `requirements.txt`
- [ ] Create repository folders

### Project Decisions

- [ ] Select the exact excerpt
- [ ] Confirm the excerpt length
- [ ] Confirm LLM provider
- [ ] Confirm TTS provider
- [ ] Confirm voice
- [ ] Confirm API-key strategy
- [ ] Confirm group-coding requirements with the instructor

### Data Input

- [ ] Add authorized excerpt
- [ ] Implement text loading
- [ ] Implement input cleaning
- [ ] Implement source-data structure
- [ ] Validate empty or invalid input

### LLM Transformation

- [ ] Create the system prompt
- [ ] Create the user prompt
- [ ] Define the structured response model
- [ ] Implement the LLM API call
- [ ] Validate the response
- [ ] Convert the response into a podcast script
- [ ] Add error handling

### Audio Generation

- [ ] Implement the TTS API call
- [ ] Save MP3 output
- [ ] Add unique file names
- [ ] Handle TTS errors
- [ ] Generate one final sample audio file

### Gradio Interface

- [ ] Add text or excerpt input
- [ ] Add podcast settings
- [ ] Add Generate Script button
- [ ] Add editable script field
- [ ] Add Generate Audio button
- [ ] Add audio player
- [ ] Add audio download
- [ ] Add transcript download
- [ ] Add user-facing status messages

### Testing and Integration

- [ ] Test valid input
- [ ] Test empty input
- [ ] Test missing API key
- [ ] Test invalid AI output
- [ ] Test API failures
- [ ] Test human script editing
- [ ] Test audio generation
- [ ] Test transcript generation
- [ ] Test from a clean installation
- [ ] Verify that no secrets are committed
- [ ] Verify that the complete manuscript is not committed

### Documentation and Presentation

- [ ] Complete README
- [ ] Add setup instructions
- [ ] Add run instructions
- [ ] Add screenshots
- [ ] Add team contribution details
- [ ] Prepare sample script
- [ ] Prepare sample audio
- [ ] Prepare backup screenshots
- [ ] Prepare backup screen recording
- [ ] Rehearse presentation
- [ ] Prepare Q&A answers

---

## 23. Required Deliverables

The final submission must include:

### GitHub Repository

- Accessible to the instructors
- Organized and documented code
- Complete README
- Setup instructions
- `requirements.txt`
- `.env.example`
- All required project files
- Meaningful incremental commit history
- No exposed API keys
- No unauthorized manuscript content

### Working Podcast Pipeline

The repository must demonstrate:

1. Data input
2. LLM content transformation
3. Human script review
4. Text-to-speech generation
5. Final audio output

### Sample Audio

At least one clear example audio file must demonstrate the quality of the transformation, not only that the TTS API executed.

Whether the MP3 is stored in the repository or presented separately should be confirmed with the instructor.

### Presentation Demo

The team must provide a live or recorded demonstration of the complete workflow.

The demo should show:

```text
Input
    ↓
Script Generation
    ↓
Human Review
    ↓
Audio Generation
    ↓
Audio Playback
```

### Presentation

The presentation should last approximately 5–7 minutes, followed by Q&A.

---

## 24. Presentation Structure

### Introduction

Presented by Paola.

- Introduce the team
- Introduce the book
- Explain the mini-project context
- Explain the target user
- Present the problem

### Technical Solution

Presented by John.

- Explain the pipeline
- Explain the data structure
- Explain structured LLM output
- Explain validation
- Explain text-to-speech generation
- Explain error handling

### Live Demonstration

Presented by Marja.

- Load or select the excerpt
- Choose the podcast settings
- Generate the script
- Show the editable script
- Make one small edit
- Generate the audio
- Play a short sample
- Show the downloadable files

### Takeaways

Presented by Paola.

- Explain what the team learned
- Explain why human review matters
- Explain how the design protects the author’s meaning
- Explain what could be added in the complete Project 1 version

---

## 25. Presentation Backup Plan

The team will not depend completely on a live API connection.

Before the presentation, the team will prepare:

- One previously generated podcast script
- One previously generated MP3 file
- Screenshots of the full workflow
- A short screen recording of the application
- A local copy of the presentation materials

If the internet connection, API provider, or quota fails, the team will use the saved materials and continue explaining the workflow.

---

## 26. Evaluation Criteria

The team will use the following categories as a self-check before submission.

### Requirements Completion — 25%

The project should demonstrate:

- Data input
- LLM content transformation
- Python data structures
- Gradio interface
- Audio generation
- Error handling

### Quality and Execution — 25%

The project should include:

- Clean code organization
- Reusable modules
- Clear function responsibilities
- Structured model output
- Graceful error handling
- Meaningful commit history
- Successful end-to-end execution

### Creativity and Design — 25%

The project should demonstrate:

- A meaningful book-to-podcast concept
- Clear target-user value
- A well-structured episode
- Natural spoken content
- Clear and pleasant audio
- A usable interface

### Documentation and Presentation — 25%

The project should include:

- Clear README
- Complete setup instructions
- Useful code comments
- Team contribution documentation
- A clear 5–7 minute presentation
- A successful demonstration
- Prepared answers for Q&A

---

## 27. Definition of Done

The mini-project will be considered complete when:

- A new user can clone the repository
- The README explains how to install and run the application
- `requirements.txt` contains all dependencies
- `.env.example` explains the required environment variable
- No API keys are committed
- The complete manuscript is not committed
- The application loads a valid excerpt
- The application generates a structured podcast script
- The model response is validated
- The script can be reviewed and edited
- The approved script can be converted into audio
- The generated MP3 can be played
- The transcript can be downloaded
- Errors produce understandable messages
- At least one high-quality sample has been generated
- The project works from a clean installation
- The repository shows incremental development
- All team members can explain the complete workflow
- The team is prepared for the presentation and Q&A

---

## 28. Future Improvements

The following features are outside the mini-project MVP and may be considered for the complete Project 1 version:

- Two-speaker podcast conversations
- Multiple AI voices
- ElevenLabs voice generation
- Intro and outro music
- Automatic show notes
- Automatic episode descriptions
- Complete nine-episode season generation
- Custom text uploads
- PDF input
- Speech-to-text input
- Chapter selection
- Long-text chunking
- Batch episode generation
- Podcast history
- Word-count and duration estimation
- Episode cover generation
- FastAPI backend
- Deployment to an online platform

These features will only be considered after the required mini-project pipeline is complete and stable.
