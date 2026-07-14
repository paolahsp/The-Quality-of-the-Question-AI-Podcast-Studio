# Development Environment Setup

## The Quality of the Question: AI Podcast Studio

This guide explains how every team member should configure the project development environment using:

- Windows
- Visual Studio Code
- Git Bash
- Anaconda or Miniconda
- Python
- Jupyter Notebooks
- Git and GitHub

The team will use the same environment configuration for both Python scripts and Jupyter Notebooks.

---

## 1. Standard Team Configuration

Every team member should use the following project configuration:

| Setting | Project Standard |
|---|---|
| Operating system | Windows |
| Code editor | Visual Studio Code |
| Terminal | Git Bash |
| Environment manager | Conda |
| Python version | Python 3.11 |
| Conda environment name | `podcast-studio-env` |
| Python script format | `.py` |
| Notebook format | `.ipynb` |
| Main interface | Gradio |
| Source control | Git and GitHub |

Using the same Python version and dependencies reduces differences between team members’ computers.

Each team member creates the environment locally. The environment itself is not uploaded to GitHub.

---

## 2. Required Software

Before cloning the repository, confirm that the following software is installed:

- Git for Windows
- Git Bash
- Anaconda or Miniconda
- Visual Studio Code

In Visual Studio Code, install these extensions:

1. **Python**, published by Microsoft
2. **Jupyter**, published by Microsoft
3. **Pylance**, published by Microsoft

Optional extensions:

- GitHub Pull Requests
- GitLens
- Markdown All in One

---

## 3. Clone the Repository

Open Git Bash in the folder where the project should be stored.

Clone the shared repository:

```bash
git clone <(https://github.com/paolahsp/The-Quality-of-the-Question-AI-Podcast-Studio/tree/main)>
```

Enter the repository folder:

```bash
cd The-Quality-of-the-Question-AI-Podcast-Studio
```

Open the project in Visual Studio Code:

```bash
code .
```

Do not open only an individual Python file. Open the complete repository folder so that VS Code can detect the project structure and environment correctly.

---

## 4. Confirm That Conda Works in Git Bash

Open a Git Bash terminal and run:

```bash
conda --version
```

A successful result should look similar to:

```text
conda 25.x.x
```

The exact version may be different.

### If Conda Works

Continue to the environment-creation section.

### If Git Bash Shows `conda: command not found`

Open **Anaconda Prompt** from the Windows Start menu and run:

```bash
conda init bash
```

Then:

1. Close Anaconda Prompt.
2. Close every Git Bash terminal.
3. Close Visual Studio Code.
4. Reopen Visual Studio Code.
5. Open a new Git Bash terminal.
6. Run:

```bash
conda --version
```

If Conda is still unavailable, verify that Anaconda or Miniconda was installed correctly before continuing.

---

## 5. Create the Conda Environment

The project environment will be named:

```text
podcast-studio-env
```

The team will use Python 3.11.

### Option A — Create the Environment from `environment.yml`

Use this option when the repository already contains an `environment.yml` file.

From the repository root, run:

```bash
conda env create -f environment.yml
```

Activate the environment:

```bash
conda activate podcast-studio-env
```

### Option B — Create the Environment Manually

Use this option during the initial repository setup if `environment.yml` does not exist yet.

Create the environment:

```bash
conda create -n podcast-studio-env python=3.11 pip -y
```

Activate it:

```bash
conda activate podcast-studio-env
```

The terminal should now begin with:

```text
(podcast-studio-env)
```

Example:

```text
(podcast-studio-env)
paola@computer MINGW64 ~/project-folder
$
```

Do not develop this project directly inside the Conda `base` environment.

---

## 6. Upgrade Pip

With the project environment active, run:

```bash
python -m pip install --upgrade pip
```

Verify that Python belongs to the project environment:

```bash
python --version
```

Expected result:

```text
Python 3.11.x
```

Check the Python location:

```bash
which python
```

The displayed path should point to the `podcast-studio-env` environment.

You can also run:

```bash
python -c "import sys; print(sys.executable)"
```

---

## 7. Install the Project Dependencies

### When `requirements.txt` Already Exists

Run:

```bash
python -m pip install -r requirements.txt
```

### During the Initial Project Setup

If `requirements.txt` does not exist yet, install the initial packages:

```bash
python -m pip install openai gradio python-dotenv pydantic pytest jupyter ipykernel
```

The initial project dependencies are:

```text
openai
gradio
python-dotenv
pydantic
pytest
jupyter
ipykernel
```

These packages support:

