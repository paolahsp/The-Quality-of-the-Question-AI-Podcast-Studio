# Project Plan

## The Quality of the Question: AI Podcast Studio

### Team Members

- Paola Hintze
- Marja
- John

---

## 1. Project Overview

*The Quality of the Question: AI Podcast Studio* is an AI-powered Python application that transforms selected excerpts from the book *The Quality of the Question* into structured, editable podcast scripts and audio episodes.

The application will allow users to select a chapter, configure the tone and length of the episode, generate a podcast script using an AI language model, review and edit the generated content, and convert the approved script into audio using text-to-speech technology.

The project will be developed collaboratively in Visual Studio Code and managed through GitHub.

---

## 2. Problem Statement

Books about entrepreneurship contain valuable knowledge, but readers may not always have enough time to consume long-form written content.

Traditional text-to-speech applications only read the original text aloud. They do not reorganize the content into a concise and engaging learning experience.

This project addresses that problem by transforming selected book content into a shorter podcast format that preserves:

- The main argument
- The central question
- An important story or example
- Key takeaways
- A practical action for the listener

---

## 3. Target User

The initial target user is an aspiring entrepreneur, student, or early-stage founder who wants to learn practical entrepreneurship concepts during a commute, study session, or short break.

---

## 4. Project Objective

The objective is to build a working AI Podcast Studio that demonstrates the complete workflow from written content to podcast audio.

The final workflow will be:

```text
Book Chapter
    ↓
Text Preparation
    ↓
AI Podcast Script Generation
    ↓
Human Review and Editing
    ↓
Text-to-Speech Generation
    ↓
Podcast Audio and Transcript
```

---

## 5. Minimum Viable Product

The first working version of the application will use an authorized excerpt from Chapter 1, *The First Question*.

The user will be able to:

1. Select a chapter.
2. Choose an episode length.
3. Choose a podcast tone.
4. Choose a target audience.
5. Generate a structured podcast script.
6. Review and edit the generated script.
7. Convert the approved script into audio.
8. Listen to the audio inside the application.
9. Download the audio and transcript.

---

## 6. Core Features

### Chapter Selection

The user can select an available book chapter or excerpt from a dropdown menu.

### Podcast Configuration

The user can select:

- Episode length
- Tone
- Target audience
- Voice

### AI Script Generation

The system generates:

- Episode title
- Opening question
- Introduction
- Main story
- Core concept
- Practical example
- Key takeaways
- Reflection question
- Weekly action
- Closing statement

### Human Review

The generated podcast script will appear in an editable text field.

The user must be able to review and modify the script before generating the audio.

This step ensures that AI assists with the creative process while the human user maintains final editorial control.

### Audio Generation

The approved script will be converted into speech and saved as an audio file.

### Downloads

The user will be able to download:

- The final podcast audio
- The approved podcast transcript

### Error Handling

The application will provide understandable messages when:

- The API key is missing
- The chapter text is empty
- An invalid option is selected
- Script generation fails
- Audio generation fails
- An output file cannot be created

---

## 7. Podcast Episode Structure

Each podcast episode will follow the same editorial format.

### 1. Opening Question

A short question that introduces the central topic.

### 2. Introduction

A brief explanation of the episode topic.

### 3. Story or Situation

A personal story or business case from the selected chapter.

### 4. Core Idea

A clear explanation of the chapter’s central concept.

### 5. Practical Example

One shortened example from the book.

### 6. Key Takeaways

Two or three important lessons.

### 7. Reflection Question

A question that encourages the listener to think about their own project.

### 8. Weekly Action

One practical exercise inspired by the chapter.

### 9. Closing

A short final statement connected to the theme of the book.

---

## 8. Team Responsibilities

### Paola — Product and Editorial Lead

Paola will be responsible for the meaning, structure, and editorial integrity of the project.

#### Main Responsibilities

- Define the project concept
- Define the target user
- Select the chapter excerpt used in the demonstration
- Organize the source content
- Design the podcast episode structure
- Create and test the AI prompt
- Review generated scripts for accuracy
- Ensure the AI does not invent information
- Write the problem statement and project description
- Prepare the introduction and final takeaways for the presentation
- Review the final README and documentation

#### Main Files

```text
src/book_loader.py
src/content_manager.py
prompts/podcast_prompt.txt
data/sample_chapters/
```

---

### John — AI Pipeline and Backend Lead

John will be responsible for the technical processing from chapter text to podcast output.

