---
description: Commit and push changes to GitHub
---

This workflow commits all changes and pushes to the GitHub repository.

// turbo-all

1. Stage all changes
```bash
git add .
```

2. Commit with timestamp message
```bash
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
```

3. Push to remote repository
```bash
git push
```