| Package | Purpose |
|---|---|
| `openai` | LLM and text-to-speech API access |
| `gradio` | User interface |
| `python-dotenv` | Loading API keys from `.env` |
| `pydantic` | Structured response validation |
| `pytest` | Automated testing |
| `jupyter` | Notebook support |
| `ipykernel` | Connecting the Conda environment to notebooks |

---

## 8. Required `requirements.txt`

The repository should contain a file named:

```text
requirements.txt
```

Initial content:

```text
openai
gradio
python-dotenv
pydantic
pytest
jupyter
ipykernel
```

Package versions may be pinned later after the complete application works correctly.

Every team member must install dependencies from this file instead of installing unrelated packages individually.

---

## 9. Recommended `environment.yml`

The repository should also contain:

```text
environment.yml
```

Recommended content:

```yaml
name: podcast-studio-env

channels:
  - defaults

dependencies:
  - python=3.11
  - pip
  - pip:
      - openai
      - gradio
      - python-dotenv
      - pydantic
      - pytest
      - jupyter
      - ipykernel
```

This file documents:

- The environment name
- The Python version
- The required Python packages

A new team member can recreate the environment with:

```bash
conda env create -f environment.yml
```

If the environment already exists and the file changes, update it with:

```bash
conda env update -n podcast-studio-env -f environment.yml --prune
```

---

## 10. Select the Python Interpreter in Visual Studio Code

After creating the environment:

1. Open the complete project folder in Visual Studio Code.
2. Press:

```text
Ctrl + Shift + P
```

3. Search for:

```text
Python: Select Interpreter
```

4. Select the interpreter named:

```text
Python 3.11 — podcast-studio-env
```

If several interpreters appear, select the one whose path belongs to the Conda environment.

The selected interpreter normally appears in the lower-right area of Visual Studio Code.

### Verify the Selected Interpreter

Create or open a Python file and run:

```python
import sys

print(sys.executable)
print(sys.version)
```

The path should reference:

```text
podcast-studio-env
```

---

## 11. Python Script Workflow

The production application will primarily use Python files.

Expected examples:

```text
app.py
src/book_loader.py
src/llm_processor.py
src/tts_generator.py
src/podcast_pipeline.py
```

### Activate the Environment

Before running Python code, open the Visual Studio Code Git Bash terminal and run:

```bash
conda activate podcast-studio-env
```

### Run a Python File

Example:

```bash
python app.py
```

Run a module:

```bash
python -m src.llm_processor
```

Run the test suite:

```bash
python -m pytest
```

Run tests with more detail:

```bash
python -m pytest -v
```

### Run a Quick Import Test

```bash
python -c "import openai, gradio, pydantic, dotenv; print('Environment setup successful')"
```

Expected output:

```text
Environment setup successful
```

---

## 12. Jupyter Notebook Workflow

Notebooks may be used for:

- Testing an LLM call
- Testing prompt variations
- Testing text-to-speech
- Inspecting structured output
- Running small experiments before moving code into `src`

Recommended notebook files:

```text
notebooks/
├── 01_llm_experiment.ipynb
├── 02_tts_experiment.ipynb
└── 03_pipeline_experiment.ipynb
```

Notebooks should be used for experimentation.

Reusable and final project logic should be moved into Python modules inside `src`.

---

## 13. Register the Notebook Kernel

Activate the environment:

```bash
conda activate podcast-studio-env
```

Register it as a Jupyter kernel:

```bash
python -m ipykernel install --user --name podcast-studio-env --display-name "Python (podcast-studio-env)"
```

A successful result should indicate that the kernel was installed.

This step normally needs to be performed only once on each computer.

---

## 14. Select the Notebook Kernel in Visual Studio Code

Open an `.ipynb` file in Visual Studio Code.

In the upper-right corner of the notebook:

1. Click **Select Kernel**.
2. Select **Python Environments**.
3. Choose:

```text
Python (podcast-studio-env)
```

Do not assume that selecting the Python interpreter automatically selects the correct notebook kernel. Verify the kernel in every notebook.

### Notebook Verification Cell

Run this as the first cell:

```python
import sys

print(sys.executable)
print(sys.version)
```

The path should reference the `podcast-studio-env` environment.

### Dependency Verification Cell

Run:

```python
import gradio
import openai
import pydantic
import dotenv

print("Notebook environment setup successful")
```

Expected output:

```text
Notebook environment setup successful
```

---

## 15. Notebook API-Key Setup

Never write an API key directly inside a notebook.

Incorrect:

```python
api_key = "sk-example-secret-key"
```

Correct:

```python
import os

from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY was not found in the .env file.")
```

Do not print the API key in notebook outputs.

Before committing a notebook:

1. Remove test secrets.
2. Review all output cells.
3. Clear any output containing private information.
4. Confirm that no manuscript content was copied unintentionally.

---

## 16. Create the Environment-Variable Files

