const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const GITIGNORE_PATH = path.join(ROOT_DIR, '.gitignore');

module.exports = {
  name: 'Security & Secret Exposure Hardening',
  category: 'Security & Integrity',
  description: 'Audits gitignore security rules and ensures environment credentials cannot be committed.',

  async run(opts = {}) {
    if (!fs.existsSync(GITIGNORE_PATH)) {
      return { changed: false, message: '.gitignore not found.' };
    }

    let gitignore = fs.readFileSync(GITIGNORE_PATH, 'utf8');
    const essentialRules = [
      '.env',
      '.env.local',
      '.env.*.local',
      '*.key',
      '*.pem',
      'scratch/'
    ];

    let modified = false;
    essentialRules.forEach(rule => {
      const regex = new RegExp(`^${rule.replace('.', '\\.').replace('*', '.*')}$`, 'm');
      if (!regex.test(gitignore)) {
        gitignore += `\n${rule}`;
        modified = true;
      }
    });

    if (modified) {
      if (!opts?.dryRun) {
        fs.writeFileSync(GITIGNORE_PATH, gitignore.trim() + '\n', 'utf8');
      }
      return {
        changed: true,
        file: '.gitignore',
        commitMessage: 'chore(security): harden gitignore against sensitive token and scratch leaks'
      };
    }

    return { changed: false, message: 'Gitignore security rules are comprehensive and up to date.' };
  }
};