#### Main Responsibilities

- Connect the application to the AI language model
- Generate structured podcast scripts
- Validate the AI response
- Connect the text-to-speech service
- Generate and save audio files
- Save transcripts and episode metadata
- Add backend error handling
- Create backend tests

#### Main Files

```text
src/script_generator.py
src/audio_generator.py
src/podcast_pipeline.py
src/models.py
tests/test_pipeline.py
```

---

### Marja — Interface, User Experience, and Demo Lead

Marja will be responsible for the user interface and the demonstration experience.

#### Main Responsibilities

- Build the Gradio interface
- Create the chapter selection controls
- Create tone, audience, length, and voice controls
- Display the editable podcast script
- Add the audio player
- Add transcript and audio download controls
- Display loading and error messages
- Test the workflow from the user’s perspective
- Coordinate the recorded or live demonstration
- Prepare interface screenshots

#### Main Files

```text
app.py
src/ui_helpers.py
assets/
tests/test_interface.py
```

---

## 9. Shared Responsibilities

All team members will participate in:

- Repository setup
- Code reviews
- Pull-request reviews
- Integration testing
- README review
- Final application testing
- Presentation rehearsal
- Q&A preparation

Every team member should understand the complete workflow, even when they are not responsible for every file.

Each team member should be able to explain:

1. What the application does
2. How the chapter text becomes a podcast script
3. How the script becomes audio
4. Why human review is included
5. What their personal contribution was

---

## 10. Proposed Repository Structure

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
│   ├── script_generator.py
│   ├── audio_generator.py
│   ├── podcast_pipeline.py
│   ├── models.py
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
│   ├── test_script_generator.py
│   ├── test_pipeline.py
│   └── test_interface.py
│
└── docs/
    ├── project_plan.md
    ├── architecture.md
    ├── team_contributions.md
    └── demo_plan.md