The repository should contain:

```text
.env.example
```

Recommended content:

```text
OPENAI_API_KEY=your_api_key_here
```

Each team member creates a local `.env` file:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder with the local key:

```text
OPENAI_API_KEY=replace_with_your_real_key
```

Important rules:

- `.env.example` is uploaded to GitHub.
- `.env` is never uploaded.
- Each team member should use their own key unless the group agrees otherwise.
- Never share API keys in GitHub, Slack, email, screenshots, or notebooks.
- Never place the real key in `README.md`.

---

## 17. Required `.gitignore`

The repository `.gitignore` should include:

```gitignore
# Environment variables
.env
.env.*

# Keep the example environment file
!.env.example

# Conda and virtual environments
.venv/
venv/
env/

# Python cache
__pycache__/
*.py[cod]
*$py.class

# Test and tool cache
.pytest_cache/
.mypy_cache/
.ruff_cache/

# Jupyter
.ipynb_checkpoints/

# Generated audio and outputs
outputs/*
!outputs/.gitkeep
*.mp3
*.wav

# Private manuscript content
private_content/

# Operating system files
.DS_Store
Thumbs.db

# Visual Studio Code local settings
.vscode/
```

Before every commit, run:

```bash
git status
```

Confirm that `.env`, private manuscript files, and generated audio are not staged.

---

## 18. Recommended Daily Workflow

Each development session should begin with the following steps.

### Step 1 — Open Git Bash

Navigate to the repository:

```bash
cd ~/path/to/The-Quality-of-the-Question-AI-Podcast-Studio
```

### Step 2 — Update the Local Repository

```bash
git checkout main
git pull origin main
```

When working on a personal feature branch:

```bash
git checkout feature/your-feature-name
git pull origin feature/your-feature-name
```

### Step 3 — Activate the Environment

```bash
conda activate podcast-studio-env
```

### Step 4 — Open Visual Studio Code

```bash
code .
```

### Step 5 — Verify the Environment

```bash
python --version
python -c "import sys; print(sys.executable)"
```

### Step 6 — Run the Project

For the Python application:

```bash
python app.py
```

For tests:

```bash
python -m pytest
```

For notebooks:

1. Open the `.ipynb` file.
2. Confirm the selected kernel.
3. Run the environment-verification cell.

### Step 7 — Review Changes

```bash
git status
```

### Step 8 — Commit Focused Changes

```bash
git add <specific-files>
git commit -m "Describe the completed change"
git push origin <feature-branch>
```

At the end of the work session, the environment may be deactivated with:

```bash
conda deactivate
```

---

## 19. Adding a New Dependency

Do not add packages without informing the team.

When a new package is required:

1. Activate the project environment.

```bash
conda activate podcast-studio-env
```

2. Install the package.

```bash
python -m pip install package-name
```

3. Test that the project still works.

```bash
python -m pytest
```

4. Add the package to:

```text
requirements.txt
```

5. Add it under the `pip` section of:

```text
environment.yml
```

6. Commit both files with the code that requires the new dependency.

Example commit:

```text
Add audio processing dependency
```

Every team member should then update the environment:

```bash
python -m pip install -r requirements.txt
```

or:

```bash
conda env update -n podcast-studio-env -f environment.yml --prune
```

---

## 20. Python Files vs. Notebooks

The team may use both formats, but they serve different purposes.

### Python Files

Use `.py` files for:

- Final application logic
- Reusable functions
- Data loading
- API connections
- Validation
- Audio generation
- Gradio interface
- Automated tests

### Jupyter Notebooks

Use `.ipynb` files for:

- Learning API patterns
- Testing prompt ideas
- Inspecting responses
- Trying small TTS examples
- Comparing possible approaches

### Team Rule

A notebook experiment that becomes part of the final application must be rewritten as a reusable Python function inside `src`.

The final application must not depend on manually running notebook cells in a particular order.

---

## 21. Environment Verification Checklist

Every team member should confirm the following before beginning development:

- [ ] Git Bash opens correctly
- [ ] `git --version` works
- [ ] `conda --version` works
- [ ] The repository is cloned
- [ ] The complete repository folder opens in VS Code
- [ ] `podcast-studio-env` exists
- [ ] The environment activates successfully
- [ ] Python 3.11 is active
- [ ] `requirements.txt` installs successfully
- [ ] VS Code uses the correct Python interpreter
- [ ] The Jupyter notebook uses the correct kernel
- [ ] `.env` exists locally
- [ ] `.env` is ignored by Git
- [ ] The import test passes
- [ ] `python -m pytest` runs
- [ ] No private manuscript content is tracked

---

## 22. Troubleshooting

### Problem: `conda: command not found`

