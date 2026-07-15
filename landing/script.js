(() => {
  "use strict";

  const SAMPLE_SOURCE = `The quality of the question determines the quality of the answer.

In business, teams often move too quickly toward solutions. They ask how to execute an idea before asking whether they are solving the right problem. Better questions slow the rush to certainty just enough to reveal assumptions, missing voices, and new possibilities.

A useful question does more than collect information. It creates movement. It helps a team see the emotional, contextual, and systemic dimensions of a challenge before defining the problem it intends to solve.`;

  const SAMPLE_SCRIPT = `# Why Better Questions Build Better Businesses

## Opening

What if the most expensive mistake in a project is not a bad answer, but a question that was never examined?

## Introduction

Welcome to The Quality of the Question, a podcast studio for people who want to think more clearly before they act. In this episode, we explore why stronger questions help students, entrepreneurs, and teams discover the real challenge behind the obvious one.

## Core Idea

Teams often begin with execution: How can we build this? How can we launch faster? How can we convince people to use it? Those questions may sound productive, but they already contain assumptions about the solution, the audience, and the problem.

A better starting point is to ask what we may be taking for granted. Who experiences this problem? In what context? What emotional or systemic forces shape it? These questions do not delay progress. They protect the project from moving quickly in the wrong direction.

## Practical Example

Imagine a team building a new service for early-stage entrepreneurs. The team might first ask, “How do we add more features?” A stronger question could be, “At what moment do entrepreneurs feel least certain about their next decision, and what kind of support would help them move forward?” The second question changes what the team notices and what it may choose to build.

## Reflection Question

What question are you currently avoiding because the answer might force you to change direction?

## Weekly Action

Choose one active project. Write down the question guiding it today. Then identify one assumption hidden inside that question and rewrite it so that it opens a new path of inquiry.

## Closing

Better answers are useful. Better questions change what becomes possible.`;

  const REVIEW_CRITERIA = [
    {
      id: "source-fidelity",
      title: "Source Fidelity",
      description: "The script remains faithful to the authorized source and does not invent claims."
    },
    {
      id: "factual-accuracy",
      title: "Factual Accuracy",
      description: "Names, concepts, examples, and statements are accurate."
    },
    {
      id: "attribution",
      title: "Attribution",
      description: "Ideas and quotations are attributed appropriately."
    },
    {
      id: "spoken-language",
      title: "Spoken Language",
      description: "The wording sounds natural when read aloud."
    },
    {
      id: "tone-audience",
      title: "Tone and Audience",
      description: "The tone fits the intended listeners and editorial voice."
    },
    {
      id: "episode-structure",
      title: "Episode Structure",
      description: "The opening, explanation, reflection, action, and closing form a clear arc."
    },
    {
      id: "length-pacing",
      title: "Length and Pacing",
      description: "The script length and rhythm fit the selected episode duration."
    },
    {
      id: "copyright-privacy",
      title: "Copyright and Privacy",
      description: "Only authorized material is included and the complete manuscript remains private."
    }
  ];

  const elements = {};
  const state = {
    version: 1,
    approved: false,
    approvedVersion: null,
    initialScript: "",
    audioUrl: null,
    openaiConfigured: true,
    review: Object.create(null)
  };
  const REVIEW_STORAGE_KEY = "podcast-studio-review-state";
  const REFLECTION_STORAGE_KEY = "podcast-studio-reflection-parking-lot";

  const byId = (id) => document.getElementById(id);

  function cacheElements() {
    [
      "sourceInput", "sourceStats", "loadSourceButton", "clearSourceButton",
      "generateScriptButton", "episodeTitle", "audience", "tone", "duration",
      "scriptOutput", "scriptVersion", "scriptStats", "scriptModeMessage",
      "copyScriptButton", "resetScriptButton", "downloadScriptButton",
      "reviewStatus", "reviewLocked", "reviewContent", "criteriaList",
      "reviewerNotes", "summaryCompleted", "summaryPassed", "summaryRevision",
      "revisionFocusList", "revisionSavedState", "reviewWorkflowHint",
      "compareButton", "requestChangesButton", "finalConfirmation", "approveButton",
      "approvalMeta", "audioLockMessage", "audioStatus", "audioWorkspace", "audioWorkflowHint",
      "voiceSelector", "generateAudioButton", "audioPlayer", "audioMessage", "downloadAudioLink",
      "downloadTranscriptButton", "reflectionInput", "saveReflectionButton",
      "clearReflectionButton", "reflectionParkingList",
      "reflectionParkingEmpty", "clearParkingButton", "parkingCount",
      "comparisonDialog", "comparisonSource", "comparisonScript", "toast"
    ].forEach((id) => {
      elements[id] = byId(id);
    });
  }

  function countWords(text) {
    const cleaned = text.trim();
    return cleaned ? cleaned.split(/\s+/u).length : 0;
  }

  function formatDuration(text) {
    const totalSeconds = Math.round((countWords(text) / 145) * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function setStatus(element, text, variant = "neutral") {
    element.textContent = text;
    element.className = `status status--${variant}`;
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      elements.toast.hidden = true;
    }, 2800);
  }

  function updateSourceStats() {
    const text = elements.sourceInput.value;
    elements.sourceStats.textContent = `${countWords(text)} words · ${text.length} characters`;
    updatePipeline();
  }

  function updateScriptStats() {
    const text = elements.scriptOutput.value;
    elements.scriptStats.textContent = `${countWords(text)} words · ~${formatDuration(text)}`;
    elements.scriptVersion.textContent = `v${state.version}.0`;
    updatePipeline();
  }

  function updatePipeline() {
    const sourceReady = Boolean(elements.sourceInput.value.trim());
    const scriptReady = Boolean(elements.scriptOutput.value.trim());
    const reached = {
      source: true,
      script: sourceReady,
      review: scriptReady,
      audio: state.approved
    };

    document.querySelectorAll(".pipeline__step").forEach((step) => {
      step.classList.toggle("is-active", reached[step.dataset.step]);
    });
  }

  function updateCriterionAppearance(article, criterionId) {
    article.classList.remove("is-pass", "is-revision", "is-na");
    const value = state.review[criterionId];
    if (value === "pass") {
      article.classList.add("is-pass");
    } else if (value === "revision") {
      article.classList.add("is-revision");
    } else if (value === "na") {
      article.classList.add("is-na");
    }
  }

  function renderCriteria() {
    elements.criteriaList.replaceChildren();

    REVIEW_CRITERIA.forEach((criterion) => {
      const article = document.createElement("article");
      article.className = "criterion";
      updateCriterionAppearance(article, criterion.id);
      article.dataset.criterionId = criterion.id;

      const top = document.createElement("div");
      top.className = "criterion__top";

      const copy = document.createElement("div");
      const heading = document.createElement("h3");
      heading.textContent = criterion.title;
      const description = document.createElement("p");
      description.textContent = criterion.description;
      copy.append(heading, description);

      const segmented = document.createElement("div");
      segmented.className = "segmented";
      segmented.setAttribute("role", "radiogroup");
      segmented.setAttribute("aria-label", criterion.title);

      [
        ["pass", "Pass"],
        ["revision", "Needs Revision"],
        ["na", "N/A"]
      ].forEach(([value, labelText]) => {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = criterion.id;
        input.id = `${criterion.id}-${value}`;
        input.value = value;
        input.addEventListener("change", () => {
          state.review[criterion.id] = value;
          updateCriterionAppearance(article, criterion.id);
          invalidateApproval("Review updated. Approval must match the current review.");
          updateReviewSummary();
          persistReviewState();
        });

        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.textContent = labelText;
        segmented.append(input, label);
      });

      top.append(copy, segmented);
      article.append(top);
      elements.criteriaList.append(article);
    });
  }

  function unlockReview() {
    const hasScript = Boolean(elements.scriptOutput.value.trim());
    elements.reviewLocked.hidden = hasScript;
    elements.reviewContent.classList.toggle("is-disabled", !hasScript);
    elements.reviewContent.setAttribute("aria-disabled", String(!hasScript));

    if (!hasScript) {
      setStatus(elements.reviewStatus, "Not Started", "neutral");
    } else if (!state.approved) {
      setStatus(elements.reviewStatus, "In Review", "ready");
    }
  }

  function clearReviewSelections() {
    state.review = Object.create(null);
    document.querySelectorAll('#criteriaList input[type="radio"]').forEach((input) => {
      input.checked = false;
    });
    elements.finalConfirmation.checked = false;
    elements.reviewerNotes.value = "";
    updateReviewSummary();
    persistReviewState();
  }

  function reviewCounts() {
    const values = Object.values(state.review);
    return {
      completed: values.length,
      passed: values.filter((value) => value === "pass").length,
      revision: values.filter((value) => value === "revision").length
    };
  }

  function persistReviewState() {
    try {
      const snapshot = {
        review: state.review,
        notes: elements.reviewerNotes.value,
        finalConfirmation: elements.finalConfirmation.checked
      };
      window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(snapshot));
      elements.revisionSavedState.textContent = "Saved locally";
    } catch (_error) {
      elements.revisionSavedState.textContent = "Local save unavailable";
    }
  }

  function restoreReviewState() {
    try {
      const raw = window.localStorage.getItem(REVIEW_STORAGE_KEY);
      if (!raw) return;
      const snapshot = JSON.parse(raw);
      if (snapshot.review) {
        state.review = snapshot.review;
      }
      if (snapshot.notes !== undefined) {
        elements.reviewerNotes.value = snapshot.notes;
      }
      if (snapshot.finalConfirmation !== undefined) {
        elements.finalConfirmation.checked = Boolean(snapshot.finalConfirmation);
      }
      document.querySelectorAll('#criteriaList input[type="radio"]').forEach((input) => {
        const criterionId = input.name;
        const value = state.review[criterionId];
        input.checked = input.value === value;
      });
      document.querySelectorAll('#criteriaList article').forEach((article) => {
        updateCriterionAppearance(article, article.dataset.criterionId);
      });
    } catch (_error) {
      elements.revisionSavedState.textContent = "Review state could not be restored";
    }
  }

  function updateWorkflowHints() {
    const hasScript = Boolean(elements.scriptOutput.value.trim());
    const counts = reviewCounts();
    const isComplete = counts.completed === REVIEW_CRITERIA.length;

    if (!hasScript) {
      elements.reviewWorkflowHint.textContent = "Start with an authorized source and generate a script to begin review.";
      elements.reviewWorkflowHint.classList.remove("is-strong");
      elements.audioWorkflowHint.textContent = "The audio workspace stays locked until the script is approved.";
      elements.audioWorkflowHint.classList.remove("is-strong");
      return;
    }

    if (!isComplete) {
      elements.reviewWorkflowHint.textContent = `${REVIEW_CRITERIA.length - counts.completed} review criteria still need a decision before approval is possible.`;
      elements.reviewWorkflowHint.classList.add("is-strong");
      elements.audioWorkflowHint.textContent = "Complete the review checklist to unlock narration.";
      elements.audioWorkflowHint.classList.remove("is-strong");
      return;
    }

    if (counts.revision > 0) {
      elements.reviewWorkflowHint.textContent = "Revision points are flagged. Update the draft and request another review when ready.";
      elements.reviewWorkflowHint.classList.add("is-strong");
      elements.audioWorkflowHint.textContent = "The audio workspace remains locked until the revised script is approved.";
      elements.audioWorkflowHint.classList.remove("is-strong");
      return;
    }

    if (state.approved) {
      elements.reviewWorkflowHint.textContent = "The script is approved. Audio is ready to generate from this version.";
      elements.reviewWorkflowHint.classList.add("is-strong");
      elements.audioWorkflowHint.textContent = "This approved script is ready for narration.";
      elements.audioWorkflowHint.classList.add("is-strong");
      return;
    }

    elements.reviewWorkflowHint.textContent = "The checklist is complete. Confirm the final version and approve it for narration.";
    elements.reviewWorkflowHint.classList.add("is-strong");
    elements.audioWorkflowHint.textContent = "The audio workspace unlocks after approval.";
    elements.audioWorkflowHint.classList.remove("is-strong");
  }

  function updateReviewSummary() {
    const counts = reviewCounts();
    elements.summaryCompleted.textContent = `${counts.completed}/${REVIEW_CRITERIA.length}`;
    elements.summaryPassed.textContent = String(counts.passed);
    elements.summaryRevision.textContent = String(counts.revision);

    const hasScript = Boolean(elements.scriptOutput.value.trim());
    const isComplete = counts.completed === REVIEW_CRITERIA.length;
    const canApprove =
      hasScript &&
      isComplete &&
      counts.revision === 0 &&
      elements.finalConfirmation.checked;

    elements.approveButton.disabled = !canApprove;

    if (!hasScript) {
      setStatus(elements.reviewStatus, "Not Started", "neutral");
    } else if (!isComplete) {
      setStatus(elements.reviewStatus, "In Review", "ready");
    } else if (counts.revision > 0) {
      setStatus(elements.reviewStatus, "Revision Needed", "danger");
    } else {
      setStatus(elements.reviewStatus, "Ready to Approve", "ready");
    }

    if (!hasScript) {
      elements.reviewLocked.hidden = false;
      elements.reviewContent.classList.add("is-disabled");
      elements.reviewContent.setAttribute("aria-disabled", "true");
    } else {
      elements.reviewLocked.hidden = true;
      elements.reviewContent.classList.remove("is-disabled");
      elements.reviewContent.setAttribute("aria-disabled", "false");
    }

    const revisionItems = REVIEW_CRITERIA.filter((criterion) => state.review[criterion.id] === "revision");
    const noteText = elements.reviewerNotes.value.trim();
    const focusItems = [];

    if (revisionItems.length > 0) {
      revisionItems.forEach((criterion) => {
        focusItems.push(`<li><strong>${criterion.title}</strong><span>Revision requested</span></li>`);
      });
    } else if (counts.completed === REVIEW_CRITERIA.length) {
      focusItems.push(`<li><strong>Everything looks aligned.</strong><span>Ready for approval if the final confirmation is checked.</span></li>`);
    } else {
      focusItems.push(`<li><strong>${REVIEW_CRITERIA.length - counts.completed} review criteria still need a decision.</strong><span>Complete the checklist to unlock approval.</span></li>`);
    }

    if (noteText) {
      focusItems.push(`<li><strong>Reviewer notes captured.</strong><span>${noteText}</span></li>`);
    }

    elements.revisionFocusList.innerHTML = focusItems.length ? focusItems.join("") : "<li>No review issues flagged yet.</li>";

    if (isComplete && counts.revision > 0 && noteText) {
      elements.requestChangesButton.textContent = "Changes Requested";
    } else {
      elements.requestChangesButton.textContent = "Request Changes";
    }

    updateWorkflowHints();
  }

  function lockAudio() {
    state.approved = false;
    state.approvedVersion = null;
    elements.audioWorkspace.classList.add("is-disabled");
    elements.audioWorkspace.setAttribute("aria-disabled", "true");
    elements.generateAudioButton.disabled = true;
    elements.audioLockMessage.textContent = "Complete the human review and approve the final script before narration.";
    setStatus(elements.audioStatus, "Locked", "neutral");
    elements.approvalMeta.hidden = true;
    elements.audioPlayer.pause();
    elements.audioPlayer.hidden = true;
    elements.audioPlayer.removeAttribute("src");
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
      state.audioUrl = null;
    }
    elements.downloadAudioLink.classList.add("is-disabled-link");
    elements.downloadAudioLink.removeAttribute("href");
    elements.audioMessage.textContent = "No audio has been loaded yet.";
    updatePipeline();
    updateWorkflowHints();
  }

  function invalidateApproval(message) {
    if (state.approved) {
      lockAudio();
      setStatus(elements.reviewStatus, "Changed After Approval", "danger");
      if (message) showToast(message);
    }
  }

  async function getDemoText(endpoint, fallback) {
    try {
      const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      return payload.text && payload.text.trim() ? payload.text : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  async function loadSource() {
    elements.loadSourceButton.disabled = true;
    const text = await getDemoText("/api/source", SAMPLE_SOURCE);
    elements.sourceInput.value = text;
    elements.loadSourceButton.disabled = false;
    updateSourceStats();
    showToast("Authorized book sample loaded.");
  }

  function clearSource() {
    elements.sourceInput.value = "";
    updateSourceStats();
    showToast("Source cleared.");
  }

  async function readErrorMessage(response) {
    try {
      const payload = await response.json();
      return payload.detail || payload.error || `Request failed with HTTP ${response.status}.`;
    } catch (_error) {
      return `Request failed with HTTP ${response.status}.`;
    }
  }

  async function checkRuntimeStatus() {
    try {
      const response = await fetch("/health", {
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();

      state.openaiConfigured = Boolean(
        payload.openai_configured
      );

      /*
       * Script generation stays available because the
       * backend supports a local fallback draft.
       */
      elements.generateScriptButton.disabled = false;

      if (state.openaiConfigured) {
        elements.scriptModeMessage.textContent =
          "OpenAI is ready to generate a podcast script.";

        elements.audioMessage.textContent =
          "Approve the script to enable audio generation.";

        elements.generateAudioButton.disabled =
          !state.approved;
      } else {
        elements.scriptModeMessage.textContent =
          "OpenAI is not configured. Script generation will use the local fallback draft.";

        elements.audioMessage.textContent =
          "Audio generation requires an OpenAI API key.";

        elements.generateAudioButton.disabled = true;
      }
    } catch (error) {
      state.openaiConfigured = false;

      elements.generateScriptButton.disabled = false;
      elements.generateAudioButton.disabled = true;

      elements.scriptModeMessage.textContent =
        "Runtime status could not be verified. Script generation will attempt the local fallback.";

      elements.audioMessage.textContent =
        "Audio generation is unavailable until the server and API key are configured.";

      console.error(
        "Runtime status check failed:",
        error
      );
    }
  }

  async function generateScript() {
    if (!elements.sourceInput.value.trim()) {
      showToast("Add or load an authorized source first.");
      elements.sourceInput.focus();
      return;
    }

    elements.generateScriptButton.disabled = true;
    elements.generateScriptButton.textContent = "Generating Script…";
    elements.scriptModeMessage.textContent =
      state.openaiConfigured
        ? "OpenAI is transforming the authorized source…"
        : "Preparing a local fallback draft…";

    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ source_text: elements.sourceInput.value })
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const payload = await response.json();
      const generatedScript = String(payload.script || "").trim();
      if (!generatedScript) throw new Error("The server returned an empty script.");

      const requestedTitle = elements.episodeTitle.value.trim();
      const modeLabel = payload.mode === "fallback" ? "local fallback draft" : "OpenAI-generated script";
      const script = requestedTitle
        ? generatedScript.replace(/^#\s+.*$/m, `# ${requestedTitle}`)
        : generatedScript;

      state.version += 1;
      state.initialScript = script;
      elements.scriptOutput.value = script;
      elements.scriptModeMessage.textContent = `${modeLabel} · ${elements.audience.value} · ${elements.tone.value} · ${elements.duration.value}`;
      lockAudio();
      clearReviewSelections();
      unlockReview();
      updateScriptStats();
      elements.reviewContent.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast(payload.mode === "fallback" ? "A local fallback draft is ready for review." : "Podcast script ready for human review.");
    } catch (error) {
      elements.scriptModeMessage.textContent = `Script generation failed: ${error.message}`;
      showToast("The script could not be generated.");
    } finally {
      elements.generateScriptButton.disabled = false;
      elements.generateScriptButton.textContent = "Generate Podcast Script";
    }
  }

  function resetScript() {
    invalidateApproval();
    elements.scriptOutput.value = state.initialScript;
    state.version += 1;
    clearReviewSelections();
    unlockReview();
    updateScriptStats();
    elements.scriptModeMessage.textContent = state.initialScript
      ? "Script restored to the last generated version."
      : "Generate a script to begin editorial review.";
    showToast("Script reset.");
  }

  async function copyScript() {
    const text = elements.scriptOutput.value;
    if (!text.trim()) {
      showToast("There is no script to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch (_error) {
      elements.scriptOutput.select();
      document.execCommand("copy");
      elements.scriptOutput.setSelectionRange(0, 0);
    }
    showToast("Script copied to the clipboard.");
  }

  function downloadText(filename, text, type = "text/markdown;charset=utf-8") {
    if (!text.trim()) {
      showToast("There is no content to download.");
      return;
    }
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function openComparison() {
    elements.comparisonSource.textContent = elements.sourceInput.value || "No source loaded.";
    elements.comparisonScript.textContent = elements.scriptOutput.value || "No script loaded.";
    if (typeof elements.comparisonDialog.showModal === "function") {
      elements.comparisonDialog.showModal();
    } else {
      elements.comparisonDialog.setAttribute("open", "");
    }
  }

  function requestChanges() {
    const notes = elements.reviewerNotes.value.trim();
    if (!elements.scriptOutput.value.trim()) {
      showToast("Generate or load a script before requesting changes.");
      return;
    }

    if (!notes) {
      elements.reviewerNotes.focus();
      showToast("Add reviewer notes so the revision request is clear.");
      return;
    }

    lockAudio();
    elements.finalConfirmation.checked = false;
    setStatus(elements.reviewStatus, "Changes Requested", "danger");
    updateReviewSummary();
    elements.scriptOutput.focus();
    showToast("Changes requested. Edit the script, then review it again.");
  }

  function approveScript() {
    if (elements.approveButton.disabled) return;

    state.approved = true;
    state.approvedVersion = state.version;
    const approvedAt = new Date();
    elements.audioWorkspace.classList.remove("is-disabled");
    elements.audioWorkspace.setAttribute("aria-disabled", "false");
    elements.generateAudioButton.disabled = false;
    elements.audioLockMessage.textContent = `Script v${state.version}.0 is approved and ready for narration.`;
    setStatus(elements.audioStatus, "Unlocked", "approved");
    setStatus(elements.reviewStatus, "Approved", "approved");
    elements.approvalMeta.hidden = false;
    elements.approvalMeta.textContent = `Approved: v${state.version}.0 · ${approvedAt.toLocaleString()}`;
    updatePipeline();
    updateWorkflowHints();
    showToast("Script approved. Audio workspace unlocked.");
  }

  async function generateAudio() {
    if (!state.openaiConfigured) {
      showToast("OpenAI is not configured. Add an API key to enable audio generation.");
      return;
    }

    if (!state.approved) {
      showToast("Approve the current script before generating audio.");
      return;
    }
    if (state.approvedVersion !== state.version) {
      lockAudio();
      showToast("The script changed and must be approved again.");
      return;
    }

    elements.generateAudioButton.disabled = true;
    elements.generateAudioButton.textContent = "Generating Audio…";
    elements.audioMessage.textContent = "OpenAI TTS is generating the approved narration…";
    setStatus(elements.audioStatus, "Generating", "ready");

    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script_text: elements.scriptOutput.value,
          voice: elements.voiceSelector.value,
          approved: true
        })
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const audioBlob = await response.blob();
      if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
      state.audioUrl = URL.createObjectURL(audioBlob);
      elements.audioPlayer.src = state.audioUrl;
      elements.audioPlayer.hidden = false;
      elements.audioPlayer.load();
      elements.downloadAudioLink.href = state.audioUrl;
      elements.downloadAudioLink.download = "quality_of_the_question_podcast.mp3";
      elements.downloadAudioLink.classList.remove("is-disabled-link");
      elements.audioMessage.textContent = `Generated audio ready · ${elements.voiceSelector.options[elements.voiceSelector.selectedIndex].text}`;
      setStatus(elements.audioStatus, "Audio Ready", "approved");
      showToast("Approved audio generated successfully.");
    } catch (error) {
      elements.audioMessage.textContent = `Audio generation failed: ${error.message}`;
      setStatus(elements.audioStatus, "Generation Failed", "danger");
      showToast("The audio could not be generated.");
    } finally {
      elements.generateAudioButton.disabled = false;
      elements.generateAudioButton.textContent = "Generate Approved Audio";
    }
  }

  function loadParkedReflections() {
    try {
      const raw = window.localStorage.getItem(
        REFLECTION_STORAGE_KEY
      );

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (_error) {
      return [];
    }
  }

  function saveParkedReflections(reflections) {
    try {
      window.localStorage.setItem(
        REFLECTION_STORAGE_KEY,
        JSON.stringify(reflections)
      );
    } catch (_error) {
      showToast(
        "This browser could not save the reflection."
      );
    }
  }

  function renderReflectionParking() {
    const reflections = loadParkedReflections();

    elements.reflectionParkingList.replaceChildren();

    elements.reflectionParkingEmpty.hidden =
      reflections.length > 0;

    elements.parkingCount.textContent =
      `${reflections.length} saved`;

    reflections.forEach((reflection, index) => {
      const item = document.createElement("li");
      item.className = "parking-item";

      const content = document.createElement("div");
      content.className = "parking-item__content";

      const text = document.createElement("p");
      text.textContent = reflection.text;

      const timestamp = document.createElement("time");
      timestamp.dateTime = reflection.createdAt;
      timestamp.textContent = new Date(
        reflection.createdAt
      ).toLocaleString();

      content.append(text, timestamp);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "parking-item__remove";
      removeButton.textContent = "Remove";
      removeButton.setAttribute(
        "aria-label",
        `Remove reflection ${index + 1}`
      );

      removeButton.addEventListener("click", () => {
        const current = loadParkedReflections();
        current.splice(index, 1);
        saveParkedReflections(current);
        renderReflectionParking();
        showToast("Reflection removed.");
      });

      item.append(content, removeButton);
      elements.reflectionParkingList.append(item);
    });
  }

  function parkReflection() {
    const reflectionText =
      elements.reflectionInput.value.trim();

    if (!reflectionText) {
      elements.reflectionInput.focus();
      showToast(
        "Write a reflection before adding it to the parking lot."
      );
      return;
    }

    const reflections = loadParkedReflections();

    reflections.unshift({
      text: reflectionText,
      createdAt: new Date().toISOString()
    });

    saveParkedReflections(reflections);

    elements.reflectionInput.value = "";
    window.sessionStorage.removeItem(
      "podcast-studio-reflection"
    );

    renderReflectionParking();
    showToast("Reflection added to the parking lot.");
  }

  function clearReflectionParking() {
    const reflections = loadParkedReflections();

    if (reflections.length === 0) {
      showToast("The reflection parking lot is already empty.");
      return;
    }

    const confirmed = window.confirm(
      "Clear every saved reflection from the parking lot?"
    );

    if (!confirmed) {
      return;
    }

    window.localStorage.removeItem(
      REFLECTION_STORAGE_KEY
    );

    renderReflectionParking();
    showToast("Reflection parking lot cleared.");
  }

  function bindEvents() {
    elements.sourceInput.addEventListener("input", updateSourceStats);
    elements.scriptOutput.addEventListener("input", () => {
      invalidateApproval("The script changed, so its approval was removed.");
      unlockReview();
      updateScriptStats();
      updateReviewSummary();
    });
    elements.reviewerNotes.addEventListener("input", () => {
      updateReviewSummary();
      persistReviewState();
    });
    elements.loadSourceButton.addEventListener("click", loadSource);
    elements.clearSourceButton.addEventListener("click", clearSource);
    elements.generateScriptButton.addEventListener("click", generateScript);
    elements.copyScriptButton.addEventListener("click", copyScript);
    elements.resetScriptButton.addEventListener("click", resetScript);
    elements.downloadScriptButton.addEventListener("click", () => {
      downloadText("podcast_script.md", elements.scriptOutput.value);
    });
    elements.compareButton.addEventListener("click", openComparison);
    elements.requestChangesButton.addEventListener("click", requestChanges);
    elements.finalConfirmation.addEventListener("change", () => {
      updateReviewSummary();
      persistReviewState();
    });
    elements.approveButton.addEventListener("click", approveScript);
    elements.generateAudioButton.addEventListener("click", generateAudio);
    elements.downloadTranscriptButton.addEventListener("click", () => {
      downloadText("podcast_transcript.txt", elements.scriptOutput.value, "text/plain;charset=utf-8");
    });
    elements.saveReflectionButton.addEventListener(
      "click",
      parkReflection
    );

    elements.clearReflectionButton.addEventListener("click", () => {
      elements.reflectionInput.value = "";
      sessionStorage.removeItem("podcast-studio-reflection");
      showToast("Reflection draft cleared.");
    });

    elements.clearParkingButton.addEventListener(
      "click",
      clearReflectionParking
    );
    elements.reflectionInput.addEventListener("input", () => {
      sessionStorage.setItem("podcast-studio-reflection", elements.reflectionInput.value);
    });
    elements.audioPlayer.addEventListener("canplay", () => {
      setStatus(elements.audioStatus, "Audio Ready", "approved");
    });
    elements.audioPlayer.addEventListener("error", () => {
      elements.audioPlayer.hidden = true;
      elements.audioMessage.textContent = "The generated audio could not be loaded by the browser.";
      setStatus(elements.audioStatus, "Audio Error", "danger");
      showToast("Generated audio could not be loaded.");
    });
  }

  async function initialize() {
    cacheElements();
    renderCriteria();
    bindEvents();
    restoreReviewState();
    elements.reflectionInput.value =
      sessionStorage.getItem(
        "podcast-studio-reflection"
      ) || "";

    renderReflectionParking();
    updateSourceStats();
    updateScriptStats();
    unlockReview();
    updateReviewSummary();
    lockAudio();
    updateWorkflowHints();
    await checkRuntimeStatus();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initialize().catch(() => {
      elements.generateScriptButton.disabled = true;
      elements.generateAudioButton.disabled = true;
    });
  });
})();