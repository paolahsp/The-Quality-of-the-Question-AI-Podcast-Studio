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
    review: Object.create(null)
  };

  const byId = (id) => document.getElementById(id);

  function cacheElements() {
    [
      "sourceInput", "sourceStats", "loadSourceButton", "clearSourceButton",
      "generateScriptButton", "episodeTitle", "audience", "tone", "duration",
      "scriptOutput", "scriptVersion", "scriptStats", "scriptModeMessage",
      "copyScriptButton", "resetScriptButton", "downloadScriptButton",
      "reviewStatus", "reviewLocked", "reviewContent", "criteriaList",
      "reviewerNotes", "summaryCompleted", "summaryPassed", "summaryRevision",
      "compareButton", "requestChangesButton", "finalConfirmation", "approveButton",
      "approvalMeta", "audioLockMessage", "audioStatus", "audioWorkspace",
      "voiceSelector", "loadDemoAudioButton", "audioPlayer", "audioMessage", "downloadAudioLink",
      "downloadTranscriptButton", "reflectionInput", "clearReflectionButton",
      "comparisonDialog", "comparisonSource", "comparisonScript", "toast",
      "openGradioButton"
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

  function renderCriteria() {
    elements.criteriaList.replaceChildren();

    REVIEW_CRITERIA.forEach((criterion) => {
      const article = document.createElement("article");
      article.className = "criterion";

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
          invalidateApproval("Review updated. Approval must match the current review.");
          updateReviewSummary();
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
  }

  function reviewCounts() {
    const values = Object.values(state.review);
    return {
      completed: values.length,
      passed: values.filter((value) => value === "pass").length,
      revision: values.filter((value) => value === "revision").length
    };
  }

  function updateReviewSummary() {
    const counts = reviewCounts();
    elements.summaryCompleted.textContent = `${counts.completed}/${REVIEW_CRITERIA.length}`;
    elements.summaryPassed.textContent = String(counts.passed);
    elements.summaryRevision.textContent = String(counts.revision);

    const canApprove =
      Boolean(elements.scriptOutput.value.trim()) &&
      counts.completed === REVIEW_CRITERIA.length &&
      counts.revision === 0 &&
      elements.finalConfirmation.checked;

    elements.approveButton.disabled = !canApprove;

    if (!state.approved && counts.completed === REVIEW_CRITERIA.length) {
      setStatus(
        elements.reviewStatus,
        counts.revision ? "Revision Needed" : "Ready to Approve",
        counts.revision ? "danger" : "ready"
      );
    }
  }

  function lockAudio() {
    state.approved = false;
    state.approvedVersion = null;
    elements.audioWorkspace.classList.add("is-disabled");
    elements.audioWorkspace.setAttribute("aria-disabled", "true");
    elements.audioLockMessage.textContent = "Complete the human review and approve the final script before narration.";
    setStatus(elements.audioStatus, "Locked", "neutral");
    elements.approvalMeta.hidden = true;
    elements.audioPlayer.pause();
    elements.audioPlayer.hidden = true;
    elements.downloadAudioLink.classList.add("is-disabled-link");
    elements.downloadAudioLink.removeAttribute("href");
    elements.audioMessage.textContent = "No audio has been loaded yet.";
    updatePipeline();
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
    const text = await getDemoText("/api/demo/source", SAMPLE_SOURCE);
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

  async function generateScript() {
    if (!elements.sourceInput.value.trim()) {
      showToast("Add or load an authorized source first.");
      elements.sourceInput.focus();
      return;
    }

    elements.generateScriptButton.disabled = true;
    elements.generateScriptButton.textContent = "Loading Demo Script…";
    const approvedScript = await getDemoText("/api/demo/script", SAMPLE_SCRIPT);
    const title = elements.episodeTitle.value.trim() || "Why Better Questions Build Better Businesses";
    const script = approvedScript.replace(/^#\s+.*$/m, `# ${title}`);

    state.version += 1;
    state.initialScript = script;
    elements.scriptOutput.value = script;
    elements.scriptModeMessage.textContent = `Approved demo script loaded · ${elements.audience.value} · ${elements.tone.value} · ${elements.duration.value}`;
    elements.generateScriptButton.disabled = false;
    elements.generateScriptButton.textContent = "Generate Podcast Script";
    lockAudio();
    clearReviewSelections();
    unlockReview();
    updateScriptStats();
    elements.reviewContent.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Demo script ready for human review.");
  }

  function resetScript() {
    invalidateApproval();
    elements.scriptOutput.value = state.initialScript;
    state.version += 1;
    clearReviewSelections();
    unlockReview();
    updateScriptStats();
    elements.scriptModeMessage.textContent = state.initialScript
      ? "Script restored to the last loaded demo version."
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
    elements.audioLockMessage.textContent = `Script v${state.version}.0 is approved and ready for narration.`;
    setStatus(elements.audioStatus, "Unlocked", "approved");
    setStatus(elements.reviewStatus, "Approved", "approved");
    elements.approvalMeta.hidden = false;
    elements.approvalMeta.textContent = `Approved: v${state.version}.0 · ${approvedAt.toLocaleString()}`;
    updatePipeline();
    showToast("Script approved. Audio workspace unlocked.");
  }

  function loadDemoAudio() {
    if (!state.approved) {
      showToast("Approve the current script before loading audio.");
      return;
    }

    elements.audioMessage.textContent = "Loading demo audio…";
    elements.audioPlayer.hidden = false;
    elements.audioPlayer.src = `/demo-audio?v=${Date.now()}`;
    elements.audioPlayer.load();
  }

  function configureLiveStudioLink() {
    const servedByPython = window.location.port === "7860";
    elements.openGradioButton.href = servedByPython
      ? `${window.location.origin}/studio/`
      : "http://127.0.0.1:7860/studio/";
  }

  function bindEvents() {
    elements.sourceInput.addEventListener("input", updateSourceStats);
    elements.scriptOutput.addEventListener("input", () => {
      invalidateApproval("The script changed, so its approval was removed.");
      unlockReview();
      updateScriptStats();
      updateReviewSummary();
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
    elements.finalConfirmation.addEventListener("change", updateReviewSummary);
    elements.approveButton.addEventListener("click", approveScript);
    elements.loadDemoAudioButton.addEventListener("click", loadDemoAudio);
    elements.downloadTranscriptButton.addEventListener("click", () => {
      downloadText("podcast_transcript.txt", elements.scriptOutput.value, "text/plain;charset=utf-8");
    });
    elements.clearReflectionButton.addEventListener("click", () => {
      elements.reflectionInput.value = "";
      sessionStorage.removeItem("podcast-studio-reflection");
      showToast("Reflection cleared.");
    });
    elements.reflectionInput.addEventListener("input", () => {
      sessionStorage.setItem("podcast-studio-reflection", elements.reflectionInput.value);
    });
    elements.audioPlayer.addEventListener("canplay", () => {
      elements.audioMessage.textContent = `Demo audio ready · ${elements.voiceSelector?.value || "Selected narrator"}`;
      elements.downloadAudioLink.href = "/demo-audio";
      elements.downloadAudioLink.download = "book_intro_podcast.mp3";
      elements.downloadAudioLink.classList.remove("is-disabled-link");
      setStatus(elements.audioStatus, "Audio Ready", "approved");
    });
    elements.audioPlayer.addEventListener("error", () => {
      elements.audioPlayer.hidden = true;
      elements.audioMessage.textContent = "Demo audio was not found. Add outputs/demo/book_intro_podcast.mp3 and try again.";
      setStatus(elements.audioStatus, "Audio Missing", "danger");
      showToast("Demo audio file not found.");
    });
  }

  function initialize() {
    cacheElements();
    renderCriteria();
    bindEvents();
    configureLiveStudioLink();
    elements.reflectionInput.value = sessionStorage.getItem("podcast-studio-reflection") || "";
    updateSourceStats();
    updateScriptStats();
    unlockReview();
    updateReviewSummary();
    lockAudio();
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();