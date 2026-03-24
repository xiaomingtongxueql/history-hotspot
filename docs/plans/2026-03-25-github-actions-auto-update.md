# GitHub Actions Auto-Update Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Connect the website's update button to automated scraping via GitHub Actions

**Architecture:** GitHub Actions workflow runs scraper.py on schedule (weekly) or manual trigger, commits updated JSON to main, then builds and deploys to gh-pages. Frontend button opens GitHub Actions page for manual trigger.

**Tech Stack:** GitHub Actions, Python 3.11, Scrapling, Vite, gh-pages deployment

---

### Task 1: Create GitHub Actions workflow

**Files:**
- Create: `.github/workflows/update-data.yml`

The workflow:
- Triggers: `schedule` (cron weekly Monday 2am UTC) + `workflow_dispatch` (manual)
- Steps: checkout → setup Python → install scrapling → run scraper.py → commit JSON changes → setup Node → build Vite → deploy dist to gh-pages

### Task 2: Modify frontend — update button behavior

**Files:**
- Modify: `src/App.jsx` — replace fake handleUpdate with GitHub Actions redirect
- Modify: `src/components/Navbar.jsx` — show lastUpdated time, change button to link

### Task 3: Build, commit, push, verify

- Commit all changes
- Push to main (triggers Actions)
- Verify workflow appears on GitHub
