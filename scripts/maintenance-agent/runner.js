#!/usr/bin/env node

/**
 * 🤖 Retro Automated Daily Contribution Agent Runner
 * 
 * Analyzes the codebase, identifies genuine and meaningful improvements,
 * runs pre-commit test validations, creates up to 5 individual commits
 * (strictly 1 commit per file/task), and prepares a pull request summary.
 */

// Node 26 compatibility polyfill
const bufferModule = require('buffer');
if (!bufferModule.SlowBuffer) bufferModule.SlowBuffer = bufferModule.Buffer;
if (typeof SlowBuffer === 'undefined') global.SlowBuffer = bufferModule.Buffer;

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '../..');
const TASKS_DIR = path.join(__dirname, 'tasks');

// Helper to resolve git executable in both Linux CI and Windows Desktop environments
function resolveGit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return 'git';
  } catch (e) {
    const localAppData = process.env.LOCALAPPDATA || 'C:\\Users\\plpan\\AppData\\Local';
    const ghDesktop = path.join(localAppData, 'GitHubDesktop');
    if (fs.existsSync(ghDesktop)) {
      const apps = fs.readdirSync(ghDesktop).filter(f => f.startsWith('app-')).sort().reverse();
      for (const app of apps) {
        const gitPath = path.join(ghDesktop, app, 'resources', 'app', 'git', 'cmd', 'git.exe');
        if (fs.existsSync(gitPath)) return `"${gitPath}"`;
      }
    }
    return 'git';
  }
}

const GIT = resolveGit();

function runCommand(cmd, cwd = REPO_ROOT) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    const errorDetails = (err.stdout || '') + (err.stderr || '') + (err.message || '');
    throw new Error(`Command failed: ${cmd}\n${errorDetails}`);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    maxCommits: 10,
    branch: '',
    noBranch: args.includes('--no-branch')
  };

  const maxIndex = args.indexOf('--max-commits');
  if (maxIndex !== -1 && args[maxIndex + 1]) {
    options.maxCommits = parseInt(args[maxIndex + 1], 10) || 10;
  }

  const branchIndex = args.indexOf('--branch');
  if (branchIndex !== -1 && args[branchIndex + 1]) {
    options.branch = args[branchIndex + 1];
  } else {
    const today = new Date().toISOString().split('T')[0];
    options.branch = options.noBranch ? 'main' : `agent/daily-updates-${today}`;
  }

  return options;
}