Open Anaconda Prompt and run:

```bash
conda init bash
```

Close and reopen Visual Studio Code and Git Bash.

---

### Problem: The Environment Does Not Activate

List available environments:

```bash
conda env list
```

Confirm that this environment exists:

```text
podcast-studio-env
```

Activate it:

```bash
conda activate podcast-studio-env
```

If it does not exist, create it:

```bash
conda create -n podcast-studio-env python=3.11 pip -y
```

---

### Problem: VS Code Uses the Wrong Python Version

Press:

```text
Ctrl + Shift + P
```

Select:

```text
Python: Select Interpreter
```

Choose:

```text
Python 3.11 — podcast-studio-env
```

Then close and reopen the terminal.

---

### Problem: The Notebook Uses the Wrong Kernel

In the notebook’s upper-right corner:

1. Click the current kernel name.
2. Select **Select Another Kernel**.
3. Select **Python Environments**.
4. Choose:

```text
Python (podcast-studio-env)
```

Verify with:

```python
import sys

print(sys.executable)
```

---

### Problem: The Kernel Does Not Appear

Activate the environment:

```bash
conda activate podcast-studio-env
```

Install and register the kernel:

```bash
python -m pip install ipykernel
python -m ipykernel install --user --name podcast-studio-env --display-name "Python (podcast-studio-env)"
```

Restart Visual Studio Code.

---

### Problem: `ModuleNotFoundError`

Confirm that the environment is active:

```bash
conda activate podcast-studio-env
```

Install the project dependencies:

```bash
python -m pip install -r requirements.txt
```

Confirm the interpreter path:

```bash
python -c "import sys; print(sys.executable)"
```

---

### Problem: The API Key Is Missing

Confirm that `.env` exists in the repository root:

```text
The-Quality-of-the-Question-AI-Podcast-Studio/
├── .env
├── app.py
└── src/
```

Confirm that `.env` contains:

```text
OPENAI_API_KEY=your_real_key
```

Do not add quotation marks unless the key contains characters that require them.

Restart the application after changing `.env`.

---

### Problem: The Application Works in a Notebook but Not in Python

The notebook may be using a different kernel from the Python interpreter.

Compare the paths.

In the notebook:

```python
import sys

print(sys.executable)
```

In Git Bash:

```bash
python -c "import sys; print(sys.executable)"
```

Both should point to the same `podcast-studio-env` environment.

---

### Problem: The Application Works for One Team Member Only

Check:

1. Python version
2. Active Conda environment
3. Selected VS Code interpreter
4. Selected notebook kernel
5. Installed requirements
6. `.env` location
7. Current Git branch
8. Latest repository changes

Run:

```bash
git status
git branch
git pull
python --version
python -m pip list
```

Do not solve team-environment differences by uploading the local environment folder to GitHub.

---

## 23. Rebuild the Environment

If the environment becomes corrupted or inconsistent, it can be recreated.

Deactivate it:

```bash
conda deactivate
```

Remove it:

```bash
conda env remove -n podcast-studio-env
```

Confirm removal:

```bash
conda env list
```

Recreate it from `environment.yml`:

```bash
conda env create -f environment.yml
```

Activate it:

```bash
conda activate podcast-studio-env
```

Register the notebook kernel again if necessary:

```bash
python -m ipykernel install --user --name podcast-studio-env --display-name "Python (podcast-studio-env)"
```

---

## 24. Expected Environment Files

After environment setup, the repository should include:

```text
The-Quality-of-the-Question-AI-Podcast-Studio/
│
├── .env.example
├── .gitignore
├── environment.yml
├── requirements.txt
│
├── app.py
│
├── src/
│
├── notebooks/
│   ├── 01_llm_experiment.ipynb
│   └── 02_tts_experiment.ipynb
│
├── tests/
│
└── docs/
    ├── project_plan.md
    └── environment_setup.md
```

The local computer will also contain:

```text
.env
```

The `.env` file must not appear in GitHub.

The Conda environment is stored by Conda outside the repository and must not be committed.

---

## 25. Final Setup Test

Activate the environment:

```bash
conda activate podcast-studio-env
```

Run:

```bash
python --version
```

Run:

```bash
python -c "import openai, gradio, pydantic, dotenv; print('All required imports succeeded')"
```

Run:

```bash
python -m pytest
```

Open a notebook and run:

```python
import sys
import gradio
import openai
import pydantic
import dotenv

print(sys.executable)
print("Python and notebook environment are ready.")
```

The environment setup is complete when:

- Python scripts use `podcast-studio-env`
- Notebooks use `Python (podcast-studio-env)`
- All required imports succeed
- Tests can run
- `.env` remains private
- Every team member can reproduce the setup independently
