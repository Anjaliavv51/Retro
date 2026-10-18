# 🤖 Retro Daily Automated Contribution & Maintenance Agent

An intelligent, scheduled maintenance agent built for the **Retro** project to ensure consistent, authentic, and meaningful development activity on GitHub.

---

## 🌟 Philosophy: Authentic Contributions vs. Artificial Noise

Unlike naive bot scripts that generate meaningless random commits or whitespace changes solely to fill GitHub contribution squares, the **Retro Maintenance Agent** operates on a strict **authenticity guarantee**:

1. **Meaningful Improvements Only**: The agent targets genuine tasks—updating documentation, expanding unit tests, auditing database schemas, validating catalog integrity, and hardening security.
2. **Up to 5 Commits per Day**: If 5 legitimate improvements exist, up to 5 commits are made. If fewer or none are needed, the agent commits only what is justified—never padding the count.
3. **One File per Commit**: In accordance with the repository's clean commit policy, each improvement is isolated in its own focused commit with conventional changelog semantics (`fix(catalog)`, `perf(pwa)`, `test(models)`, `docs(api)`, `chore(security)`).
4. **Pre-Commit Verification**: Every change must pass syntax checks and regression test suites before being staged or committed. Broken code is immediately reverted and never committed.
5. **Branch Protection & Dedicated Isolation**: The agent **never** pushes directly to `main`. All work is isolated on a daily dedicated branch (`agent/daily-updates-YYYY-MM-DD`), and a Pull Request is opened for review.

---

## 📋 Task Modules

The agent's tasks are modularized under [`scripts/maintenance-agent/tasks/`](file:///scripts/maintenance-agent/tasks/):

| Task | Domain | Target File | Impact |
| :--- | :--- | :--- | :--- |
| **API Reference Sync** | Documentation | `docs/API_REFERENCE.md` | Keeps API documentation in sync with Express and serverless routes. |
| **Vintage Catalog Audit** | Data Quality | `python/vintage_products.json` | Validates numeric pricing, stock counters, and deduplicates keywords. |
| **Security Hardening** | Security | `.gitignore` | Hardens ignores against credential leaks (`.env*`, `*.pem`, `scratch/`). |
| **PWA Service Worker Sync** | Performance | `service-worker.js` | Ensures new public HTML pages are included in the offline cache. |
| **Schema Test Suite** | Testing & QA | `backend/test_suites/test_schemas.js` | Enforces validation rules on Product & Review models. |

---

## ⏰ Automation & GitHub Actions Setup

The agent is fully configured to run via GitHub Actions in [`.github/workflows/daily-contributor.yml`](file:///.github/workflows/daily-contributor.yml).

### Schedule
- Runs automatically **every day at 04:00 UTC** (9:30 AM IST).
- Can also be triggered manually on-demand at any time from the **Actions** tab.

### Required GitHub Repository Permissions
To allow the workflow to create branches and open Pull Requests:
1. Navigate to **Repository Settings** > **Actions** > **General**.
2. Scroll to **Workflow permissions**.
3. Select **"Read and write permissions"**.
4. Check the box **"Allow GitHub Actions to create and approve pull requests"**.
5. Click **Save**.

---

## 🎛️ Safe Enable / Disable / Monitoring

### How to Disable or Pause the Agent
You can pause the agent without deleting the workflow:
1. Go to **Settings** > **Secrets and variables** > **Actions** > **Variables** tab.
2. Click **New repository variable**.
3. Name: `DAILY_AGENT_ENABLED`
4. Value: `false`
5. Click **Add variable**.

> When `DAILY_AGENT_ENABLED` is set to `false`, the workflow immediately skips execution without running any scripts or touching git. To re-enable, delete the variable or set its value to `true`.

### How to Run a Dry Run Manually
1. Go to your repository on GitHub.
2. Click the **Actions** tab.
3. Select **"🤖 Retro Daily Automated Contributor Agent"** from the left sidebar.
4. Click **Run workflow**.
5. Check the **"Simulate without creating git commits or opening PRs"** box.
6. Click **Run workflow**.

---

## 💻 Local CLI Execution

You can run the agent locally anytime from your terminal:

```bash
# 1. Run in simulation mode (no branch switch, no git commits)
npm run agent:dry-run

# 2. Run live execution on a dedicated daily branch
npm run agent:daily

# 3. Limit to specific number of commits (e.g., 2)
node scripts/maintenance-agent/runner.js --max-commits 2

# 4. Run on a custom branch
node scripts/maintenance-agent/runner.js --branch agent/feature-experiment
```

---

## 📊 Daily Summary & Monitoring

After each run, the agent produces a Markdown summary in `scripts/maintenance-agent/last-run-summary.md` and posts it to:
1. **GitHub Actions Step Summary**: Visible directly on the workflow run page.
2. **Pull Request Description**: Formatted as the description for the daily PR opened by the agent.
3. **Local Summary File**: Stored locally for offline auditing.