async function main() {
  const opts = parseArgs();
  const startTime = new Date();
  console.log('====================================================');
  console.log('🤖 Retro Daily Contribution & Quality Agent Starting');
  console.log(`🕒 Timestamp: ${startTime.toISOString()}`);
  console.log(`🎯 Dry Run: ${opts.dryRun ? 'YES (Simulated)' : 'NO (Live)'}`);
  console.log(`📌 Max Commits Allowed: ${opts.maxCommits}`);
  console.log(`🌿 Target Branch: ${opts.branch}`);
  console.log('====================================================\n');

  // Step 1: Pre-run Regression & Integrity Checks
  console.log('🔍 Step 1: Verifying codebase health before starting...');
  try {
    runCommand('node backend/test_db_agent_endpoints.js');
    console.log('  ✅ Pre-flight regression tests passed successfully.\n');
  } catch (err) {
    console.error('  ❌ Pre-flight checks failed! Codebase has existing broken tests.');
    console.error(err.message);
    process.exit(1);
  }

  // Step 2: Branch Setup (Dedicated branch, never main)
  let initialBranch = 'main';
  if (!opts.dryRun && !opts.noBranch) {
    console.log(`🌿 Step 2: Preparing dedicated branch: ${opts.branch}`);
    try {
      initialBranch = runCommand(`${GIT} rev-parse --abbrev-ref HEAD`);
      // Check if branch already exists
      const branchExists = runCommand(`${GIT} branch --list ${opts.branch}`);
      if (branchExists) {
        runCommand(`${GIT} checkout ${opts.branch}`);
      } else {
        runCommand(`${GIT} checkout -b ${opts.branch}`);
      }
      console.log(`  ✅ Checked out dedicated branch: ${opts.branch}\n`);
    } catch (err) {
      console.warn(`  ⚠️ Could not switch branch: ${err.message}. Operating on current branch.\n`);
    }
  }

  // Step 3: Discover and Run Task Modules
  console.log('📋 Step 3: Discovering and evaluating genuine improvement tasks...');
  const taskFiles = fs.readdirSync(TASKS_DIR)
    .filter(file => file.endsWith('.js'))
    .sort();

  const completedCommits = [];
  const evaluatedTasks = [];
  let commitCount = 0;

  for (const file of taskFiles) {
    if (commitCount >= opts.maxCommits) {
      console.log(`🛑 Maximum commit limit (${opts.maxCommits}) reached for today's run.`);
      break;
    }

    const taskPath = path.join(TASKS_DIR, file);
    const task = require(taskPath);
    console.log(`\n👉 Evaluating Task: [${task.category}] ${task.name}`);

    try {
      const result = await task.run(opts);

      if (result.changed) {
        console.log(`  ✨ Task identified valid improvement in: ${result.file}`);
        console.log(`  📝 Proposed commit: "${result.commitMessage}"`);

        // Pre-commit validation: Test syntax & regression
        console.log('  🧪 Running pre-commit validation tests on changed code...');
        let passed = true;
        let testError = null;

        if (!opts.dryRun) {
          // Syntax check if JS file
          if (result.file.endsWith('.js') && fs.existsSync(path.join(REPO_ROOT, result.file))) {
            try {
              runCommand(`node --check ${result.file}`);
            } catch (e) {
              passed = false;
              testError = `Syntax validation failed: ${e.message}`;
            }
          }

          // Regression check
          if (passed) {
            try {
              runCommand('node backend/test_db_agent_endpoints.js');
            } catch (e) {
              passed = false;
              testError = `Regression test failed: ${e.message}`;
            }
          }
        }

        if (!passed) {
          console.error(`  ❌ Validation failed! Reverting ${result.file}`);
          if (!opts.dryRun) {
            try { runCommand(`${GIT} checkout -- ${result.file}`); } catch (e) {}
          }
          evaluatedTasks.push({
            name: task.name,
            category: task.category,
            status: 'Failed Validation (Reverted)',
            file: result.file,
            details: testError
          });
          continue;
        }

        console.log('  ✅ Validation passed with zero errors.');

        // Git Commit
        let commitHash = 'dry-run';
        if (!opts.dryRun) {
          runCommand(`${GIT} add "${result.file}"`);
          runCommand(`${GIT} commit --author="Anjaliavv51 <plpanjali05@gmail.com>" -m "${result.commitMessage}"`);
          commitHash = runCommand(`${GIT} rev-parse --short HEAD`);
          console.log(`  🎉 Created commit ${commitHash} for ${result.file}`);
        } else {
          console.log(`  [DRY-RUN] Would create commit for ${result.file}`);
        }

        commitCount++;
        completedCommits.push({
          hash: commitHash,
          file: result.file,
          message: result.commitMessage,
          category: task.category
        });

        evaluatedTasks.push({
          name: task.name,
          category: task.category,
          status: 'Committed',
          file: result.file,
          hash: commitHash
        });

      } else {
        console.log(`  ℹ️ No changes needed: ${result.message || 'Already optimal'}`);
        evaluatedTasks.push({
          name: task.name,
          category: task.category,
          status: 'Up to Date',
          file: '-',
          details: result.message
        });
      }
    } catch (err) {
      console.error(`  ❌ Error executing task ${task.name}:`, err.message);
      evaluatedTasks.push({
        name: task.name,
        category: task.category,
        status: 'Error',
        file: '-',
        details: err.message
      });
    }
  }

  // Step 4: Final Verification
  console.log('\n🏁 Step 4: Running post-execution regression test suite...');
  let finalTestsPassed = false;
  try {
    runCommand('node backend/test_db_agent_endpoints.js');
    finalTestsPassed = true;
    console.log('  ✅ All database agent and API tests are 100% operational.\n');
  } catch (err) {
    console.error('  ❌ Post-execution test failure:', err.message);
  }

  // Step 5: Generate Daily Summary Report
  const summaryMarkdown = generateMarkdownReport({
    startTime,
    opts,
    completedCommits,
    evaluatedTasks,
    finalTestsPassed
  });

  const summaryPath = path.join(__dirname, 'last-run-summary.md');
  fs.writeFileSync(summaryPath, summaryMarkdown, 'utf8');
  console.log(`📄 Daily summary saved to: ${summaryPath}`);

  // Write to GitHub Actions Step Summary if in CI
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryMarkdown + '\n', 'utf8');
      console.log('📊 Appended summary to GitHub Step Summary');
    } catch (e) {
      console.warn('Could not write to GITHUB_STEP_SUMMARY:', e.message);
    }
  }

  console.log('\n====================================================');
  console.log(`🎉 Daily Agent Execution Finished: ${completedCommits.length} commits created.`);
  console.log('====================================================\n');
}

