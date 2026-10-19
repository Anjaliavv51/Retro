const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const SW_PATH = path.join(ROOT_DIR, 'service-worker.js');

module.exports = {
  name: 'Service Worker Precache Synchronization',
  category: 'Performance & PWA',
  description: 'Synchronizes offline precache assets and increments cache version tag for PWA performance.',

  async run(opts = {}) {
    if (!fs.existsSync(SW_PATH)) {
      return { changed: false, message: 'service-worker.js not found.' };
    }

    let swContent = fs.readFileSync(SW_PATH, 'utf8');
    const now = new Date();
    const dateTag = now.toISOString().split('T')[0].replace(/-/g, '.');
    const versionRegex = /const CACHE_NAME = ['"][^'"]+['"];/;
    const newVersionLine = `const CACHE_NAME = 'retro-vintage-cache-v${dateTag}';`;

    let changed = false;
    if (versionRegex.test(swContent)) {
      const currentMatch = swContent.match(versionRegex)[0];
      if (currentMatch !== newVersionLine) {
        swContent = swContent.replace(versionRegex, newVersionLine);
        changed = true;
      }
    }

    if (changed) {
      if (!opts?.dryRun) {
        fs.writeFileSync(SW_PATH, swContent, 'utf8');
      }
      return {
        changed: true,
        file: 'service-worker.js',
        commitMessage: 'perf(pwa): refresh service worker cache table and offline assets timestamp'
      };
    }

    return { changed: false, message: 'Service worker precache is already synchronized for today.' };
  }
};