```

The `private_content` folder will remain only on the local computers and will not be uploaded to GitHub.

---

## 11. Development Phases

### Phase 1 — Repository and Project Scope

#### Tasks

- Create the GitHub repository
- Add all team members as collaborators
- Create the project folders
- Create the initial README
- Add `.gitignore`
- Add `.env.example`
- Confirm the MVP
- Select the demonstration chapter

#### Expected Result

A clean repository that all team members can clone and open in Visual Studio Code.

---

### Phase 2 — Content Preparation

#### Tasks

- Prepare an authorized Chapter 1 excerpt
- Clean unnecessary formatting
- Divide the content into meaningful sections
- Create the podcast-generation prompt
- Define the structured AI output

#### Owner

Paola

#### Expected Result

The project has controlled and organized source material.

---

### Phase 3 — Script Generation

#### Tasks

- Load the selected chapter
- Send the content to the language model
- Request structured output
- Validate the generated response
- Display the result
- Save the script as a text or Markdown file

#### Owner

John

#### Expected Result

The application can generate a valid podcast script from the command line.

---

### Phase 4 — Audio Generation

#### Tasks

- Convert the approved script into speech
- Save the audio as an MP3 file
- Create unique output filenames
- Handle audio-generation errors
- Verify that the audio file can be played

#### Owner

John

#### Expected Result

The application can generate playable podcast audio.

---

### Phase 5 — Gradio Interface

#### Tasks

- Add chapter selection
- Add tone and duration options
- Add audience and voice options
- Add the script-generation button
- Display the editable script
- Add the audio-generation button
- Display the audio player
- Add download options

#### Owner

Marja

#### Expected Result

The complete application can be operated through a graphical interface.

---

### Phase 6 — Integration and Testing

#### Tasks

- Connect the interface to the backend
- Test the application from a clean installation
- Test missing API keys
- Test empty input
- Test API failures
- Test script editing
- Test audio generation
- Verify file downloads
- Review generated content for accuracy
- Remove temporary files and secrets

#### Owners

All team members

#### Expected Result

A stable application that demonstrates the complete workflow.

---

### Phase 7 — Documentation and Presentation

#### Tasks

- Complete the README
- Document installation instructions
- Document environment variables
- Add screenshots
- Complete the team contribution document
- Prepare the live or recorded demo
- Rehearse the presentation
- Prepare backup audio and screenshots

#### Owners

All team members

#### Expected Result

A complete GitHub repository and a clear 5–7 minute demonstration.

---

## 12. GitHub Workflow

The project will use the following branches:

```text
main
develop
feature/paola-content-pipeline
feature/john-ai-audio
feature/marja-gradio-interface
```

Major changes should not be made directly on the `main` branch.

Each team member should:

1. Update the `develop` branch.
2. Create a feature branch.
3. Complete a focused task.
4. Commit the changes.
5. Push the feature branch.
6. Open a pull request into `develop`.
7. Ask another team member to review the changes.

### Example Commit Messages

```text
Add chapter loading functionality
Create podcast script schema
Integrate text-to-speech generation
Build Gradio interface
Add API error handling
Document project installation
```

All file names, branches, commit messages, code comments, and documentation will be written in English.

---

## 13. AI Output Structure

The language model should return a structured response instead of an uncontrolled block of text.

The proposed structure is:

```json
{
  "episode_title": "The First Question",
  "opening_question": "What if the problem you see is not the real problem?",
  "introduction": "Welcome to The Quality of the Question...",
  "segments": [
    {
      "section": "story",
      "text": "..."
    },
    {
      "section": "core_idea",
      "text": "..."
    },
    {
      "section": "practical_example",
      "text": "..."
    }
  ],
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

The application will validate this structure before generating the audio.

---

## 14. Prompt Guidelines

The AI prompt will include the following rules:

```text
Use only information contained in the provided source chapter.

Preserve the author's central argument and meaning.

Do not invent quotations, statistics, personal experiences, business cases,
or biographical information.

Do not present the script as a direct reading of the book.

Adapt the material into a natural spoken podcast format.

Maintain a thoughtful, intelligent, direct, and human tone.

End with one reflection question and one practical action.

Return the result using the required structured format.
```

The AI should assist with adaptation, but it should not replace human editorial review.

---

## 15. Copyright and Content Protection

The complete manuscript will not be uploaded to the public GitHub repository.

The repository will contain only an authorized excerpt for educational demonstration purposes.

The following files and folders must be excluded from GitHub:

```text
.env
private_content/
outputs/
*.mp3
```

The `.gitignore` file must prevent these files from being uploaded accidentally.

### Copyright Notice

> The source manuscript, *The Quality of the Question*, is © 2026 Paola Hintze. All rights reserved. The repository contains only an authorized excerpt for educational demonstration purposes. The original manuscript may not be reproduced or redistributed.

The software will be credited separately:

> Podcast Studio software developed by Paola Hintze, Marja, and John.

---

## 16. Presentation Structure

The presentation will last approximately 5–7 minutes.

### Introduction and Problem

Presented by Paola.

- Introduce the team
- Introduce the book
- Explain the problem
- Explain the target user
- Present the project objective

### Technical Solution

Presented by John.

- Explain the AI workflow
- Explain structured script generation
- Explain response validation
- Explain text-to-speech generation
- Explain how output files are created

### Live Demonstration

Presented by Marja.

- Select the chapter
- Configure the podcast
- Generate the script
- Review the generated script
- Edit one part of the script
- Generate the audio
- Play a short audio sample
- Show the downloadable files

### Takeaways and Future Development

Presented by Paola.

- Explain the role of human review
- Explain how the design protects the author’s meaning
- Explain how the application can scale to all nine chapters
- Present possible future features

---

## 17. Presentation Backup Plan

The team will not depend completely on a live API connection during the presentation.

The team will prepare:

- One previously generated podcast script
- One previously generated MP3 file
- Screenshots of the complete workflow
- A short screen recording of the working application

If the API or internet connection fails during the live demonstration, the team will use the saved files and continue explaining the workflow.

---

## 18. Definition of Done

The project will be considered complete when:

- A new user can clone the repository
- The README contains complete setup instructions
- No API keys are committed
- The complete manuscript is not included in the repository
- The application runs in Visual Studio Code
- The user can select a chapter
- The user can configure the podcast
- The application generates a structured podcast script
- The generated script can be reviewed and edited
- The application generates playable audio
- The transcript and audio can be downloaded
- Errors produce understandable messages
- The repository is organized and documented
- The main workflow has been tested
- All three team members can explain the complete workflow

---

## 19. Future Improvements

Possible future features include:

- A two-speaker podcast format
- Multiple AI voices
- Intro and outro music
- Automatic show notes
- Automatic episode descriptions
- Complete nine-episode season generation
- Custom text uploads
- Batch episode generation
- Podcast history
- Word-count and duration estimation
- Episode cover generation

These features will only be considered after the MVP is complete and stable.