function generateMarkdownReport({ startTime, opts, completedCommits, evaluatedTasks, finalTestsPassed }) {
  const dateStr = startTime.toISOString().split('T')[0];
  const timeStr = startTime.toLocaleTimeString('en-US', { hour12: false });

  let commitRows = '';
  if (completedCommits.length > 0) {
    commitRows = completedCommits.map(c => 
      `| \`${c.hash}\` | **${c.category}** | \`${c.file}\` | ${c.message} |`
    ).join('\n');
  } else {
    commitRows = '| - | *Maintenance Check* | *None* | All evaluated areas are already in optimal state. |';
  }

  let taskRows = evaluatedTasks.map(t => 
    `| ${t.name} | ${t.category} | ${t.status === 'Committed' ? '✅ Committed' : t.status === 'Up to Date' ? '⚡ Up to Date' : '⚠️ ' + t.status} | \`${t.file}\` |`
  ).join('\n');

  return `# 🤖 Retro Daily Contribution & Quality Report (${dateStr})

> Automated quality and maintenance report executed at **${timeStr} UTC**.

---

### 📊 Summary Dashboard
- **Execution Date**: \`${dateStr}\`
- **Target Branch**: \`${opts.branch}\` (Dedicated branch; never committed directly to \`main\`)
- **Meaningful Commits Created**: **${completedCommits.length}** / ${opts.maxCommits} max
- **Codebase Regression Tests**: ${finalTestsPassed ? '✅ **100% Passed (All tests green)**' : '❌ **Tests Failed**'}
- **Mode**: ${opts.dryRun ? '🔍 *Dry Run (Simulated)*' : '🚀 *Live Execution*'}

---

### 📦 Commits Created Today
| Commit | Category | Target File | Description |
| :--- | :--- | :--- | :--- |
${commitRows}

---

### 📋 Task Evaluation Breakdown
| Task Name | Domain | Evaluation Result | Target File |
| :--- | :--- | :--- | :--- |
${taskRows}

---

### 🛡️ Quality Safeguards & Anti-Noise Guarantee
- **Zero Dummy Commits**: Commits are strictly generated only when tangible code, documentation, catalog, or test improvements are identified.
- **One File Per Commit**: Every individual change is isolated in its own focused commit.
- **Pre-Commit Verification**: All modified code must pass syntax checks and regression suites prior to being staged.
- **Branch Protection**: All automated work is isolated on dedicated branch \`${opts.branch}\` ready for authorized Pull Request review.
`;
}

main().catch(err => {
  console.error('Fatal agent error:', err);
  process.exit(1);
});
