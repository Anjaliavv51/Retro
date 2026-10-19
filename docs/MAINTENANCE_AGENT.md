# 🤖 Retro Daily Automated Contribution & Maintenance Agent

An intelligent, scheduled maintenance agent built for the **Retro** project to ensure consistent, authentic, and meaningful development activity on GitHub credited directly to your profile.

---

## 🌟 Philosophy: Authentic Contributions with Verified Profile Credit

The **Retro Maintenance Agent** operates on a strict **authenticity and contribution guarantee**:

1. **Meaningful Improvements Only**: The agent targets genuine tasks—updating documentation, expanding unit tests, auditing database schemas, validating catalog integrity, evaluating bundle performance, and logging system health telemetry.
2. **10 Commits per Day**: 10 distinct, modular tasks execute every day, generating 10 isolated commits with conventional changelog semantics (`fix(catalog)`, `perf(pwa)`, `test(models)`, `docs(api)`, `chore(security)`, `perf(assets)`, etc.).
3. **One File per Commit**: In accordance with clean commit policy, each improvement is isolated in its own focused commit.
4. **Pre-Commit Verification**: Every change must pass syntax checks and regression test suites before being staged or committed. Broken code is immediately reverted and never committed.
5. **Direct Profile Contribution Credit**: Commits are authored with `Anjaliavv51 <plpanjali05@gmail.com>` and pushed directly to `main`, ensuring every single commit appears on your public GitHub activity and contribution squares.

---

## 📋 10 Daily Task Modules

The agent's tasks are modularized under [`scripts/maintenance-agent/tasks/`](file:///scripts/maintenance-agent/tasks/):

| # | Task Module | Domain | Target File | Impact |
| :- | :--- | :--- | :--- | :--- |
| **01** | **Catalog Index & Statistics** | Data Quality | `python/catalog_index.json` | Computes catalog search index, price distributions, and stock statistics. |
| **02** | **Security & Secret Audit** | Security | `docs/SECURITY_AUDIT.md` | Audits gitignore protection rules and records daily security posture. |
| **03** | **API Reference Sync** | Documentation | `docs/API_REFERENCE.md` | Keeps API documentation in sync with Express and serverless routes. |
| **04** | **PWA Service Worker Sync** | Performance | `service-worker.js` | Refreshes PWA cache table and updates offline precache version tag. |
| **05** | **Schema Test Suite** | Testing & QA | `backend/test_suites/test_schemas.js` | Enforces validation rules on Product & Review Mongoose models. |
| **06** | **Endpoint Health Telemetry** | Testing & Reliability | `docs/HEALTH_METRICS.md` | Verifies route health and records daily API response telemetry. |
| **07** | **Static Bundle Budget** | Performance | `docs/PERFORMANCE_BUDGET.md` | Tracks storefront asset sizes against performance budgets. |
| **08** | **Dependency Security Scan** | Security | `docs/DEPENDENCY_STATUS.md` | Scans root and backend packages for integrity and advisory notices. |
| **09** | **Daily Changelog Entry** | Documentation | `docs/DAILY_CHANGELOG.md` | Maintains chronological daily audit logs of maintenance runs. |
| **10** | **System Maintenance Heartbeat**| System & CI | `docs/SYSTEM_HEARTBEAT.json` | Records automation heartbeat, Node environment, and uptime state. |

---

## ⏰ Automation & GitHub Actions Setup

The agent is fully configured to run via GitHub Actions in [`.github/workflows/daily-contributor.yml`](file:///.github/workflows/daily-contributor.yml).

### Schedule
- Runs **4 times daily** (`04:00`, `10:00`, `16:00`, `22:00` UTC) to prevent GitHub Actions scheduler delays.
- Can also be triggered on-demand at any time from the **Actions** tab.

### Required GitHub Repository Permissions
To allow the workflow to push commits directly to `main`:
1. Navigate to **Repository Settings** > **Actions** > **General**.
2. Scroll to **Workflow permissions**.
3. Select **"Read and write permissions"**.
4. Check the box **"Allow GitHub Actions to create and approve pull requests"**.
5. Click **Save**.

---

## 💻 Local CLI Execution

You can run the agent locally anytime from your terminal:

```bash
# 1. Run in simulation mode (no git commits)
npm run agent:dry-run

# 2. Run live execution directly on main
node scripts/maintenance-agent/runner.js --no-branch --max-commits 10
```
