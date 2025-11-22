import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  PlayCircleIcon,
  BookOpenIcon,
  CheckCircleIcon,
  CheckIcon,
  LockClosedIcon,
  ClockIcon,
  StarIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  CommandLineIcon,
  GlobeAltIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  FireIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function DetailedTutorials() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completedModules, setCompletedModules] = useState(new Set());
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [selectedModule, setSelectedModule] = useState(null);
  const [showModuleDetail, setShowModuleDetail] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState(new Set());

  // Complete Open Source Mastery Curriculum - 10 Detailed Modules
  const detailedModules = [
    {
      id: 1,
      title: "Git & Version Control Fundamentals",
      description: "Master the foundation of all software development - version control with Git",
      difficulty: "Beginner",
      estimatedTime: "2-3 hours",
      xpReward: 150,
      color: "from-emerald-500 to-teal-600",
      icon: CommandLineIcon,
      prerequisite: null,
      lessons: [
        {
          id: "1-1",
          title: "Understanding Version Control",
          duration: "15 minutes",
          content: {
            explanation: `# Understanding Version Control

Version control is like a time machine for your code. It tracks every change you make, who made it, and when it happened.

## Why Version Control Matters:
- **Track Changes**: See exactly what changed in your code over time
- **Collaboration**: Multiple developers can work on the same project safely
- **Backup**: Never lose your work again
- **Rollback**: Undo changes that broke something
- **Branching**: Work on features without affecting main code

## Real-World Example:
Imagine you're writing a book with 3 friends. Version control lets you:
- See who wrote which chapter
- Combine everyone's work without conflicts
- Go back to yesterday's version if needed
- Work on different chapters simultaneously`,
            
            practicalTask: `## Your First Task: Understand the Problem

Before we install Git, let's understand what happens WITHOUT version control:

### Scenario: Working Without Version Control
1. You create a file called \`my-project.txt\`
2. You make changes and save over the original
3. You realize you need the old version
4. **Problem**: It's gone forever! 😱

### With Version Control:
1. You create \`my-project.txt\` and commit it
2. You make changes and commit again  
3. You can see both versions anytime
4. **Solution**: Full history preserved! 🎉`,

            quiz: [
              {
                question: "What is the main purpose of version control?",
                options: [
                  "To make code run faster",
                  "To track changes in files over time",
                  "To compress files",
                  "To write better code"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "1-2", 
          title: "Git Installation & Setup",
          duration: "20 minutes",
          content: {
            explanation: `# Installing Git on Your System

Git is a free, open-source version control system. Let's get it installed and configured properly.`,
            
            practicalTask: `## Step 1: Download and Install Git

### For Windows:
1. Go to [git-scm.com](https://git-scm.com/download/win)
2. Download the installer
3. Run the installer with these settings:
   - ✅ Use Git from the Windows Command Prompt
   - ✅ Use the OpenSSL library
   - ✅ Checkout Windows-style, commit Unix-style line endings
   - ✅ Use Windows' default console window

### For macOS:
\`\`\`bash
# Install using Homebrew (recommended)
brew install git

# Or download from git-scm.com
\`\`\`

### For Linux (Ubuntu/Debian):
\`\`\`bash
sudo apt update
sudo apt install git
\`\`\`

## Step 2: Verify Installation
Open your terminal/command prompt and run:

\`\`\`bash
git --version
\`\`\`

You should see something like: \`git version 2.34.1\`

## Step 3: Configure Your Identity
Git needs to know who you are for commit messages:

\`\`\`bash
# Set your name (replace with your actual name)
git config --global user.name "John Doe"

# Set your email (replace with your actual email)
git config --global user.email "john@example.com"

# Verify your settings
git config --list
\`\`\`

## Step 4: Configure Your Default Editor (Optional)
\`\`\`bash
# For VS Code users
git config --global core.editor "code --wait"

# For Nano users (simple terminal editor)
git config --global core.editor "nano"
\`\`\`

## ✅ Success Check:
Run this command to see your configuration:
\`\`\`bash
git config --global --list
\`\`\``,

            commands: [
              {
                description: "Check Git version",
                command: "git --version",
                expectedOutput: "git version 2.x.x"
              },
              {
                description: "Set your name",
                command: 'git config --global user.name "Your Name"',
                expectedOutput: "No output (command succeeds silently)"
              },
              {
                description: "Set your email", 
                command: 'git config --global user.email "your.email@example.com"',
                expectedOutput: "No output (command succeeds silently)"
              },
              {
                description: "Verify configuration",
                command: "git config --list",
                expectedOutput: "Shows your name, email, and other settings"
              }
            ],

            quiz: [
              {
                question: "Which command sets your name in Git globally?",
                options: [
                  'git config user.name "John"',
                  'git config --global user.name "John"',
                  'git set name "John"',
                  'git name "John"'
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "1-3",
          title: "Basic Git Commands (init, add, commit)",
          duration: "30 minutes", 
          content: {
            explanation: `# Your First Git Repository

Now let's create your first Git repository and make your first commit!`,
            
            practicalTask: `## Step 1: Create a Project Folder
\`\`\`bash
# Create a new folder for your project
mkdir my-first-repo
cd my-first-repo
\`\`\`

## Step 2: Initialize Git Repository
\`\`\`bash
# Initialize Git in this folder
git init
\`\`\`

You should see: \`Initialized empty Git repository in .../my-first-repo/.git/\`

## Step 3: Create Your First File
\`\`\`bash
# Create a README file
echo "# My First Project" > README.md
echo "This is my first Git repository!" >> README.md
\`\`\`

## Step 4: Check Repository Status
\`\`\`bash
git status
\`\`\`

You'll see README.md listed as "untracked file"

## Step 5: Add Files to Staging Area
\`\`\`bash
# Add specific file
git add README.md

# Or add all files
git add .

# Check status again
git status
\`\`\`

Now README.md is "staged for commit"

## Step 6: Make Your First Commit
\`\`\`bash
git commit -m "Initial commit: Add README file"
\`\`\`

## Step 7: View Commit History
\`\`\`bash
git log
\`\`\`

## 🎉 Congratulations! 
You've created your first Git repository and made your first commit!

## Understanding the Git Workflow:
1. **Working Directory**: Where you edit files
2. **Staging Area**: Files ready to be committed  
3. **Repository**: Committed changes (permanent history)

\`\`\`
Working Directory → Staging Area → Repository
     (git add)         (git commit)
\`\`\``,

            commands: [
              {
                description: "Initialize Git repository",
                command: "git init",
                expectedOutput: "Initialized empty Git repository"
              },
              {
                description: "Check repository status",
                command: "git status", 
                expectedOutput: "Shows current state of files"
              },
              {
                description: "Add files to staging",
                command: "git add README.md",
                expectedOutput: "No output (succeeds silently)"
              },
              {
                description: "Make your first commit",
                command: 'git commit -m "Initial commit"',
                expectedOutput: "Shows files changed and commit hash"
              },
              {
                description: "View commit history",
                command: "git log",
                expectedOutput: "Shows commit details with hash, author, date"
              }
            ],

            quiz: [
              {
                question: "What does 'git add' do?",
                options: [
                  "Permanently saves changes",
                  "Moves files to staging area", 
                  "Deletes files",
                  "Creates a new repository"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "1-4",
          title: "Git Branching & Merging", 
          duration: "40 minutes",
          content: {
            explanation: `# Git Branching: Working on Features Safely

Branches let you work on new features without affecting your main code. Think of it like creating a parallel universe for your code!`,
            
            practicalTask: `## Step 1: Understanding Branches
Your repository starts with a 'main' (or 'master') branch. Let's see it:

\`\`\`bash
git branch
\`\`\`

The * shows your current branch.

## Step 2: Create a New Branch
\`\`\`bash
# Create and switch to new branch
git checkout -b feature-login

# Or using newer syntax
git switch -c feature-login
\`\`\`

## Step 3: Work on Your Feature
\`\`\`bash
# Create a new file for login feature
echo "# Login System" > login.md
echo "Username and password authentication" >> login.md

# Add and commit on your feature branch
git add login.md
git commit -m "Add login system documentation"
\`\`\`

## Step 4: Switch Between Branches
\`\`\`bash
# Switch back to main branch
git checkout main

# List your files - login.md won't be here!
ls

# Switch back to feature branch
git checkout feature-login

# Now login.md is back!
ls
\`\`\`

## Step 5: Merge Your Feature
\`\`\`bash
# Switch to main branch
git checkout main

# Merge the feature branch
git merge feature-login
\`\`\`

## Step 6: Clean Up
\`\`\`bash
# Delete the feature branch (it's merged now)
git branch -d feature-login

# See your updated history
git log --oneline
\`\`\`

## 🌟 Pro Tips:
- Always create feature branches from main
- Use descriptive branch names (\`feature-user-auth\`, \`fix-login-bug\`)
- Keep branches focused on one feature
- Delete merged branches to keep things clean`,

            commands: [
              {
                description: "List all branches",
                command: "git branch",
                expectedOutput: "Shows all branches, * indicates current"
              },
              {
                description: "Create and switch to new branch",
                command: "git checkout -b feature-name",
                expectedOutput: "Switched to a new branch 'feature-name'"
              },
              {
                description: "Switch to existing branch",
                command: "git checkout main",
                expectedOutput: "Switched to branch 'main'"
              },
              {
                description: "Merge branch into current branch",
                command: "git merge feature-name",
                expectedOutput: "Shows merge details and file changes"
              },
              {
                description: "Delete merged branch",
                command: "git branch -d feature-name",
                expectedOutput: "Deleted branch feature-name"
              }
            ],

            quiz: [
              {
                question: "What's the best practice for branch naming?",
                options: [
                  "Use single letters: a, b, c",
                  "Use descriptive names: feature-login",
                  "Use numbers: 1, 2, 3", 
                  "Use random names: xyz123"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "1-5",
          title: "Working with Remote Repositories",
          duration: "35 minutes",
          content: {
            explanation: `# Connecting to GitHub: Your Code in the Cloud

Remote repositories let you backup your code online and collaborate with others. GitHub is the most popular hosting service for Git repositories.`,
            
            practicalTask: `## Step 1: Create Repository on GitHub
1. Go to [github.com](https://github.com) and sign up/login
2. Click the "+" icon → "New repository"
3. Name it "my-first-repo"
4. ✅ Make it public
5. ❌ Don't initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Connect Your Local Repo to GitHub
GitHub will show you commands. Use the second option (existing repository):

\`\`\`bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/my-first-repo.git

# Verify the remote was added
git remote -v
\`\`\`

## Step 3: Push Your Code to GitHub
\`\`\`bash
# Push your main branch to GitHub
git push -u origin main
\`\`\`

The \`-u\` flag sets up tracking so future pushes can just be \`git push\`.

## Step 4: Make Changes and Push Again
\`\`\`bash
# Add some content to README
echo "" >> README.md
echo "## Features" >> README.md
echo "- Git version control" >> README.md
echo "- GitHub integration" >> README.md

# Commit and push changes
git add README.md
git commit -m "Add features section to README"
git push
\`\`\`

## Step 5: Clone from GitHub (Simulate Collaboration)
\`\`\`bash
# Go to a different folder
cd ..
mkdir test-clone
cd test-clone

# Clone your repository
git clone https://github.com/YOUR_USERNAME/my-first-repo.git
cd my-first-repo

# You now have a copy of your repo!
ls
\`\`\`

## Step 6: Pull Latest Changes
\`\`\`bash
# If someone else made changes, get them with:
git pull
\`\`\`

## 🌐 Understanding Remote Workflow:
\`\`\`
Your Computer ←→ GitHub
   (git push)   (git pull)
\`\`\`

- **push**: Upload your changes to GitHub
- **pull**: Download changes from GitHub
- **clone**: Make a local copy of a GitHub repo`,

            commands: [
              {
                description: "Add remote repository",
                command: "git remote add origin https://github.com/username/repo.git",
                expectedOutput: "No output (succeeds silently)"
              },
              {
                description: "View remote repositories",
                command: "git remote -v",
                expectedOutput: "Shows remote URLs for fetch and push"
              },
              {
                description: "Push to remote repository",
                command: "git push -u origin main",
                expectedOutput: "Shows upload progress and branch tracking"
              },
              {
                description: "Pull from remote repository",
                command: "git pull",
                expectedOutput: "Shows downloaded changes or 'Already up to date'"
              },
              {
                description: "Clone a repository",
                command: "git clone https://github.com/username/repo.git",
                expectedOutput: "Downloads repository and shows progress"
              }
            ],

            quiz: [
              {
                question: "What does 'git push' do?",
                options: [
                  "Downloads changes from GitHub",
                  "Uploads your changes to GitHub",
                  "Creates a new repository", 
                  "Deletes the remote repository"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 2,
      title: "GitHub Platform Mastery", 
      description: "Navigate GitHub like a pro - from repositories to collaboration features",
      difficulty: "Beginner",
      estimatedTime: "1-2 hours",
      xpReward: 120,
      color: "from-blue-500 to-indigo-600",
      icon: GlobeAltIcon,
      prerequisite: 1,
      lessons: [
        {
          id: "2-1",
          title: "Creating a Professional GitHub Profile",
          duration: "20 minutes",
          content: {
            explanation: `# Your GitHub Profile: Your Developer Identity

Your GitHub profile is your developer resume. It's often the first thing employers and collaborators see.`,
            
            practicalTask: `## Step 1: Complete Your Profile
1. Go to your GitHub profile: github.com/YOUR_USERNAME
2. Click "Edit profile"

## Profile Essentials:
\`\`\`markdown
Name: Your real name (helps with networking)
Bio: What you do in 1-2 sentences
Location: City, Country
Website: Your portfolio/blog
Company: Current job or "Freelance"
\`\`\`

Example Bio:
"Full-stack developer passionate about open source. Learning React and Node.js 🚀"

## Step 2: Create a Profile README
1. Create a repository named exactly like your username
2. Add a README.md file
3. This will appear on your profile!

\`\`\`bash
# Create special profile repository
mkdir YOUR_USERNAME
cd YOUR_USERNAME
git init
\`\`\`

## Step 3: Profile README Template
\`\`\`markdown
# Hi there 👋 I'm [Your Name]

## About Me
- 🔭 I'm currently working on [current project]
- 🌱 I'm currently learning [technologies]
- 💬 Ask me about [your expertise]
- 📫 How to reach me: [email/social]
- ⚡ Fun fact: [something interesting]

## Tech Stack
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)

## GitHub Stats
![Your GitHub stats](https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true)
\`\`\`

## Step 4: Pin Important Repositories
- Go to your profile
- Click "Customize your pins"
- Select your best 6 repositories
- These will show first on your profile`,

            commands: [
              {
                description: "Create profile repository",
                command: "mkdir YOUR_USERNAME && cd YOUR_USERNAME && git init",
                expectedOutput: "Creates folder and initializes Git"
              },
              {
                description: "Create profile README",
                command: "touch README.md",
                expectedOutput: "Creates empty README file"
              },
              {
                description: "Add content to README",
                command: "echo '# Hi there 👋' > README.md",
                expectedOutput: "Adds content to README"
              }
            ],

            quiz: [
              {
                question: "What's special about a repository named after your username?",
                options: [
                  "It gets more stars",
                  "It appears on your profile",
                  "It runs faster",
                  "It's automatically private"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "2-2",
          title: "Understanding GitHub Repository Structure",
          duration: "25 minutes",
          content: {
            explanation: `# Anatomy of a GitHub Repository

Every GitHub repository has standard components. Understanding these helps you navigate any project.`,
            
            practicalTask: `## Repository Components:

### 1. README.md - The Front Door
- First thing visitors see
- Explains what the project does
- Installation instructions
- Usage examples

### 2. LICENSE - Legal Framework
- Defines how others can use your code
- Common licenses: MIT, GPL, Apache
- GitHub can add license automatically

### 3. .gitignore - What NOT to Track
- Lists files Git should ignore
- Examples: node_modules/, .env, *.log
- GitHub templates for different languages

### 4. Issues Tab - Bug Reports & Features
- Track bugs and feature requests
- Community discussions
- Project management

### 5. Pull Requests - Code Contributions
- Propose changes to the code
- Code review process
- Merge approved changes

### 6. Actions Tab - Automation
- Continuous Integration/Deployment
- Automated testing
- Code quality checks

### 7. Projects Tab - Organization
- Kanban boards
- Issue tracking
- Milestone planning

## Practical Exercise: Explore a Real Repository

Visit: https://github.com/microsoft/vscode

1. **README**: See how they explain VS Code
2. **Issues**: Look for "good first issue" label
3. **Pull Requests**: See recent contributions
4. **License**: Check what license they use
5. **Contributors**: See the community

## Create Your Own Complete Repository:

\`\`\`bash
mkdir awesome-project
cd awesome-project
git init

# Create essential files
touch README.md LICENSE .gitignore

# Add content to README
cat > README.md << EOF
# Awesome Project

## Description
This project does amazing things!

## Installation
\`\`\`bash
npm install awesome-project
\`\`\`

## Usage
\`\`\`javascript
const awesome = require('awesome-project');
awesome.doSomething();
\`\`\`

## Contributing
Pull requests are welcome!

## License
MIT
EOF

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
*.log
.DS_Store
EOF

# Commit everything
git add .
git commit -m "Initial setup with README, LICENSE, and .gitignore"
\`\`\``,

            commands: [
              {
                description: "Create repository structure",
                command: "mkdir awesome-project && cd awesome-project && git init",
                expectedOutput: "Creates project folder and initializes Git"
              },
              {
                description: "Create essential files",
                command: "touch README.md LICENSE .gitignore",
                expectedOutput: "Creates empty files"
              },
              {
                description: "Check repository status",
                command: "git status",
                expectedOutput: "Shows untracked files"
              }
            ],

            quiz: [
              {
                question: "What file is automatically displayed on a repository's main page?",
                options: [
                  "index.html",
                  "README.md",
                  "main.js",
                  "package.json"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "2-3",
          title: "GitHub Issues & Project Management",
          duration: "20 minutes",
          content: {
            explanation: `# GitHub Issues: Project Communication Hub

Issues are where bugs are reported, features are requested, and discussions happen. They're essential for project management.`,
            
            practicalTask: `## Understanding Issue Types:

### 🐛 Bug Reports
- Something is broken
- Steps to reproduce
- Expected vs actual behavior

### ✨ Feature Requests
- New functionality ideas
- Use cases and benefits
- Implementation suggestions

### 📝 Documentation Issues
- Missing or unclear docs
- Examples needed
- Typo fixes

### 💬 Discussions/Questions
- How to use something
- Best practices
- General questions

## Issue Labels - Organization System:

\`\`\`
bug          - Something isn't working
enhancement  - New feature request
good first issue - Good for newcomers
help wanted - Community help needed
documentation - Documentation related
duplicate    - Issue already exists
wontfix      - Will not be implemented
\`\`\`

## Creating Your First Issue:

### Example Bug Report Template:
\`\`\`markdown
## Bug Report

### Description
Brief description of the issue

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

### Expected Behavior
What should happen

### Actual Behavior  
What actually happens

### Environment
- OS: Windows 10
- Browser: Chrome 95
- Version: 1.2.3

### Screenshots
[If applicable]
\`\`\`

## Finding Good Issues to Work On:

1. **Filter by labels**:
   - "good first issue"
   - "help wanted"  
   - "beginner friendly"

2. **Check issue age**:
   - Recent issues are more relevant
   - Old issues might be stale

3. **Read the description carefully**:
   - Understand the requirements
   - Check if anyone is already working on it

4. **Look for maintainer responses**:
   - Active projects respond to issues
   - Look for clear guidance

## Practical Exercise: Explore Issues

1. Go to: https://github.com/microsoft/vscode/issues
2. Use filters: \`is:issue is:open label:"good first issue"\`
3. Find an issue that interests you
4. Read the full discussion
5. Check if it's still open and unassigned`,

            commands: [
              {
                description: "Search for beginner issues via GitHub CLI",
                command: "gh issue list --label 'good first issue' --state open",
                expectedOutput: "Lists beginner-friendly open issues"
              },
              {
                description: "View specific issue details",
                command: "gh issue view 1234",
                expectedOutput: "Shows detailed issue information"
              }
            ],

            quiz: [
              {
                question: "What label indicates an issue suitable for new contributors?",
                options: [
                  "easy",
                  "beginner",
                  "good first issue",
                  "new contributor"
                ],
                correct: 2
              }
            ]
          }
        },
        {
          id: "2-4",
          title: "Repository Settings & Collaboration",
          duration: "15 minutes",
          content: {
            explanation: `# Repository Settings: Configuring Your Project

Proper repository settings enable smooth collaboration and project management.`,
            
            practicalTask: `## Essential Repository Settings:

### 1. General Settings
\`\`\`
Repository name: Clear, descriptive names
Description: One-sentence explanation
Website: Link to deployed app/docs
Topics: Tags for discoverability
\`\`\`

### 2. Collaboration Settings
\`\`\`
Visibility: Public vs Private
Collaborators: Who can push directly
Teams: Organize collaborators
\`\`\`

### 3. Branch Protection Rules
\`\`\`
Require pull request reviews
Require status checks to pass
Require up-to-date branches
Include administrators in restrictions
\`\`\`

### 4. Security Settings
\`\`\`
Dependency alerts: Security vulnerabilities
Secret scanning: Prevent credential leaks
Code scanning: Find security issues
\`\`\`

## Setting Up Branch Protection (Practical):

1. Go to Settings → Branches
2. Add rule for \`main\` branch
3. Enable these protections:

\`\`\`
✅ Require a pull request before merging
✅ Require approvals: 1
✅ Dismiss stale reviews when new commits pushed
✅ Require status checks to pass before merging
✅ Require branches to be up to date
✅ Include administrators
\`\`\`

## Repository Templates:

Create a template repository for future projects:

\`\`\`bash
# Structure for a good template
project-template/
├── README.md           # Project overview
├── .gitignore         # Ignore patterns
├── LICENSE            # Open source license
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       └── ci.yml     # GitHub Actions
├── src/               # Source code
├── tests/             # Test files
└── docs/              # Documentation
\`\`\`

## Adding Repository Topics:

Topics help people discover your repository:

\`\`\`
Good topics:
- javascript, react, nodejs (technologies)
- beginner-friendly, hacktoberfest (community)
- web-development, api, cli (project type)
- awesome-list, tutorial, template (content type)
\`\`\`

## Enabling GitHub Features:

### Wiki
- Project documentation
- User guides
- Tutorials

### Discussions
- Community Q&A
- Feature brainstorming
- General chat

### Projects
- Kanban boards
- Issue tracking
- Roadmap planning`,

            commands: [
              {
                description: "List repository collaborators",
                command: "gh repo view --json collaborators",
                expectedOutput: "Shows repository collaborator information"
              },
              {
                description: "Enable/disable repository features",
                command: "gh repo edit --enable-wiki=true",
                expectedOutput: "Enables wiki feature"
              }
            ],

            quiz: [
              {
                question: "What's the main benefit of branch protection rules?",
                options: [
                  "Faster development",
                  "Prevent direct pushes to main branch", 
                  "Automatic deployments",
                  "Better documentation"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 3,
      title: "Markdown Documentation Mastery",
      description: "Write beautiful documentation that developers love to read",
      difficulty: "Beginner", 
      estimatedTime: "1 hour",
      xpReward: 100,
      color: "from-purple-500 to-pink-600",
      icon: BookOpenIcon,
      prerequisite: 2,
      lessons: [
        {
          id: "3-1",
          title: "Markdown Syntax Essentials",
          duration: "20 minutes",
          content: {
            explanation: `# Markdown: The Language of Documentation

Markdown is a lightweight markup language that's easy to write and read. It's the standard for documentation on GitHub.`,
            
            practicalTask: `## Basic Markdown Syntax:

### Headers
\`\`\`markdown
# H1 - Main Title
## H2 - Section Header  
### H3 - Subsection
#### H4 - Sub-subsection
##### H5 - Minor heading
###### H6 - Smallest heading
\`\`\`

### Text Formatting
\`\`\`markdown
**Bold text** or __Bold text__
*Italic text* or _Italic text_
***Bold and italic*** or ___Bold and italic___
~~Strikethrough text~~
\`Inline code\`
\`\`\`

### Lists
\`\`\`markdown
Unordered list:
- Item 1
- Item 2
  - Nested item
  - Another nested item

Ordered list:
1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item

Checklist:
- [x] Completed item
- [ ] Todo item
- [x] Another completed item
\`\`\`

### Links and Images
\`\`\`markdown
[Link text](https://example.com)
[Link with title](https://example.com "This is a title")

![Alt text](image.png)
![Image with title](image.png "Image title")

Reference-style links:
[Link text][reference]
[reference]: https://example.com "Optional title"
\`\`\`

### Code Blocks
\`\`\`markdown
Inline code: \`const x = 1;\`

Code block:
\`\`\`
function hello() {
  console.log("Hello, world!");
}
\`\`\`

Code block with syntax highlighting:
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`
\`\`\`

## Hands-On Practice:

Create a file called \`markdown-practice.md\`:

\`\`\`bash
touch markdown-practice.md
\`\`\`

Add this content:

\`\`\`markdown
# My Awesome Project

## Description
This project helps developers **learn markdown** quickly and effectively.

## Features
- ✨ Easy to learn syntax
- 🚀 Fast rendering
- 📱 Mobile-friendly
- 🎨 Beautiful output

## Installation

\`\`\`bash
npm install awesome-project
\`\`\`

## Quick Start

\`\`\`javascript
const awesome = require('awesome-project');
console.log(awesome.greet('Developer'));
\`\`\`

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License
This project is licensed under the [MIT License](LICENSE).
\`\`\``,

            commands: [
              {
                description: "Create markdown file",
                command: "touch practice.md",
                expectedOutput: "Creates empty markdown file"
              },
              {
                description: "Preview markdown (if you have a viewer)",
                command: "markdown practice.md",
                expectedOutput: "Renders markdown to HTML"
              }
            ],

            quiz: [
              {
                question: "How do you create a level 2 header in Markdown?",
                options: [
                  "# Header",
                  "## Header",
                  "### Header",
                  "== Header =="
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "3-2",
          title: "Advanced Markdown Features",
          duration: "15 minutes",
          content: {
            explanation: `# Advanced Markdown: GitHub Flavored Markdown

GitHub extends standard Markdown with additional features for better documentation.`,
            
            practicalTask: `## Tables
\`\`\`markdown
| Feature | Supported | Notes |
|---------|-----------|-------|
| Tables | ✅ | Very useful |
| Syntax highlighting | ✅ | Many languages |
| Task lists | ✅ | Interactive |
| Emoji | 🎉 | Fun! |

Left aligned | Center aligned | Right aligned
:--- | :---: | ---:
Left | Center | Right
\`\`\`

## GitHub-Specific Features

### Task Lists (Interactive on GitHub):
\`\`\`markdown
- [x] Write documentation
- [x] Add examples  
- [ ] Test on mobile
- [ ] Get feedback
\`\`\`

### Emoji Support:
\`\`\`markdown
:rocket: :star: :bug: :bulb: :heart:
🚀 ⭐ 🐛 💡 ❤️

Common ones:
:+1: :-1: :thinking: :tada: :fire:
👍 👎 🤔 🎉 🔥
\`\`\`

### Mentions and References:
\`\`\`markdown
@username - Mention a user
#123 - Reference issue/PR number
SHA: a1b2c3d - Reference commit
\`\`\`

### Alerts/Callouts:
\`\`\`markdown
> [!NOTE]
> Useful information that users should know.

> [!TIP]
> Helpful advice for doing things better.

> [!IMPORTANT]
> Key information users need to know.

> [!WARNING]
> Urgent info that needs immediate attention.

> [!CAUTION]
> Advises about risks or negative outcomes.
\`\`\`

### Collapsible Sections:
\`\`\`markdown
<details>
<summary>Click to expand</summary>

This content is hidden by default.
You can put any markdown here:

- Lists
- **Bold text**
- Code blocks
- Images

</details>
\`\`\`

### Math Expressions (LaTeX):
\`\`\`markdown
Inline math: $x = y + 2$

Block math:
$$
\int_0^\infty e^{-x} dx = 1
$$
\`\`\`

### Mermaid Diagrams:
\`\`\`markdown
\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Do something]
    B -->|No| D[Do something else]
    C --> E[End]
    D --> E
\`\`\`
\`\`\`

### Syntax Highlighting for Many Languages:
\`\`\`markdown
\`\`\`python
def hello_world():
    print("Hello from Python!")
\`\`\`

\`\`\`sql
SELECT name, email FROM users WHERE active = 1;
\`\`\`

\`\`\`yaml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
\`\`\`
\`\`\``,

            commands: [
              {
                description: "Preview GitHub markdown locally",
                command: "gh markdown preview README.md",
                expectedOutput: "Opens browser with rendered markdown"
              }
            ],

            quiz: [
              {
                question: "How do you create a table in Markdown?",
                options: [
                  "Use <table> HTML tags",
                  "Use | pipes to separate columns",
                  "Use tabs to align columns",
                  "Use spaces to separate columns"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "3-3",
          title: "Writing Effective README Files",
          duration: "25 minutes",
          content: {
            explanation: `# The Perfect README: Your Project's First Impression

A great README can make or break a project. It's the first thing visitors see and often determines if they'll use your project.`,
            
            practicalTask: `## README Structure Template:

\`\`\`markdown
# Project Name
Brief description of what this project does

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Version](https://img.shields.io/badge/version-1.0.0-orange)]()

## 🚀 Quick Start

\`\`\`bash
# Install
npm install project-name

# Run
npm start
\`\`\`

## 📋 Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features
- 🎯 Feature 1: What it does
- 🚀 Feature 2: Another capability
- 💡 Feature 3: Why it's useful

## 🔧 Installation

### Prerequisites
- Node.js 14+ 
- npm 6+
- Git

### Steps
1. Clone the repository
   \`\`\`bash
   git clone https://github.com/username/project.git
   \`\`\`

2. Install dependencies
   \`\`\`bash
   cd project
   npm install
   \`\`\`

3. Set up environment variables
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your settings
   \`\`\`

4. Run the application
   \`\`\`bash
   npm start
   \`\`\`

## 🎮 Usage

### Basic Example
\`\`\`javascript
const project = require('project-name');

const result = project.doSomething({
  option1: 'value1',
  option2: 'value2'
});

console.log(result);
\`\`\`

### Advanced Usage
\`\`\`javascript
// More complex example
const advanced = project.configure({
  debug: true,
  retries: 3
});

advanced.process()
  .then(result => console.log(result))
  .catch(error => console.error(error));
\`\`\`

## 📖 API Documentation

### \`doSomething(options)\`
Description of what this function does.

**Parameters:**
- \`options\` (Object): Configuration object
  - \`option1\` (String): Description of option1
  - \`option2\` (Number): Description of option2

**Returns:** \`Promise<Object>\` - Description of return value

**Example:**
\`\`\`javascript
const result = await doSomething({
  option1: 'test',
  option2: 42
});
\`\`\`

## 🤝 Contributing

We love your input! We want to make contributing as easy as possible.

### Development Setup
1. Fork the repo
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

### Code Style
- Use ESLint configuration
- Follow conventional commits
- Add tests for new features

## 🧪 Running Tests

\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- tests/specific-test.js
\`\`\`

## 📚 Additional Resources
- [Documentation](https://docs.example.com)
- [Examples](https://github.com/username/project-examples)
- [Changelog](CHANGELOG.md)
- [Roadmap](https://github.com/username/project/projects/1)

## 👥 Contributors
Thanks to these wonderful people:
- [@contributor1](https://github.com/contributor1)
- [@contributor2](https://github.com/contributor2)

## 📝 License
This project is [MIT](LICENSE) licensed.

## 🙏 Acknowledgments
- Hat tip to [@someone](https://github.com/someone)
- Inspiration from [project](https://github.com/project)
- Built with [awesome-tool](https://awesome-tool.com)
\`\`\`

## Practical Exercise: Create Your README

Create a README for a fictional project:

\`\`\`bash
mkdir weather-app
cd weather-app
git init
touch README.md
\`\`\`

Fill in the README with:
1. **Clear title and description**
2. **Installation instructions** 
3. **Usage examples**
4. **Contributing guidelines**
5. **License information**

### Tips for Great READMEs:
- **Start with the problem** you're solving
- **Show, don't tell** - use examples
- **Make it scannable** - use headers and lists  
- **Keep it updated** - outdated docs are worse than none
- **Include visuals** - screenshots, GIFs, diagrams
- **Be welcoming** - encourage contributions`,

            commands: [
              {
                description: "Generate README template",
                command: "echo '# Project Title' > README.md",
                expectedOutput: "Creates README with title"
              },
              {
                description: "Validate markdown syntax",
                command: "markdownlint README.md",
                expectedOutput: "Checks for markdown issues"
              }
            ],

            quiz: [
              {
                question: "What's the most important section of a README?",
                options: [
                  "License information",
                  "Quick start/installation",
                  "Contributors list",
                  "Detailed API docs"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 4,
      title: "Open Source Project Discovery & Selection",
      description: "Learn how to find and evaluate projects perfect for your skill level and interests",
      difficulty: "Beginner-Intermediate",
      estimatedTime: "2 hours",
      xpReward: 130,
      color: "from-cyan-500 to-blue-600",
      icon: MagnifyingGlassIcon,
      prerequisite: 3,
      lessons: [
        {
          id: "4-1",
          title: "Finding Good Open Source Projects",
          duration: "30 minutes",
          content: {
            explanation: `# Discovering Your First Open Source Project

Finding the right project is crucial for a successful open source journey. Let's learn how to discover projects that match your interests and skill level.`,
            
            practicalTask: `## 🔍 GitHub Search Strategies

### 1. Search by Language
\`\`\`
language:javascript stars:>1000
language:python good-first-issue
language:react typescript
\`\`\`

### 2. Search by Topic
\`\`\`
topic:beginner-friendly
topic:documentation
topic:hacktoberfest
topic:first-timers-only
\`\`\`

### 3. Search by Label
\`\`\`
label:"good first issue"
label:"help wanted"
label:"beginner friendly"
label:"easy"
\`\`\`

### 4. Advanced Combinations
\`\`\`
language:javascript topic:react label:"good first issue" stars:>100
language:python topic:machine-learning label:"help wanted"
\`\`\`

## 🌟 Quality Project Indicators:

### Activity Signals
- ✅ Recent commits (last 30 days)
- ✅ Active issue discussions
- ✅ Regular releases
- ✅ Maintainer responses to issues

### Documentation Quality
- ✅ Clear README with setup instructions
- ✅ Contributing guidelines (CONTRIBUTING.md)
- ✅ Code of conduct
- ✅ API documentation

### Community Health
- ✅ Welcoming tone in issues
- ✅ Active discussions
- ✅ Helpful maintainers
- ✅ Diverse contributors

## 📋 Project Evaluation Checklist:

### Before Contributing, Check:
1. **Last commit**: Within 6 months?
2. **Issue response time**: Do maintainers respond within a week?
3. **Pull request activity**: Are PRs being merged regularly?
4. **Documentation**: Can you understand how to set up the project?
5. **Issue templates**: Are there templates for bug reports/features?
6. **Tests**: Does the project have automated tests?
7. **License**: Is it open source licensed?

## 🎯 Practical Exercise: Find Your First Project

### Step 1: Identify Your Interests
\`\`\`
Tech Stack: What languages/frameworks do you know?
□ JavaScript/React □ Python □ Java □ C++ 
□ CSS/HTML □ TypeScript □ Go □ Rust

Domain: What interests you?
□ Web Development □ Machine Learning □ DevOps
□ Mobile Apps □ Data Science □ Security
□ Documentation □ Testing □ Design
\`\`\`

### Step 2: Search for Projects
Go to GitHub and try these searches:

\`\`\`
# For Web Developers
language:javascript topic:react label:"good first issue" stars:>500

# For Python Developers  
language:python topic:web label:"help wanted" stars:>1000

# For Documentation Lovers
topic:documentation label:"good first issue"

# For UI/UX Enthusiasts
topic:css topic:design label:"beginner friendly"
\`\`\`

### Step 3: Evaluate 3 Projects
Create a comparison table:

| Project | Last Commit | Stars | Issues | Activity Score |
|---------|-------------|--------|---------|----------------|
| Project A | 2 days ago | 2.3k | 45 open | High |
| Project B | 1 month ago | 890 | 12 open | Medium |
| Project C | 3 months ago | 5.2k | 200 open | Low |

### Step 4: Deep Dive on Top Choice
1. Read the README thoroughly
2. Check CONTRIBUTING.md
3. Look at recent issues and PRs
4. Try to set up the project locally`,

            commands: [
              {
                description: "Search GitHub via command line",
                command: "gh search repos --language=javascript --sort=stars",
                expectedOutput: "Lists JavaScript repositories sorted by stars"
              },
              {
                description: "Search for beginner issues",
                command: 'gh search issues --label="good first issue" --state=open',
                expectedOutput: "Lists beginner-friendly open issues"
              },
              {
                description: "View repository details",
                command: "gh repo view owner/repository",
                expectedOutput: "Shows detailed repository information"
              }
            ],

            quiz: [
              {
                question: "What's the most important factor when choosing your first project?",
                options: [
                  "Number of stars",
                  "Project age",
                  "Active community and good documentation",
                  "Programming language"
                ],
                correct: 2
              }
            ]
          }
        },
        {
          id: "4-2",
          title: "Understanding Project Structure & Architecture",
          duration: "25 minutes",
          content: {
            explanation: `# Decoding Open Source Project Structure

Every project has its own organization, but most follow common patterns. Learning to read project structure quickly is a superpower!`,
            
            practicalTask: `## 📁 Common Project Structures

### Typical Web Project:
\`\`\`
awesome-web-app/
├── README.md                 # Project overview
├── package.json             # Dependencies & scripts
├── .gitignore              # Files to ignore
├── LICENSE                 # Legal terms
├── CONTRIBUTING.md         # How to contribute
├── CODE_OF_CONDUCT.md     # Community guidelines
├── .github/               # GitHub-specific files
│   ├── ISSUE_TEMPLATE/    # Issue templates
│   ├── workflows/         # CI/CD automation
│   └── PULL_REQUEST_TEMPLATE.md
├── src/                   # Source code
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions
│   └── styles/           # CSS/styling
├── public/               # Static assets
├── tests/                # Test files
├── docs/                 # Documentation
└── examples/             # Usage examples
\`\`\`

### Python Project Structure:
\`\`\`
python-project/
├── README.md
├── requirements.txt       # Python dependencies
├── setup.py              # Package installation
├── pyproject.toml        # Modern Python config
├── .python-version       # Python version
├── src/
│   └── package_name/
│       ├── __init__.py
│       ├── core.py
│       └── utils.py
├── tests/
├── docs/
└── examples/
\`\`\`

## 🔍 Key Files to Understand First

### 1. README.md - The Welcome Mat
\`\`\`markdown
Look for:
- What does this project do?
- How do I install it?
- How do I run it?
- What are the main features?
- How do I contribute?
\`\`\`

### 2. CONTRIBUTING.md - The Rulebook
\`\`\`markdown
Contains:
- Development setup instructions
- Code style guidelines
- Testing requirements
- Pull request process
- Issue reporting guidelines
\`\`\`

### 3. package.json (Node.js) - The Dependency Map
\`\`\`json
{
  "scripts": {
    "start": "node server.js",     // How to run
    "test": "jest",                // How to test
    "build": "webpack --mode=production" // How to build
  },
  "dependencies": {               // What it needs to run
    "express": "^4.18.0"
  },
  "devDependencies": {           // What it needs for development
    "jest": "^28.0.0"
  }
}
\`\`\`

### 4. .github/workflows/ - Automation Scripts
\`\`\`yaml
# CI/CD pipeline
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
\`\`\`

## 🛠️ Reading Code Architecture

### Understanding the Flow:
1. **Entry Point**: Where does the app start?
   - \`src/index.js\`, \`main.py\`, \`app.js\`
2. **Core Logic**: Where are the main features?
   - \`src/core/\`, \`lib/\`, \`components/\`
3. **Configuration**: How is it configured?
   - \`config/\`, \`.env\`, \`settings.py\`
4. **Tests**: How is it tested?
   - \`tests/\`, \`__tests__/\`, \`spec/\`

## 🎯 Practical Exercise: Analyze a Real Project

### Choose a project and create this analysis:

\`\`\`markdown
# Project Analysis: [Project Name]

## Basic Info
- **Language**: JavaScript/Python/etc
- **Framework**: React/Django/etc  
- **Type**: Library/Application/Tool

## Structure Overview
- **Entry Point**: src/index.js
- **Main Components**: src/components/
- **Tests**: tests/ (Jest framework)
- **Documentation**: docs/ + README.md

## Development Workflow  
1. Install: \`npm install\`
2. Run dev: \`npm run dev\`
3. Test: \`npm test\`
4. Build: \`npm run build\`

## Contribution Points
- **Easy Issues**: UI improvements, documentation
- **Medium Issues**: Bug fixes, small features
- **Hard Issues**: Architecture changes, performance

## Notes
- Active community (X contributors)
- Good test coverage (X%)
- Clear documentation
- Welcoming maintainers
\`\`\`

### Questions to Answer:
1. What problem does this project solve?
2. What's the main technology stack?
3. How do you run it locally?
4. Where would you add a new feature?
5. How are tests organized?
6. What's the code style/formatting?`,

            commands: [
              {
                description: "Analyze project structure",
                command: "find . -type f -name '*.md' | head -10",
                expectedOutput: "Lists markdown documentation files"
              },
              {
                description: "Check package.json scripts",
                command: "cat package.json | jq .scripts",
                expectedOutput: "Shows available npm scripts"
              },
              {
                description: "Find test files",
                command: "find . -name '*.test.js' -o -name '*.spec.js' | head -5",
                expectedOutput: "Lists test files in the project"
              }
            ],

            quiz: [
              {
                question: "Which file typically contains setup instructions for contributors?",
                options: [
                  "README.md",
                  "CONTRIBUTING.md", 
                  "package.json",
                  "LICENSE"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "4-3",
          title: "Evaluating Project Health & Community",
          duration: "20 minutes",
          content: {
            explanation: `# Project Health Check: Choosing Winners

Not all open source projects are created equal. Learn to quickly assess if a project is worth your time and effort.`,
            
            practicalTask: `## 🩺 Health Indicators to Check

### Activity Metrics
\`\`\`
✅ Green Flags:
- Commits in last 30 days
- Issues closed regularly
- PRs merged within 2 weeks
- Releases every few months
- Maintainer responses < 7 days

🚩 Red Flags:
- No commits in 6+ months
- Issues piling up (100+ open)
- PRs sitting for months
- No releases in years
- Zero maintainer activity
\`\`\`

### Community Quality Signs
\`\`\`
✅ Healthy Community:
- Welcoming language in issues
- Constructive code reviews
- Helpful maintainers
- Clear contribution guidelines
- Code of conduct present

🚩 Toxic Community:
- Hostile or dismissive responses
- Ignored contributors
- No contribution guidelines
- Drama in issues/PRs
- Maintainer burnout visible
\`\`\`

## 📊 Practical Health Assessment

### Use GitHub Insights Tab:
1. **Pulse**: Recent activity overview
2. **Contributors**: Who's actively working
3. **Community**: Health score and standards
4. **Traffic**: How popular is the project

### Key Questions to Ask:
1. **Is someone in charge?**
   - Look for active maintainers
   - Check if they respond to issues

2. **Is the code quality good?**
   - Are there tests?
   - Is code reviewed before merging?
   - Do they use CI/CD?

3. **Is the project sustainable?**
   - Multiple active contributors
   - Documentation is maintained
   - Dependencies are updated

## 🔧 Tools for Project Analysis

### GitHub CLI Analysis:
\`\`\`bash
# Get repository info
gh repo view owner/repo

# Check recent activity
gh pr list --state merged --limit 10

# See open issues
gh issue list --state open --limit 10

# Check contributors
gh api repos/owner/repo/contributors
\`\`\`

### Web Tools:
- **GitHub Insights**: Built-in analytics
- **OpenHub**: Project statistics
- **LibrariesIO**: Dependency analysis
- **CodeClimate**: Code quality metrics

## 🎯 Project Scorecard Template

Rate each category 1-5:

\`\`\`
Project: ________________________

Activity (1-5): ___
- Recent commits
- Issue response time
- PR merge frequency

Documentation (1-5): ___  
- README quality
- API docs
- Contributing guide

Community (1-5): ___
- Maintainer responsiveness
- Contributor diversity
- Welcoming atmosphere

Code Quality (1-5): ___
- Test coverage
- Code review process
- CI/CD setup

Total Score: ___/20

Decision:
□ Excellent fit (16-20)
□ Good option (12-15)  
□ Maybe later (8-11)
□ Avoid (0-7)
\`\`\`

## 🚨 Red Flags to Avoid

### Project Red Flags:
- No activity in 6+ months
- Maintainer explicitly says "not maintained"
- Critical security issues ignored
- Hostile community behavior
- No clear license

### Issue Red Flags:
- Issue has no responses after weeks
- Multiple people asking same question
- Maintainer says "won't fix" without reason
- Requires major refactoring
- No clear acceptance criteria

## 💡 Pro Tips

### For Beginners:
- Start with projects that have "good first issue" labels
- Choose projects with detailed CONTRIBUTING.md
- Look for projects with friendly, helpful maintainers
- Prefer smaller, focused projects over huge ones

### Evaluation Shortcuts:
1. Check last commit date (< 3 months = good)
2. Look at issue/PR ratio (should be balanced)
3. Read recent issue discussions (tone matters)
4. Check if CI builds are passing
5. See if dependencies are updated`,

            commands: [
              {
                description: "Check repository activity",
                command: "gh repo view --json pushedAt,stargazerCount,forkCount",
                expectedOutput: "Shows last activity and popularity metrics"
              },
              {
                description: "List recent merged PRs",
                command: "gh pr list --state merged --limit 5",
                expectedOutput: "Shows recent successfully merged contributions"
              },
              {
                description: "Check community health",
                command: "gh api repos/owner/repo/community/profile",
                expectedOutput: "Shows community standards checklist"
              }
            ],

            quiz: [
              {
                question: "What's a major red flag when evaluating a project?",
                options: [
                  "Has 100+ contributors",
                  "No commits in 6+ months",
                  "Uses TypeScript", 
                  "Has 1000+ stars"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "4-4",
          title: "Setting Up Development Environment",
          duration: "25 minutes",
          content: {
            explanation: `# Setting Up Your Development Environment

Before you can contribute, you need to get the project running locally. This is often the first real challenge new contributors face.`,
            
            practicalTask: `## 📋 Pre-Setup Checklist

### System Requirements Check:
\`\`\`bash
# Check your system versions
node --version     # For Node.js projects
python --version   # For Python projects
git --version      # Always needed
\`\`\`

### Read Documentation First:
1. **README.md**: Quick start instructions
2. **CONTRIBUTING.md**: Development setup
3. **docs/**: Detailed documentation
4. **.github/**: Issue templates and workflows

## 🔧 Universal Setup Process

### Step 1: Fork & Clone
\`\`\`bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/project-name.git
cd project-name

# Add upstream remote (original repository)
git remote add upstream https://github.com/ORIGINAL_OWNER/project-name.git

# Verify remotes
git remote -v
\`\`\`

### Step 2: Install Dependencies

#### For Node.js Projects:
\`\`\`bash
# Check for package manager hints
ls package*.json yarn.lock pnpm-lock.yaml

# Install based on what you find:
npm install        # If package-lock.json exists
yarn install       # If yarn.lock exists  
pnpm install       # If pnpm-lock.yaml exists
\`\`\`

#### For Python Projects:
\`\`\`bash
# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\\Scripts\\activate
# Activate it (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
# Or if using modern Python
pip install -e .
\`\`\`

#### For Other Languages:
\`\`\`bash
# Java (Maven)
mvn install

# Java (Gradle)  
./gradlew build

# Go
go mod download

# Rust
cargo build
\`\`\`

### Step 3: Environment Configuration
\`\`\`bash
# Look for environment files
ls .env* config/* settings.*

# Copy example environment file
cp .env.example .env
cp config/default.json config/local.json

# Edit configuration files as needed
\`\`\`

### Step 4: Database Setup (if needed)
\`\`\`bash
# Common database setup patterns

# SQLite (usually automatic)
python manage.py migrate

# PostgreSQL/MySQL (Docker)
docker-compose up -d db
npm run db:migrate

# Or manual setup
createdb project_name
psql project_name < schema.sql
\`\`\`

## 🚀 Running the Project

### Development Mode:
\`\`\`bash
# Common patterns to try:
npm run dev
npm start
yarn dev
python manage.py runserver
python -m flask run
cargo run
go run main.go
./gradlew run
\`\`\`

### Verify It's Working:
1. Check the terminal output for URLs
2. Open browser to http://localhost:3000 (or specified port)
3. Look for "Server running on..." messages
4. Test basic functionality

## 🧪 Running Tests

### Test Everything Works:
\`\`\`bash
# Run the full test suite
npm test
python -m pytest
cargo test
mvn test
go test ./...

# Run specific tests
npm test -- --grep "user auth"
pytest tests/test_auth.py
\`\`\`

### Understanding Test Output:
- ✅ All tests pass = environment is correct
- ❌ Some tests fail = might be environmental issues
- ❌ All tests fail = setup problem

## 🛠️ Common Setup Issues & Solutions

### Node.js Issues:
\`\`\`bash
# Wrong Node version
nvm install 18    # Install specific version
nvm use 18        # Switch to specific version

# Permission issues
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Python Issues:
\`\`\`bash
# Wrong Python version
pyenv install 3.9.0
pyenv global 3.9.0

# Virtual environment issues
deactivate
rm -rf venv
python -m venv venv
source venv/bin/activate

# Package conflicts
pip freeze > old_requirements.txt
pip uninstall -r old_requirements.txt -y
pip install -r requirements.txt
\`\`\`

### Database Issues:
\`\`\`bash
# Reset database
rm db.sqlite3
python manage.py migrate

# Docker database issues
docker-compose down
docker-compose up -d db
\`\`\`

## 📝 Setup Documentation Template

Create your own setup notes:

\`\`\`markdown
# [Project Name] Setup Notes

## Environment
- OS: [Your OS]
- Node: [Version]
- Python: [Version]
- Database: [Type & Version]

## Setup Steps
1. Cloned from: [URL]
2. Dependencies: [Command used]
3. Environment: [.env setup]
4. Database: [Setup process]
5. Running: [Start command]

## Issues Encountered
- [Issue 1]: [Solution]
- [Issue 2]: [Solution]

## Verification
- ✅ Tests pass
- ✅ App runs locally
- ✅ Can build for production

## Next Steps
- [ ] Read codebase overview
- [ ] Find good first issue
- [ ] Make first contribution
\`\`\``,

            commands: [
              {
                description: "Clone repository and set up remotes",
                command: "git clone URL && cd repo && git remote add upstream ORIGINAL_URL",
                expectedOutput: "Clones repo and sets up both origin and upstream remotes"
              },
              {
                description: "Install Node.js dependencies",
                command: "npm install",
                expectedOutput: "Downloads and installs all dependencies"
              },
              {
                description: "Run development server",
                command: "npm run dev",
                expectedOutput: "Starts development server with hot reload"
              },
              {
                description: "Run test suite",
                command: "npm test",
                expectedOutput: "Runs all tests and shows results"
              }
            ],

            quiz: [
              {
                question: "What should you do BEFORE installing dependencies?",
                options: [
                  "Start coding immediately",
                  "Read README and CONTRIBUTING.md",
                  "Create a pull request",
                  "Star the repository"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 5,
      title: "Forking, Cloning & Setting Up Local Environment",
      description: "Master the technical workflow of contributing to open source projects",
      difficulty: "Intermediate",
      estimatedTime: "1.5 hours", 
      xpReward: 160,
      color: "from-indigo-500 to-purple-600",
      icon: CodeBracketIcon,
      prerequisite: 4,
      lessons: [
        {
          id: "5-1",
          title: "Understanding Fork vs Clone vs Download",
          duration: "20 minutes",
          content: {
            explanation: `# Fork vs Clone vs Download: The Complete Guide

Understanding these three concepts is crucial for open source contribution. Each serves a different purpose in your workflow.`,
            
            practicalTask: `## 🔄 The Three Ways to Get Code

### 1. Download ZIP
\`\`\`
What it does:
- Downloads a snapshot of the code
- No Git history included
- No connection to original repository

When to use:
- Just want to browse the code
- Need a quick reference
- Not planning to contribute

⚠️ Limitation: Can't contribute back!
\`\`\`

### 2. Clone
\`\`\`
What it does:
- Downloads full repository with Git history
- Direct connection to original repository
- Can pull updates from original

When to use:
- Want to explore code with full history
- Need to stay updated with main branch
- Don't plan to contribute (just observe)

⚠️ Limitation: Can't push changes back (no permission)!
\`\`\`

### 3. Fork (The Contribution Method)
\`\`\`
What it does:
- Creates YOUR copy of the repository on GitHub
- You own this copy and can modify it
- Can propose changes back to original

When to use:
- Planning to contribute to the project
- Want to experiment with changes
- Need your own version to customize

✅ Benefit: Full contribution workflow enabled!
\`\`\`

## 🎯 Complete Fork & Clone Workflow

### Step 1: Fork the Repository
1. Go to the repository on GitHub
2. Click the "Fork" button in the top-right
3. Select your account as destination
4. Wait for fork creation

### Step 2: Clone YOUR Fork
\`\`\`bash
# Clone your fork (not the original!)
git clone https://github.com/YOUR_USERNAME/repository-name.git
cd repository-name

# Verify you cloned your fork
git remote -v
# Should show YOUR_USERNAME, not the original owner
\`\`\`

### Step 3: Add Upstream Remote
\`\`\`bash
# Add the original repository as "upstream"
git remote add upstream https://github.com/ORIGINAL_OWNER/repository-name.git

# Verify both remotes exist
git remote -v
# origin    -> your fork (for pushing)
# upstream  -> original repo (for pulling updates)
\`\`\`

## 🔄 Understanding the Flow

\`\`\`
Original Repository (upstream)
        ↓ (fork)
Your Fork (origin)
        ↓ (clone)  
Your Local Computer
\`\`\`

### Contribution Flow:
1. **Upstream → Local**: Pull latest changes
2. **Local**: Make your changes
3. **Local → Origin**: Push to your fork
4. **Origin → Upstream**: Create pull request

## 💡 Practical Exercise: Complete Setup

### Choose a Real Project:
Let's use a beginner-friendly project for practice:
- **freeCodeCamp/freeCodeCamp** (educational)
- **firstcontributions/first-contributions** (practice)
- **EddieHubCommunity/BioDrop** (community)

### Full Setup Process:
\`\`\`bash
# 1. Fork the project on GitHub first!

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/chosen-project.git
cd chosen-project

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/chosen-project.git

# 4. Fetch all branches
git fetch upstream

# 5. Verify setup
git remote -v
git branch -a
\`\`\`

### Test Your Setup:
\`\`\`bash
# Check you can pull from upstream
git pull upstream main

# Check you can push to origin
git push origin main

# Both should work without errors
\`\`\`

## 🚨 Common Mistakes to Avoid

### ❌ Wrong Clone URL:
\`\`\`bash
# DON'T clone the original directly
git clone https://github.com/ORIGINAL_OWNER/repo.git

# DO clone your fork
git clone https://github.com/YOUR_USERNAME/repo.git
\`\`\`

### ❌ Forgetting Upstream:
\`\`\`bash
# Without upstream, you can't get updates
# Always add upstream after cloning your fork
git remote add upstream https://github.com/ORIGINAL_OWNER/repo.git
\`\`\`

### ❌ Wrong Branch:
\`\`\`bash
# Some projects use 'master', others 'main'
# Check the default branch first!
git branch -r  # See remote branches
\`\`\`

## 🔧 Managing Multiple Forks

If you contribute to multiple projects:

\`\`\`bash
# Organize your projects
mkdir ~/open-source
cd ~/open-source

# Clone each fork in its own folder
git clone https://github.com/YOUR_USERNAME/project1.git
git clone https://github.com/YOUR_USERNAME/project2.git
git clone https://github.com/YOUR_USERNAME/project3.git

# Use descriptive folder names if needed
git clone https://github.com/YOUR_USERNAME/awesome-project.git awesome-project-fork
\`\`\`

## 📋 Setup Checklist

Before moving to the next lesson, verify:

\`\`\`
□ Forked the repository on GitHub
□ Cloned YOUR fork locally  
□ Added upstream remote
□ Can pull from upstream
□ Can push to origin
□ Know the default branch name (main/master)
□ Project runs locally (follow their setup guide)
\`\`\``,

            commands: [
              {
                description: "Clone your fork",
                command: "git clone https://github.com/YOUR_USERNAME/repo.git",
                expectedOutput: "Downloads your forked repository"
              },
              {
                description: "Add upstream remote", 
                command: "git remote add upstream https://github.com/ORIGINAL_OWNER/repo.git",
                expectedOutput: "Adds connection to original repository"
              },
              {
                description: "Verify remotes setup",
                command: "git remote -v",
                expectedOutput: "Shows both origin (your fork) and upstream (original)"
              },
              {
                description: "Fetch upstream branches",
                command: "git fetch upstream",
                expectedOutput: "Downloads latest changes from original repo"
              }
            ],

            quiz: [
              {
                question: "What's the difference between fork and clone?",
                options: [
                  "Fork is local, clone is remote",
                  "Fork creates a copy on GitHub, clone downloads to your computer",
                  "Fork is faster than clone",
                  "There's no difference"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "5-2",
          title: "Keeping Your Fork in Sync",
          duration: "25 minutes",
          content: {
            explanation: `# Keeping Your Fork Up-to-Date

Open source projects evolve rapidly. Learning to sync your fork with the original repository is essential for successful contributions.`,
            
            practicalTask: `## 🔄 Why Sync Matters

### Problems with Outdated Forks:
- **Merge conflicts**: Your changes conflict with recent updates
- **Failed tests**: New tests require updated dependencies
- **Missing features**: You're working on old codebase
- **Rejected PRs**: Maintainers want you to rebase on latest

### Sync Strategy:
- Sync before starting new work
- Sync before creating pull requests
- Sync when your PR has conflicts

## 📋 Step-by-Step Sync Process

### Method 1: Command Line (Recommended)
\`\`\`bash
# 1. Switch to main branch
git checkout main

# 2. Fetch latest changes from upstream
git fetch upstream

# 3. Merge upstream changes into your main
git merge upstream/main

# 4. Push updated main to your fork
git push origin main
\`\`\`

### Method 2: GitHub Web Interface
1. Go to your fork on GitHub
2. Click "Fetch upstream" (if available)
3. Click "Fetch and merge"
4. Pull changes locally: \`git pull origin main\`

### Method 3: Using Git Pull (Alternative)
\`\`\`bash
# One command approach
git checkout main
git pull upstream main
git push origin main
\`\`\`

## 🌿 Sync with Feature Branches

When working on a feature branch:

\`\`\`bash
# First, sync your main branch
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# Then update your feature branch
git checkout feature-branch-name
git merge main  # Or use rebase for cleaner history
git push origin feature-branch-name
\`\`\`

## 🔄 Advanced: Rebasing for Clean History

### When to Use Rebase:
- Want linear commit history
- Maintainer prefers rebased PRs
- Avoiding unnecessary merge commits

\`\`\`bash
# Sync main first
git checkout main
git fetch upstream
git merge upstream/main

# Rebase your feature branch
git checkout feature-branch
git rebase main

# If conflicts occur:
# 1. Resolve conflicts in files
# 2. git add resolved-files
# 3. git rebase --continue

# Force push after rebase (only to your fork!)
git push --force-with-lease origin feature-branch
\`\`\`

## 🚨 Handling Conflicts During Sync

### When Main Branch Has Conflicts:
\`\`\`bash
git checkout main
git fetch upstream
git merge upstream/main

# If conflicts occur:
# 1. Open conflicted files
# 2. Look for conflict markers:
#    <<<<<<< HEAD (your changes)
#    ======= 
#    >>>>>>> upstream/main (upstream changes)
# 3. Resolve by choosing or combining changes
# 4. Remove conflict markers
# 5. Add and commit

git add resolved-file.js
git commit -m "Resolve merge conflict with upstream"
git push origin main
\`\`\`

## 🎯 Practical Exercise: Sync Practice

### Setup Test Repository:
1. Fork a active repository (like freeCodeCamp/freeCodeCamp)
2. Clone your fork locally
3. Add upstream remote
4. Wait a day or two (for new commits)

### Practice Sync:
\`\`\`bash
# Check if upstream has new commits
git fetch upstream
git log main..upstream/main --oneline
# Shows commits you don't have

# If there are new commits, sync:
git checkout main
git merge upstream/main
git push origin main

# Verify sync worked:
git log --oneline -10
# Should show recent upstream commits
\`\`\`

## 🔧 Automation with Scripts

### Create a sync script (.bashrc or .zshrc):
\`\`\`bash
# Add this function to your shell config
sync-fork() {
  echo "🔄 Syncing fork with upstream..."
  git checkout main
  git fetch upstream
  git merge upstream/main
  git push origin main
  echo "✅ Fork synced successfully!"
}

# Usage: just type 'sync-fork' in any repo
\`\`\`

### GitHub CLI Method:
\`\`\`bash
# Sync using GitHub CLI
gh repo sync owner/repo
\`\`\`

## 📊 Monitoring for Updates

### Check for Updates:
\`\`\`bash
# See if upstream has new commits
git fetch upstream
git log main..upstream/main --oneline

# Count commits behind
git rev-list --count main..upstream/main
\`\`\`

### Set Up Notifications:
1. **GitHub**: Watch the original repository
2. **RSS**: Subscribe to release feed
3. **Email**: GitHub notifications for releases

## 🔄 Sync Schedule Best Practices

### When to Sync:
- **Daily**: If actively contributing
- **Weekly**: If occasionally contributing
- **Before new work**: Always sync before starting
- **Before PRs**: Always sync before submitting

### Workflow Integration:
\`\`\`bash
# Before starting new feature
sync-fork
git checkout -b new-feature

# Before creating PR
sync-fork
git checkout new-feature
git merge main  # Update feature with latest
\`\`\`

## 🎯 Sync Checklist

Before each contribution session:

\`\`\`
□ Check if upstream has updates
□ Sync main branch with upstream  
□ Update any existing feature branches
□ Verify local tests still pass
□ Ready to start new work on latest code
\`\`\``,

            commands: [
              {
                description: "Fetch latest from upstream",
                command: "git fetch upstream",
                expectedOutput: "Downloads latest changes without merging"
              },
              {
                description: "Check what's new upstream",
                command: "git log main..upstream/main --oneline",
                expectedOutput: "Shows commits you don't have yet"
              },
              {
                description: "Sync main branch",
                command: "git checkout main && git merge upstream/main",
                expectedOutput: "Updates your main branch with upstream changes"
              },
              {
                description: "Push updated main to fork",
                command: "git push origin main", 
                expectedOutput: "Updates your fork with latest changes"
              }
            ],

            quiz: [
              {
                question: "When should you sync your fork?",
                options: [
                  "Only when creating pull requests",
                  "Before starting new work and before creating PRs",
                  "Once a month",
                  "Never, just work on old code"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 6,
      title: "Making Your First Contribution", 
      description: "Submit your first pull request with confidence",
      difficulty: "Intermediate",
      estimatedTime: "2 hours",
      xpReward: 200,
      color: "from-green-500 to-emerald-600", 
      icon: CheckIcon,
      prerequisite: 5,
      lessons: [
        {
          id: "6-1",
          title: "Finding the Perfect First Issue",
          duration: "25 minutes",
          content: {
            explanation: `# Hunting for Your First Contribution

Your first contribution sets the tone for your open source journey. Let's find the perfect issue that matches your skills and interests.`,
            
            practicalTask: `## 🎯 Types of Great First Issues

### 1. Documentation Improvements
\`\`\`
Perfect for beginners because:
- Low risk of breaking anything
- Helps you understand the project
- Always appreciated by maintainers
- Great way to practice Git workflow

Examples:
- Fix typos in README
- Add missing examples
- Improve installation instructions
- Translate documentation
\`\`\`

### 2. UI/UX Improvements  
\`\`\`
Good for frontend developers:
- CSS styling fixes
- Responsive design improvements
- Accessibility enhancements
- Button text or layout tweaks

Examples:
- Fix mobile layout issues
- Improve button spacing
- Add hover effects
- Fix color contrast
\`\`\`

### 3. Bug Fixes (Small Ones)
\`\`\`
Requirements:
- Clear reproduction steps
- Expected vs actual behavior described
- Not critical to core functionality

Examples:
- Fix broken links
- Correct validation messages
- Handle edge cases
- Fix console warnings
\`\`\`

### 4. New Features (Tiny Ones)
\`\`\`
Characteristics:
- Clearly defined scope
- No architectural changes needed
- Value is obvious

Examples:
- Add new utility function
- Support additional file format
- Add configuration option
- Improve error messages
\`\`\`

## 🔍 Search Strategies for First Issues

### GitHub Search Filters:
\`\`\`
# Perfect combination for beginners
label:"good first issue" state:open sort:updated-desc

# Language-specific searches  
label:"good first issue" language:javascript state:open

# Recently updated issues (more likely to get attention)
label:"good first issue" state:open updated:>2024-01-01

# Multiple helpful labels
label:"good first issue" OR label:"beginner friendly" OR label:"easy"
\`\`\`

### Advanced GitHub Search:
\`\`\`
# In specific organizations
org:microsoft label:"good first issue" state:open

# Exclude archived repos
label:"good first issue" state:open archived:false

# Recently created issues (fresh problems)
label:"good first issue" state:open created:>2024-01-01

# Issues with fewer comments (less competitive)
label:"good first issue" state:open comments:<5
\`\`\`

## 📋 Issue Evaluation Checklist

Before choosing an issue, check:

### ✅ Good Signs:
\`\`\`
□ Clear problem description
□ Acceptance criteria defined
□ Recent maintainer activity
□ Welcoming responses to questions
□ No one already working on it
□ You understand 80% of the issue
□ You can reproduce the problem
\`\`\`

### 🚩 Warning Signs:
\`\`\`
□ Vague or incomplete description
□ No maintainer response in weeks
□ Multiple people already attempted
□ Requires major architectural changes
□ Related to critical security issues
□ Dependencies you don't understand
\`\`\`

## 🎯 Practical Exercise: Find Your Issue

### Step 1: Choose Your Platform
Pick one or more:
- **GitHub.com**: Main search
- **Up For Grabs**: https://up-for-grabs.net/
- **Good First Issues**: https://goodfirstissues.com/
- **First Timers Only**: https://www.firsttimersonly.com/

### Step 2: Define Your Criteria
\`\`\`
My Skills:
□ Languages: [JavaScript, Python, etc.]
□ Frameworks: [React, Django, etc.]  
□ Experience: [Frontend, Backend, etc.]

My Interests:
□ Type: [Documentation, Bug fixes, Features]
□ Domain: [Web dev, Data science, etc.]
□ Project size: [Small, Medium, Large]
\`\`\`

### Step 3: Search and Evaluate
Use this template for each issue you consider:

\`\`\`
Issue: [URL]
Project: [Name]
Description: [Brief summary]

Evaluation:
□ Clear requirements? [Yes/No]
□ Matches my skills? [Yes/No]  
□ Recent activity? [Yes/No]
□ Approachable maintainers? [Yes/No]
□ Can I reproduce it? [Yes/No]

Decision: [Take it / Skip it / Maybe later]
\`\`\`

## 💬 Engaging with the Issue

### Before Starting Work:
\`\`\`markdown
Comment template:
"Hi! I'm interested in working on this issue. I have experience with [relevant skills]. 

My understanding is that I need to [describe what you think needs to be done]. 

Could you confirm this approach is correct? I'd also appreciate any guidance on [specific question if you have one].

Thanks!"
\`\`\`

### Questions to Ask:
- "Is anyone currently working on this?"
- "Would this approach work: [your plan]?"
- "Are there any specific requirements I should know about?"
- "Which files would likely need changes?"

## 🚀 Setting Expectations

### Timeline Communication:
\`\`\`markdown
"I plan to work on this over the next [timeframe]. I'll provide updates every few days and reach out if I get stuck. Thanks for the opportunity to contribute!"
\`\`\`

### Managing Scope:
- Start with the simplest possible solution
- Ask about edge cases before implementing
- Confirm requirements before major changes
- Break large issues into smaller parts

## 📊 Success Metrics for First Issues

### Ideal First Issue Characteristics:
- **Time to complete**: 2-8 hours
- **Files to change**: 1-3 files  
- **Lines of code**: 5-50 lines
- **Testing required**: Simple or existing tests
- **Review cycles**: 1-2 rounds

### Building Confidence:
1. **Start small**: Documentation or simple bug fixes
2. **Learn the process**: Focus on Git workflow
3. **Build relationships**: Communicate well with maintainers
4. **Gain experience**: Each contribution teaches you more

## 🎯 Your Action Plan

### This Week:
1. Identify 3 potential first issues
2. Evaluate them using the checklist
3. Comment on your top choice
4. Wait for maintainer response
5. Start working once approved

### Next Steps:
- Focus on learning the contribution process
- Don't worry about perfect code initially  
- Ask questions when stuck
- Celebrate your first merged PR!`,

            commands: [
              {
                description: "Search for good first issues",
                command: 'gh search issues --label="good first issue" --state=open',
                expectedOutput: "Lists beginner-friendly open issues"
              },
              {
                description: "View issue details",
                command: "gh issue view 123 --repo owner/repo",
                expectedOutput: "Shows detailed issue information"
              },
              {
                description: "Comment on an issue",
                command: 'gh issue comment 123 --body "I\'d like to work on this!"',
                expectedOutput: "Adds your comment to the issue"
              }
            ],

            quiz: [
              {
                question: "What should you do before starting work on an issue?",
                options: [
                  "Start coding immediately",
                  "Comment and ask for clarification",
                  "Create a pull request",
                  "Fork the repository"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 7,
      title: "Code Review & Collaboration Best Practices",
      description: "Master the art of code review and effective collaboration",
      difficulty: "Intermediate",
      estimatedTime: "1.5 hours",
      xpReward: 170,
      color: "from-orange-500 to-red-600",
      icon: ChatBubbleLeftRightIcon,
      prerequisite: 6,
      lessons: [
        {
          id: "7-1", 
          title: "Understanding Code Review Process",
          duration: "20 minutes",
          content: {
            explanation: `# Code Review: The Heart of Open Source Quality

Code review is where good code becomes great code. It's a collaborative process that improves code quality, shares knowledge, and builds trust.`,
            
            practicalTask: `## 🔍 What is Code Review?

Code review is the systematic examination of code by peers before it gets merged into the main codebase.

### Goals of Code Review:
- **Quality**: Catch bugs and improve code quality
- **Knowledge**: Share knowledge and best practices
- **Consistency**: Maintain coding standards
- **Security**: Identify potential security issues
- **Learning**: Help contributors grow as developers

## 🎯 The Review Process Flow

\`\`\`
1. Developer creates Pull Request
2. Automated checks run (CI/CD)
3. Reviewers are assigned/volunteer
4. Reviewers examine the code
5. Reviewers provide feedback
6. Developer addresses feedback
7. Review cycle repeats until approved
8. Code gets merged
\`\`\`

## 👥 Types of Review Feedback

### 1. **Blocking Issues** (Must Fix)
\`\`\`
- Security vulnerabilities
- Breaking changes
- Test failures
- Code that doesn't follow project standards
\`\`\`

### 2. **Suggestions** (Should Fix)
\`\`\`
- Performance improvements
- Code clarity enhancements
- Better variable names
- Simplified logic
\`\`\`

### 3. **Nitpicks** (Nice to Fix)
\`\`\`
- Minor style issues
- Typos in comments
- Optional optimizations
- Personal preferences
\`\`\`

## 💬 Review Comment Types

### Constructive Feedback Examples:
\`\`\`markdown
✅ Good: "Consider using a Map here for better performance with large datasets"

✅ Good: "This function is getting complex. Could we split it into smaller functions?"

✅ Good: "Great solution! One suggestion: we could add error handling for the API call"

❌ Poor: "This is wrong"

❌ Poor: "I don't like this approach"  

❌ Poor: "Why did you do it this way?"
\`\`\`

## 🔧 Responding to Review Feedback

### When You Receive Feedback:

#### 1. **Stay Positive**
- Remember reviewers want to help you succeed
- Feedback is about the code, not you personally
- Every developer gets feedback, even experts

#### 2. **Ask Questions**
\`\`\`markdown
"Thanks for the feedback! Could you help me understand why approach X would be better than Y in this case?"

"I see your point about performance. Would you recommend using a different data structure here?"

"Good catch on the edge case! Should I add a test for this scenario too?"
\`\`\`

#### 3. **Acknowledge and Act**
\`\`\`markdown
"Great suggestion! I've updated the code to use Map instead of Object."

"You're right about the complexity. I've split the function into three smaller ones."

"Fixed! I also added a test to prevent this bug in the future."
\`\`\`

## 🎯 Practical Exercise: Analyze Real Reviews

### Find Real Examples:
1. Go to a project like React, VS Code, or Node.js
2. Look at recent merged pull requests
3. Read the review comments and responses

### Analysis Template:
\`\`\`
PR: [URL]
Review feedback examples:

Blocking issue:
- Comment: "[quote reviewer comment]"
- Response: "[how dev responded]"
- Outcome: "[what happened]"

Suggestion:
- Comment: "[quote reviewer comment]"  
- Response: "[how dev responded]"
- Learning: "[what you learned]"
\`\`\`

## 🚀 Preparing for Your First Review

### Before Submitting Your PR:

#### Self-Review Checklist:
\`\`\`
□ Code follows project style guidelines
□ All tests pass locally
□ No debugging code left (console.log, etc.)
□ Comments explain complex logic
□ Variable names are clear and descriptive
□ Functions are focused and not too large
□ No obvious bugs or edge cases missed
\`\`\`

#### Documentation Check:
\`\`\`
□ Updated README if needed
□ Added code comments for complex parts
□ Updated API docs if changed
□ Added examples for new features
\`\`\`

### Setting Review Expectations:

\`\`\`markdown
In your PR description, add:

**Review Notes:**
- This is my first contribution to the project
- I'd appreciate feedback on code style and best practices  
- I'm particularly unsure about [specific area]
- I'm open to suggestions for improvement

**Questions for reviewers:**
- Does my approach align with project patterns?
- Are there any performance concerns?
- Should I add more tests?
\`\`\`

## 💡 Learning from Reviews

### Turn Feedback into Learning:

#### Keep a Review Journal:
\`\`\`markdown
# Review Learning Log

## PR #123 - Add user validation
**Feedback received:**
- Use const instead of let when value doesn't change
- Extract magic numbers into constants
- Add input sanitization

**Applied learning:**
- Always prefer const for immutable values
- Magic numbers reduce code readability  
- Security: always sanitize user input

**Next time I'll:**
- Review my own code for const/let usage
- Look for magic numbers before submitting
- Consider security implications upfront
\`\`\`

#### Common Patterns to Learn:
- **Naming conventions** used in the project
- **Error handling** patterns
- **Testing** approaches
- **Code organization** principles
- **Performance** considerations

## 🎯 Review Response Strategy

### Template for Addressing Feedback:

\`\`\`markdown
## Review Response

Thanks @reviewer for the thorough review! I've addressed your feedback:

### ✅ Fixed Issues:
- Replaced var with const for immutable values  
- Extracted magic number 500 into TIMEOUT_MS constant
- Added input validation for email format

### 🤔 Questions/Discussion:
- **Performance concern:** You mentioned Map vs Object. I tested both with 1000 items and Map was 15% faster. Should I add a benchmark test?
- **Testing approach:** I added unit tests for the happy path. Should I also test error scenarios?

### 📚 What I Learned:
- const/let best practices
- Why magic numbers are problematic  
- Importance of input validation

Ready for another review when you have time!
\`\`\``,

            commands: [
              {
                description: "View pull request with reviews",
                command: "gh pr view 123 --comments",
                expectedOutput: "Shows PR details with all review comments"
              },
              {
                description: "List your pull requests",
                command: "gh pr list --author @me",
                expectedOutput: "Shows your open and merged pull requests"
              }
            ],

            quiz: [
              {
                question: "What's the best way to respond to code review feedback?",
                options: [
                  "Ignore suggestions you disagree with",
                  "Ask questions and acknowledge good points",
                  "Argue with every comment",
                  "Fix everything without discussion"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 8,
      title: "Advanced Git Workflows & Techniques",
      description: "Master advanced Git techniques used in professional development",
      difficulty: "Advanced",
      estimatedTime: "2 hours",
      xpReward: 220,
      color: "from-red-500 to-pink-600",
      icon: CogIcon,
      prerequisite: 7,
      lessons: [
        {
          id: "8-1",
          title: "Interactive Rebase & Commit History Management",
          duration: "30 minutes",
          content: {
            explanation: `# Interactive Rebase: Crafting Perfect Commit History

Interactive rebase is one of Git's most powerful features, allowing you to rewrite history to create clean, professional commit messages and logical changes.`,
            
            practicalTask: `## 🎯 Why Clean History Matters

### Benefits of Clean Commits:
- **Easier debugging**: Clear commits help identify when bugs were introduced
- **Better reviews**: Logical changes are easier to review
- **Professional appearance**: Shows attention to detail
- **Easier reverts**: Clean commits can be reverted safely

### Before vs After Example:
\`\`\`
❌ Messy History:
- fix typo
- wip  
- more changes
- fix build
- actually fix build
- final fix

✅ Clean History:
- Add user authentication system
- Implement password validation
- Add login/logout functionality
\`\`\`

## 🔧 Interactive Rebase Commands

### Starting Interactive Rebase:
\`\`\`bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Rebase from specific commit
git rebase -i abc123

# Rebase from main branch
git rebase -i main
\`\`\`

### Rebase Command Options:
\`\`\`
pick    = use commit as-is
reword  = use commit, but edit message
edit    = use commit, but stop for amending
squash  = use commit, but meld into previous commit
fixup   = like squash, but discard commit message
drop    = remove commit entirely
\`\`\`

## 🎯 Practical Rebase Scenarios

### Scenario 1: Squash Multiple WIP Commits
\`\`\`bash
# You have these messy commits:
# abc123 Add login feature
# def456 fix typo
# ghi789 fix another typo  
# jkl012 final fix

# Start interactive rebase
git rebase -i HEAD~4

# In the editor, change to:
pick abc123 Add login feature
fixup def456 fix typo
fixup ghi789 fix another typo
fixup jkl012 final fix

# Result: One clean commit "Add login feature"
\`\`\`

### Scenario 2: Reword Commit Messages
\`\`\`bash
# Fix unclear commit messages
git rebase -i HEAD~2

# Change:
pick abc123 wip
pick def456 stuff

# To:
reword abc123 wip
reword def456 stuff

# Then provide better messages:
# "Implement user registration form"
# "Add form validation and error handling"
\`\`\`

### Scenario 3: Split Large Commits
\`\`\`bash
# Split a commit that does too many things
git rebase -i HEAD~1

# Change pick to edit:
edit abc123 Add users and posts features

# When rebase stops:
git reset HEAD~1  # Unstage all changes
git add users.js
git commit -m "Add user management system"
git add posts.js  
git commit -m "Add post creation functionality"
git rebase --continue
\`\`\`

## ⚠️ Rebase Safety Rules

### ✅ Safe to Rebase:
- Commits only on your feature branch
- Commits not yet pushed to shared branches
- Local development work

### ❌ Never Rebase:
- Commits on main/master branch
- Commits already pushed to shared branches
- Commits that others have based work on

### Force Push After Rebase:
\`\`\`bash
# After rebase, you need to force push
git push --force-with-lease origin feature-branch

# Never use regular --force, use --force-with-lease
# It's safer and won't overwrite others' work
\`\`\`

## 🔄 Common Rebase Workflows

### Pre-PR Cleanup:
\`\`\`bash
# Before submitting PR, clean up your commits
git checkout feature-branch
git rebase -i main

# Squash fixup commits, improve messages
# Then force push
git push --force-with-lease origin feature-branch
\`\`\`

### Sync with Main Branch:
\`\`\`bash
# Instead of merge commit, use rebase for cleaner history
git checkout feature-branch
git rebase main

# Resolve conflicts if any, then:
git push --force-with-lease origin feature-branch
\`\`\`

## 🎯 Practical Exercise: Clean Up History

### Create Test Commits:
\`\`\`bash
# Create a test branch
git checkout -b rebase-practice

# Make some messy commits
echo "console.log('test');" >> test.js
git add test.js
git commit -m "wip"

echo "// TODO: fix this" >> test.js  
git add test.js
git commit -m "more stuff"

echo "function hello() { return 'world'; }" >> test.js
git add test.js
git commit -m "actual feature"

echo "function hello() { return 'Hello, World!'; }" > test.js
git add test.js
git commit -m "fix hello function"
\`\`\`

### Clean Up with Interactive Rebase:
\`\`\`bash
# View current history
git log --oneline -4

# Start interactive rebase
git rebase -i HEAD~4

# Squash and reword to create clean history:
pick [hash] actual feature
fixup [hash] wip  
fixup [hash] more stuff
fixup [hash] fix hello function

# Result: One commit "Add hello world function"
\`\`\`

## 💡 Pro Tips for Perfect History

### Commit Message Best Practices:
\`\`\`
✅ Good commit messages:
- "Add user authentication middleware"
- "Fix memory leak in image processing"  
- "Update API documentation for v2.0"

❌ Poor commit messages:
- "fix"
- "updates"
- "wip"
- "asdf"
\`\`\`

### Atomic Commits Strategy:
- One logical change per commit
- Each commit should be self-contained
- Tests should pass after each commit
- Related changes belong together

### When to Rebase vs Merge:
- **Rebase**: Feature branches, cleaning history
- **Merge**: Preserving context, team preferences`,

            commands: [
              {
                description: "Start interactive rebase",
                command: "git rebase -i HEAD~3",
                expectedOutput: "Opens editor to modify last 3 commits"
              },
              {
                description: "View commit history",
                command: "git log --oneline -10",
                expectedOutput: "Shows last 10 commits in short format"
              },
              {
                description: "Force push after rebase",
                command: "git push --force-with-lease origin branch-name",
                expectedOutput: "Safely pushes rebased commits"
              }
            ],

            quiz: [
              {
                question: "When is it safe to use interactive rebase?",
                options: [
                  "Always, on any branch",
                  "Only on commits not yet pushed to shared branches", 
                  "Only on the main branch",
                  "Never, it's too dangerous"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 9,
      title: "Contributing to Large-Scale Projects",
      description: "Navigate complex codebases and contribute to enterprise-level projects",
      difficulty: "Advanced",
      estimatedTime: "2.5 hours", 
      xpReward: 250,
      color: "from-purple-500 to-indigo-600",
      icon: BuildingOfficeIcon,
      prerequisite: 8,
      lessons: [
        {
          id: "9-1",
          title: "Understanding Enterprise Open Source",
          duration: "25 minutes",
          content: {
            explanation: `# Contributing to Large-Scale Open Source Projects

Large projects like React, VS Code, Kubernetes, and Django operate differently than small projects. Understanding their structure and processes is key to successful contribution.`,
            
            practicalTask: `## 🏢 Characteristics of Large Projects

### Scale Indicators:
- **Contributors**: 100+ active contributors
- **Stars**: 10,000+ GitHub stars  
- **Issues**: 1000+ open issues
- **Code**: Millions of lines of code
- **Users**: Used by thousands of companies

### Examples:
- **React**: 200k+ stars, Meta-backed
- **VS Code**: 150k+ stars, Microsoft-backed  
- **Kubernetes**: 100k+ stars, CNCF project
- **Django**: 70k+ stars, Community-driven

## 🏗️ Enterprise Project Structure

### Governance Models:

#### Corporate-Backed Projects:
\`\`\`
Examples: React (Meta), VS Code (Microsoft), Angular (Google)

Characteristics:
- Clear decision-making hierarchy
- Full-time maintainers
- Regular release cycles
- Professional documentation
- Strong backwards compatibility
\`\`\`

#### Foundation Projects:
\`\`\`
Examples: Kubernetes (CNCF), Apache projects, Linux Foundation

Characteristics:  
- Committee-based decisions
- Multiple company involvement
- Formal governance processes
- Vendor neutrality
- Long-term stability focus
\`\`\`

#### Community-Driven Projects:
\`\`\`
Examples: Django, Ruby on Rails, many Python packages

Characteristics:
- Volunteer maintainers
- Consensus-based decisions
- Slower release cycles
- Community RFC processes
- Democratic governance
\`\`\`

## 📋 Enterprise Contribution Process

### 1. **Research Phase** (Essential!)
\`\`\`
□ Read project's vision and roadmap
□ Understand target audience
□ Learn architecture and design principles  
□ Study contribution guidelines thoroughly
□ Identify key maintainers and teams
\`\`\`

### 2. **Community Integration**
\`\`\`
□ Join official communication channels (Discord, Slack, Forums)
□ Introduce yourself appropriately
□ Observe discussions before participating
□ Learn project terminology and conventions
□ Build relationships with maintainers
\`\`\`

### 3. **Contribution Strategy**
\`\`\`
□ Start with documentation or small bugs
□ Focus on one area/component initially
□ Build expertise in specific domain
□ Gradually increase contribution complexity
□ Mentor newer contributors
\`\`\`

## 🎯 Finding Opportunities in Large Projects

### Issue Filtering Strategies:
\`\`\`bash
# GitHub search examples for large projects

# React repository  
repo:facebook/react label:"good first issue" state:open

# VS Code repository
repo:microsoft/vscode label:"good-first-issue" state:open

# Node.js repository
repo:nodejs/node label:"good first issue" state:open

# Kubernetes repository  
repo:kubernetes/kubernetes label:"good first issue" state:open
\`\`\`

### Focus Areas for Large Projects:

#### Documentation (Always Needed):
- API documentation improvements
- Tutorial enhancements  
- Translation efforts
- Example corrections
- Getting started guides

#### Developer Experience:
- Build tooling improvements
- Error message enhancements
- CLI tool usability
- Development setup simplification
- Testing infrastructure

#### Performance & Bug Fixes:
- Memory leak fixes
- Performance optimizations
- Cross-platform compatibility
- Edge case handling
- Security improvements

## 💼 Professional Contribution Practices

### Communication Standards:

#### Issue Comments:
\`\`\`markdown
Professional template:

"Hi @maintainer,

I'm interested in contributing to this issue. I have [X years] experience with [relevant technologies] and have previously contributed to [similar projects if any].

My understanding of this issue:
[Clear description of what you understand needs to be done]

Proposed approach:
[High-level description of your solution approach]

Questions:
1. [Specific question if any]
2. [Another question if needed]

I estimate this would take me [timeframe] to complete. Please let me know if this approach sounds reasonable or if you'd prefer a different direction.

Thanks for maintaining this amazing project!"
\`\`\`

#### Pull Request Descriptions:
\`\`\`markdown
## Summary
Brief description of what this PR does

## Changes
- [Specific change 1]
- [Specific change 2] 
- [Specific change 3]

## Testing
- [How you tested the changes]
- [Specific test cases covered]
- [Performance impact if applicable]

## Documentation
- [Documentation updates made]
- [Breaking changes if any]

## Checklist
- [x] Tests added/updated
- [x] Documentation updated  
- [x] Changelog updated
- [x] No breaking changes (or breaking changes documented)
\`\`\`

## 🔍 Understanding Large Codebases

### Exploration Strategy:
\`\`\`bash
# 1. Understand project structure
find . -name "*.md" | head -20  # Find documentation
ls -la                          # See top-level organization

# 2. Find entry points  
grep -r "main\|index\|app" --include="*.js" --include="*.py" | head -10

# 3. Understand build system
ls package.json Makefile CMakeLists.txt setup.py requirements.txt

# 4. Find tests
find . -name "*test*" -type d | head -10
find . -name "*.test.*" | head -10

# 5. Understand dependencies
cat package.json | jq .dependencies
cat requirements.txt
\`\`\`

### Code Navigation Tips:
- Use IDEs with good search (VS Code, IntelliJ)
- Understand module/package structure
- Follow import/include statements
- Read architecture documentation
- Use code analysis tools (GitHub's code navigation)

## 🎯 Practical Exercise: Analyze a Large Project

### Choose Your Target:
Pick one large project to analyze:
- **React**: Frontend framework
- **VS Code**: Editor/IDE
- **Django**: Web framework  
- **Kubernetes**: Container orchestration
- **PyTorch**: Machine learning

### Analysis Template:
\`\`\`markdown
# [Project Name] Analysis

## Project Overview
- **Purpose**: [What problem it solves]
- **Scale**: [Contributors, stars, code size]  
- **Governance**: [Corporate/Foundation/Community]
- **Primary Language**: [Main programming language]

## Architecture
- **Core Components**: [Main modules/packages]
- **Entry Points**: [How users interact with it]
- **Dependencies**: [Key external dependencies]
- **Build System**: [How it's built/packaged]

## Contribution Opportunities  
- **Documentation**: [Specific areas needing help]
- **Bug Fixes**: [Types of issues available]
- **Features**: [Areas open for enhancement]
- **Testing**: [Testing gaps or improvements needed]

## Getting Started Plan
1. [First step - usually environment setup]
2. [Second step - usually small documentation fix]  
3. [Third step - usually small bug fix]
4. [Long-term - major contribution goal]
\`\`\``,

            commands: [
              {
                description: "Explore large project structure",
                command: "find . -name README.md -o -name CONTRIBUTING.md | head -10",
                expectedOutput: "Shows main documentation files"
              },
              {
                description: "Find project entry points",
                command: 'grep -r "main\\|index" --include="*.json" . | head -5',
                expectedOutput: "Shows main application entry points"
              },
              {
                description: "Search for beginner issues in large repos",
                command: 'gh search issues --repo="facebook/react" --label="good first issue"',
                expectedOutput: "Lists beginner-friendly issues in React"
              }
            ],

            quiz: [
              {
                question: "What's the most important first step when contributing to a large project?",
                options: [
                  "Start coding immediately",
                  "Research the project thoroughly and understand its governance",
                  "Create a large pull request",
                  "Email the maintainers directly"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    },
    {
      id: 10,
      title: "Building Your Open Source Reputation",
      description: "Establish yourself as a respected contributor in the open source community",
      difficulty: "Advanced",
      estimatedTime: "2 hours",
      xpReward: 300,
      color: "from-yellow-500 to-orange-600",
      icon: StarIcon,
      prerequisite: 9,
      lessons: [
        {
          id: "10-1",
          title: "Strategic Contribution Planning",
          duration: "30 minutes",
          content: {
            explanation: `# Building Your Open Source Reputation Strategically

Your open source contributions are investments in your career, network, and personal brand. Let's build a strategic approach to maximize impact.`,
            
            practicalTask: `## 🎯 Reputation Building Strategy

### What Makes a Strong Open Source Profile:
- **Consistency**: Regular contributions over time
- **Quality**: Well-thought-out, professional contributions
- **Community**: Positive relationships with maintainers and contributors
- **Impact**: Contributions that matter to projects and users
- **Leadership**: Eventually mentoring others and leading initiatives

### Career Benefits:
- **Job Opportunities**: Recruiters actively search GitHub
- **Skill Demonstration**: Code speaks louder than resumes
- **Networking**: Connect with industry leaders
- **Learning**: Exposure to cutting-edge technologies
- **Recognition**: Conference talks, awards, job offers

## 📊 Contribution Portfolio Strategy

### The 3-Tier Approach:

#### Tier 1: Foundation Projects (60% of effort)
\`\`\`
Focus: 1-3 projects you use regularly
Goal: Become a recognized contributor
Examples: Your main framework, primary tools, languages you work with

Strategy:
- Start with small contributions
- Build relationships with maintainers  
- Gradually increase contribution complexity
- Eventually become a maintainer yourself
\`\`\`

#### Tier 2: Learning Projects (30% of effort)  
\`\`\`
Focus: Projects in technologies you want to learn
Goal: Skill development and exploration
Examples: New frameworks, different programming languages, tools

Strategy:
- Documentation contributions
- Simple bug fixes
- Feature implementations
- Learning-oriented contributions
\`\`\`

#### Tier 3: Impact Projects (10% of effort)
\`\`\`
Focus: High-visibility, widely-used projects
Goal: Maximum reputation impact
Examples: React, VS Code, Linux kernel, popular libraries

Strategy:
- Occasional significant contributions
- Focus on quality over quantity
- Leverage expertise from Tier 1 projects
\`\`\`

## 🎯 Progression Pathway

### Phase 1: Contributor (Months 1-6)
\`\`\`
Goals:
□ Make first 10-20 contributions
□ Learn Git/GitHub workflow thoroughly
□ Build basic relationships in 2-3 projects
□ Understand open source etiquette

Metrics:
- 2-4 contributions per month
- Multiple projects (3-5)
- Mix of docs, bugs, small features
- Build confidence and skills
\`\`\`

### Phase 2: Regular Contributor (Months 6-18)
\`\`\`
Goals:
□ Focus on 1-2 main projects
□ Make meaningful feature contributions
□ Help with issue triage and user support
□ Start reviewing others' PRs

Metrics:  
- 1-2 significant contributions per month
- Recognition from maintainers
- Invited to project discussions
- Help newcomers occasionally
\`\`\`

### Phase 3: Core Contributor (Months 18+)
\`\`\`
Goals:
□ Become maintainer of 1+ projects
□ Lead feature development
□ Mentor new contributors
□ Speak at conferences about your work

Metrics:
- Maintainer access to repositories
- Leading feature discussions
- Recognized expert in project domain
- Community leadership role
\`\`\`

## 📈 Measuring Your Impact

### GitHub Profile Optimization:
\`\`\`markdown
Profile Elements:
□ Professional photo
□ Clear bio describing your focus
□ Pinned repositories showing best work
□ Contribution graph consistency
□ Diverse contribution types (commits, PRs, issues)
\`\`\`

### Portfolio Projects to Showcase:
\`\`\`
1. Major Feature Addition
   - Significant functionality you added
   - Clear before/after demonstration
   - Community impact and adoption

2. Performance Improvement  
   - Measurable improvement (speed, memory, etc.)
   - Benchmarks and technical details
   - Real-world impact

3. Documentation/Tutorial
   - Comprehensive guide you created
   - Community appreciation and usage
   - Educational impact

4. Leadership Project
   - Project you maintain or co-maintain
   - Community you've built
   - Decision-making responsibility
\`\`\`

## 💼 Professional Positioning

### Building Your Brand:

#### Technical Blog:
\`\`\`markdown
Content Ideas:
- "How I contributed to [major project]"
- "Lessons learned from open source"  
- "Deep dive into [technology] internals"
- "Building [feature] for [popular project]"
- "Open source contribution guide for [specific domain]"
\`\`\`

#### Social Media Strategy:
\`\`\`
Twitter/LinkedIn:
- Share your contributions with context
- Celebrate merged PRs with technical details
- Help others learn from your experience
- Engage with project communities
- Share interesting findings and learnings
\`\`\`

#### Conference Speaking:
\`\`\`
Talk Ideas:
- Your contribution journey and lessons
- Deep technical dive into your major contribution
- "How to get started with [project]" workshops
- Panel discussions on open source
- Lightning talks on specific features
\`\`\`

## 🤝 Community Leadership

### Ways to Lead:

#### Mentorship:
\`\`\`
- Answer beginner questions in project forums
- Review newcomer PRs with helpful feedback
- Create "good first issue" lists
- Host office hours or Q&A sessions
- Write contribution guides for your projects
\`\`\`

#### Project Organization:
\`\`\`
- Organize issue triage sessions
- Lead feature planning discussions
- Coordinate release activities  
- Organize project meetups or conferences
- Facilitate project governance decisions
\`\`\`

## 🎯 Long-term Reputation Goals

### 1-Year Vision:
\`\`\`
□ Recognized contributor in 2-3 projects
□ 100+ contributions across various types
□ Positive relationships with 5+ maintainers
□ Speaking at 1+ local meetups
□ Technical blog with 5+ posts
\`\`\`

### 3-Year Vision:
\`\`\`
□ Maintainer role in 1+ significant project
□ 500+ contributions with major features
□ Conference speaker at regional/national events
□ Mentor to 10+ new contributors
□ Industry recognition in your domain
\`\`\`

### 5-Year Vision:
\`\`\`
□ Core maintainer of major projects
□ Thought leader in specific technology area
□ International conference keynote speaker
□ Job opportunities from open source work
□ Creating new influential projects
\`\`\`

## 📝 Action Plan Template

\`\`\`markdown
# My Open Source Strategy

## Current Status
- Contributions: [number]
- Main projects: [list]
- Skills: [technical areas]
- Goals: [what you want to achieve]

## 6-Month Plan
### Primary Focus Project:
- Project: [name]
- Why: [alignment with goals]
- Contribution goals: [specific targets]

### Learning Projects (2-3):
- [Project 1]: [contribution type]
- [Project 2]: [contribution type]

### Skills to Develop:
- [Skill 1]: [learning approach]
- [Skill 2]: [learning approach]

## Monthly Targets:
- Contributions: [number and type]
- Blog posts: [frequency]
- Community engagement: [activities]

## Success Metrics:
- [Measurable goal 1]
- [Measurable goal 2]  
- [Measurable goal 3]
\`\`\``,

            commands: [
              {
                description: "View your GitHub contribution stats",
                command: "gh api user --jq '.public_repos, .followers, .following'",
                expectedOutput: "Shows your GitHub profile statistics"
              },
              {
                description: "List your repositories by stars",
                command: "gh repo list --limit 10 --json name,stargazerCount",
                expectedOutput: "Shows your most popular repositories"
              }
            ],

            quiz: [
              {
                question: "What's the most effective long-term strategy for building open source reputation?",
                options: [
                  "Make as many contributions as possible quickly",
                  "Focus on consistency and relationship building in key projects",
                  "Only contribute to very popular projects",
                  "Create many small personal projects"
                ],
                correct: 1
              }
            ]
          }
        },
        {
          id: "10-2",
          title: "Maintaining Your Own Projects",
          duration: "25 minutes",
          content: {
            explanation: `# From Contributor to Maintainer: Creating Successful Open Source Projects

Creating and maintaining your own open source project is the ultimate demonstration of technical and leadership skills.`,
            
            practicalTask: `## 🚀 Project Ideas That Succeed

### Problem-Solving Projects:
\`\`\`
✅ Good Ideas:
- Tools that solve your daily problems
- Libraries that fill gaps in ecosystems  
- Improved versions of existing tools
- Integrations between popular services
- Educational resources with unique approaches

❌ Avoid:
- "Just another" web framework
- Problems already well-solved
- Niche solutions with tiny audiences
- Complex projects requiring teams
\`\`\`

### Successful Project Examples:
\`\`\`
Small but Impactful:
- leftpad (11 lines, millions of downloads)
- is-odd/is-even (utility functions)
- chalk (terminal colors)
- dotenv (environment variables)

Medium Complexity:
- Prettier (code formatter)
- ESLint rules (code quality)
- GitHub Actions (CI/CD workflows)
- VS Code extensions

Large Projects:
- Create React App (development tool)
- Next.js (framework)
- TypeScript (language)
\`\`\`

## 📋 Project Launch Checklist

### Essential Files:
\`\`\`
my-awesome-project/
├── README.md              ⭐ Critical
├── LICENSE               ⭐ Critical  
├── package.json          ⭐ Critical
├── .gitignore           ⭐ Critical
├── CONTRIBUTING.md       🔥 Important
├── CODE_OF_CONDUCT.md    🔥 Important
├── CHANGELOG.md          🔥 Important
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       └── ci.yml
├── src/                  # Your code
├── tests/               # Test suite
├── docs/                # Documentation
└── examples/            # Usage examples
\`\`\`

### Perfect README Template:
\`\`\`markdown
# Project Name

Brief, compelling description of what your project does.

[![npm version](https://badge.fury.io/js/your-package.svg)](https://badge.fury.io/js/your-package)
[![Build Status](https://travis-ci.org/username/project.svg?branch=main)](https://travis-ci.org/username/project)
[![Coverage Status](https://coveralls.io/repos/github/username/project/badge.svg?branch=main)](https://coveralls.io/github/username/project?branch=main)

## ✨ Features

- 🚀 Fast and lightweight
- 📦 Zero dependencies  
- 🎯 Type-safe (TypeScript)
- 📱 Cross-platform support

## 🚀 Quick Start

\`\`\`bash
npm install your-package
\`\`\`

\`\`\`javascript
const yourPackage = require('your-package');

// Simple example
yourPackage.doSomething('hello');
\`\`\`

## 📖 Documentation

- [Installation](docs/installation.md)
- [API Reference](docs/api.md)
- [Examples](docs/examples.md)
- [Contributing](CONTRIBUTING.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT © [Your Name](https://github.com/yourusername)
\`\`\`

## 🛠️ Development Best Practices

### Code Quality Setup:
\`\`\`json
// package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "build": "typescript compilation or bundling",
    "prepublishOnly": "npm run test && npm run build"
  }
}
\`\`\`

### CI/CD Pipeline (.github/workflows/ci.yml):
\`\`\`yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14, 16, 18]
    
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js (matrix.node-version)
        uses: actions/setup-node@v3
        with:
          node-version: (matrix.node-version)
      - run: npm install
      - run: npm test
      - run: npm run lint
\`\`\`

## 👥 Building Community

### Welcoming First Contributors:
\`\`\`markdown
# CONTRIBUTING.md key sections:

## Getting Started
- Clear development setup instructions
- How to run tests locally  
- Code style guidelines

## Finding Issues to Work On
- Label system explanation
- "good first issue" criteria
- How to claim issues

## Submission Process
- PR requirements
- Review process explanation
- What to expect timeline-wise
\`\`\`

### Issue Templates:
\`\`\`markdown
<!-- .github/ISSUE_TEMPLATE/bug_report.md -->
---
name: Bug report
about: Create a report to help us improve

---

## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. See error

## Expected Behavior
What you expected to happen.

## Environment
- OS: [e.g. iOS]
- Version: [e.g. 22]
- Browser: [e.g. chrome, safari]
\`\`\`

## 📈 Growing Your Project

### Marketing Strategies:
\`\`\`
Launch Channels:
□ Reddit (relevant subreddits)
□ Hacker News (if genuinely newsworthy)
□ Twitter (with relevant hashtags)
□ Dev.to (write about your project)
□ Product Hunt (for tools/apps)
□ Show HN (Hacker News)

Community Building:
□ Discord/Slack server
□ Regular blog updates
□ Conference talks
□ Podcast appearances  
□ YouTube tutorials
\`\`\`

### Metrics to Track:
\`\`\`
Growth Metrics:
- GitHub stars/forks
- NPM downloads (for packages)
- Issue/PR activity
- Community size
- Documentation views

Quality Metrics:  
- Test coverage
- Performance benchmarks
- User satisfaction
- Contribution quality
- Release frequency
\`\`\`

## 🎯 Practical Exercise: Plan Your Project

### Project Planning Template:
\`\`\`markdown
# My Open Source Project Plan

## Project Concept
- **Name**: [creative, memorable name]
- **Problem**: [what problem does it solve?]
- **Solution**: [how does it solve it?]
- **Target Users**: [who will use this?]

## Technical Details
- **Language**: [primary programming language]
- **Dependencies**: [key dependencies needed]
- **Platform**: [web, mobile, CLI, library, etc.]
- **Architecture**: [high-level design]

## Competitive Analysis
- **Existing Solutions**: [what exists already?]
- **Differentiators**: [why is yours better/different?]
- **Market Size**: [how many potential users?]

## Launch Strategy
- **MVP Features**: [minimum viable features]
- **Timeline**: [development timeline]
- **Marketing Plan**: [how will you promote it?]
- **Success Metrics**: [how will you measure success?]

## Community Building
- **Contribution Strategy**: [how to attract contributors?]
- **Documentation Plan**: [what docs are needed?]
- **Support Strategy**: [how will you handle support?]
\`\`\`

### Month 1 Action Items:
\`\`\`
□ Set up repository structure
□ Write comprehensive README
□ Implement core functionality
□ Add test suite (aim for >80% coverage)
□ Set up CI/CD pipeline
□ Create initial documentation
□ Publish first version (even if basic)
\`\`\``,

            commands: [
              {
                description: "Create new repository",
                command: "gh repo create my-awesome-project --public --clone",
                expectedOutput: "Creates and clones new repository"
              },
              {
                description: "Add repository topics",
                command: "gh repo edit --add-topic javascript,opensource,tool",
                expectedOutput: "Adds discoverable topics to repository"
              },
              {
                description: "Create release",
                command: 'gh release create v1.0.0 --title "First Release" --notes "Initial version"',
                expectedOutput: "Creates first release of your project"
              }
            ],

            quiz: [
              {
                question: "What's the most important factor for a successful open source project?",
                options: [
                  "Having the most advanced technology",
                  "Solving a real problem people actually have",
                  "Getting featured on Hacker News",
                  "Having perfect documentation from day one"
                ],
                correct: 1
              }
            ]
          }
        }
      ]
    }
  ];

  const isModuleUnlocked = (moduleId) => {
    if (moduleId === 1) return true;
    const module = detailedModules.find(m => m.id === moduleId);
    if (!module || !module.prerequisite) return true;
    return completedModules.has(module.prerequisite);
  };

  const getLessonKey = (moduleId, lessonId) => `${moduleId}-${lessonId}`;

  const isLessonCompleted = (moduleId, lessonId) => {
    return completedLessons.has(getLessonKey(moduleId, lessonId));
  };

  const handleLessonComplete = (moduleId, lessonId) => {
    const lessonKey = getLessonKey(moduleId, lessonId);
    setCompletedLessons(prev => new Set([...prev, lessonKey]));
    
    // Check if all lessons in module are complete
    const module = detailedModules.find(m => m.id === moduleId);
    if (module) {
      const allLessonsComplete = module.lessons.every(lesson => 
        isLessonCompleted(moduleId, lesson.id) || lesson.id === lessonId
      );
      if (allLessonsComplete) {
        setCompletedModules(prev => new Set([...prev, moduleId]));
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
    });
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              🚀 Interactive Open Source Academy
            </h1>
            <p className="text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Step-by-step tutorials with real commands, practical exercises, and hands-on projects
            </p>
          </div>
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {detailedModules.map((module) => {
          const IconComponent = module.icon;
          const isCompleted = completedModules.has(module.id);
          const isUnlocked = isModuleUnlocked(module.id);
          const completedLessonsCount = module.lessons.filter(lesson => 
            isLessonCompleted(module.id, lesson.id)
          ).length;

          return (
            <div key={module.id} className="mb-12">
              <div className={`bg-white rounded-3xl shadow-xl border transition-all duration-300 ${
                isCompleted ? 'border-green-200 ring-2 ring-green-100' :
                isUnlocked ? 'border-blue-200' : 'border-gray-200 opacity-60'
              }`}>
                {/* Module Header */}
                <div className={`bg-gradient-to-r ${module.color} text-white p-8 rounded-t-3xl`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold mb-2">Module {module.id}: {module.title}</h2>
                        <p className="text-xl text-white/90">{module.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{module.xpReward} XP</div>
                      <div className="text-white/80">{completedLessonsCount}/{module.lessons.length} lessons</div>
                    </div>
                  </div>
                </div>

                {/* Lessons Content */}
                {isUnlocked && (
                  <div className="p-8">
                    <div className="space-y-8">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const lessonCompleted = isLessonCompleted(module.id, lesson.id);
                        const lessonKey = `lesson-${module.id}-${lesson.id}`;
                        const isExpanded = expandedSections.has(lessonKey);

                        return (
                          <div key={lesson.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                            {/* Lesson Header */}
                            <div 
                              className={`p-6 cursor-pointer transition-colors ${
                                lessonCompleted ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                              onClick={() => toggleSection(lessonKey)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    lessonCompleted ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    {lessonCompleted ? (
                                      <CheckCircleSolid className="w-6 h-6" />
                                    ) : (
                                      <span className="font-bold">{lessonIndex + 1}</span>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
                                    <p className="text-gray-600">Duration: {lesson.duration}</p>
                                  </div>
                                </div>
                                {isExpanded ? (
                                  <ChevronUpIcon className="w-6 h-6 text-gray-400" />
                                ) : (
                                  <ChevronDownIcon className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                            </div>

                            {/* Lesson Content */}
                            {isExpanded && (
                              <div className="p-6 bg-white border-t border-gray-200">
                                {/* Explanation */}
                                <div className="mb-8">
                                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <BookOpenIcon className="w-5 h-5 text-blue-500" />
                                    Concept & Theory
                                  </h4>
                                  <div className="prose max-w-none text-gray-700">
                                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border text-sm">
                                      {lesson.content.explanation}
                                    </pre>
                                  </div>
                                </div>

                                {/* Practical Task */}
                                <div className="mb-8">
                                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <CodeBracketIcon className="w-5 h-5 text-green-500" />
                                    Hands-On Practice
                                  </h4>
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                                      {lesson.content.practicalTask}
                                    </pre>
                                  </div>
                                </div>

                                {/* Commands Section */}
                                {lesson.content.commands && (
                                  <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                      <CommandLineIcon className="w-5 h-5 text-purple-500" />
                                      Commands Reference
                                    </h4>
                                    <div className="space-y-4">
                                      {lesson.content.commands.map((cmd, idx) => (
                                        <div key={idx} className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-300 text-xs uppercase tracking-wider">
                                              {cmd.description}
                                            </span>
                                            <button
                                              onClick={() => copyToClipboard(cmd.command)}
                                              className="text-gray-400 hover:text-white transition-colors p-1"
                                              title="Copy command"
                                            >
                                              <ClipboardDocumentIcon className="w-4 h-4" />
                                            </button>
                                          </div>
                                          <div className="text-green-400 mb-2">$ {cmd.command}</div>
                                          <div className="text-gray-400 text-xs">
                                            Expected: {cmd.expectedOutput}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Quiz Section */}
                                {lesson.content.quiz && (
                                  <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                      <AcademicCapIcon className="w-5 h-5 text-yellow-500" />
                                      Knowledge Check
                                    </h4>
                                    {lesson.content.quiz.map((q, idx) => (
                                      <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                        <h5 className="font-semibold mb-4">{q.question}</h5>
                                        <div className="space-y-2">
                                          {q.options.map((option, optIdx) => (
                                            <label key={optIdx} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-yellow-100 rounded">
                                              <input type="radio" name={`quiz-${lesson.id}-${idx}`} className="text-yellow-500" />
                                              <span>{option}</span>
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Completion Button */}
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleLessonComplete(module.id, lesson.id)}
                                    disabled={lessonCompleted}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                                      lessonCompleted
                                        ? 'bg-green-100 text-green-800 cursor-default'
                                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
                                    }`}
                                  >
                                    {lessonCompleted ? (
                                      <>
                                        <CheckCircleSolid className="w-5 h-5" />
                                        Completed
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Mark as Complete
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Locked State */}
                {!isUnlocked && (
                  <div className="p-8 text-center text-gray-500">
                    <LockClosedIcon className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg">Complete Module {module.prerequisite} to unlock this module</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}