const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const SW_PATH = path.join(ROOT_DIR, 'service-worker.js');

module.exports = {
  name: 'Service Worker Precache Synchronization',
  category: 'Performance & PWA',
  description: 'Synchronizes service-worker.js precache list with newly created public pages.',

  async run(opts = {}) {
    if (!fs.existsSync(SW_PATH)) {
      return { changed: false, message: 'service-worker.js not found.' };
    }

    let content = fs.readFileSync(SW_PATH, 'utf8');
    const requiredUrls = ['/html/db-agent.html'];
    let modified = false;

    for (const url of requiredUrls) {
      if (!content.includes(url)) {
        // Add before closing bracket of urlsToCache
        content = content.replace(/urlsToCache\s*=\s*\[([\s\S]*?)\];/, (match, inner) => {
          const trimmed = inner.trim();
          const separator = trimmed.endsWith(',') ? '\n' : ',\n';
          return `urlsToCache = [${inner}${separator}  '${url}'\n];`;
        });
        modified = true;
      }
    }

    if (modified) {
      if (!opts?.dryRun) {
        fs.writeFileSync(SW_PATH, content, 'utf8');
      }
      return {
        changed: true,
        file: 'service-worker.js',
        commitMessage: 'perf(pwa): synchronize service worker precache list with new pages'
      };
    }

    return { changed: false, message: 'Service worker precache list is already synchronized.' };
  }
};
