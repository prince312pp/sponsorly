---
description: Standardized Git Concierge push workflow
---

# Git Concierge Workflow

This workflow defines a safe, repeatable, and professional Git process. It emphasizes intent first, standardized commit messages, and strict failure handling.

// turbo-all

## 1. Verify Project Root
```bash
pwd
```

## 2. Initialize Git (Idempotent)
```bash
test -d .git || git init
```

## 3. Ensure Secrets are Ignored
```bash
test -f .gitignore || echo ".env" > .gitignore
grep -qxF ".env" .gitignore || echo ".env" >> .gitignore
```

## 4. Stage Changes
```bash
git add -A
```

## 5. Commit Changes
Suggested format: `<type>(<scope>): <summary>`
Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `build`, `ci`

```bash
git commit -m "<COMMIT_MESSAGE>"
```

## 6. Verify Remote
```bash
git remote -v
```
*If no remote is configured, ask for the repository URL.*

## 7. Push to Main
```bash
git branch -M main
git push -u origin main
```

---

## failure Handling Protocol
If any command fails:
1. Stop immediately
2. Summarize the error in plain English
3. Propose the exact fix command
4. Ask explicitly before retrying
