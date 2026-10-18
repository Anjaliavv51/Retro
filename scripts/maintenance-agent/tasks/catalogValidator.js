const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const CATALOG_PATH = path.join(ROOT_DIR, 'python', 'vintage_products.json');

module.exports = {
  name: 'Vintage Catalog Integrity & Quality Audit',
  category: 'Data Quality & Catalog',
  description: 'Validates and normalizes vintage product attributes, price numbers, and search keywords.',

  async run(opts = {}) {
    if (!fs.existsSync(CATALOG_PATH)) {
      return { changed: false, message: 'vintage_products.json not found.' };
    }

    const raw = fs.readFileSync(CATALOG_PATH, 'utf8');
    const products = JSON.parse(raw);
    let modified = false;

    products.forEach(p => {
      // 1. Ensure price_num matches parsed price string
      if (p.price && (!p.price_num || isNaN(p.price_num))) {
        const num = parseFloat(p.price.replace(/[^0-9.]/g, ''));
        if (!isNaN(num)) {
          p.price_num = num;
          modified = true;
        }
      }

      // 2. Ensure stock exists
      if (p.stock === undefined) {
        p.stock = 10;
        modified = true;
      }

      // 3. Ensure keywords array is lowercased and deduplicated
      if (Array.isArray(p.keywords)) {
        const originalLen = p.keywords.length;
        const cleaned = Array.from(new Set(p.keywords.map(k => String(k).toLowerCase().trim()).filter(Boolean)));
        if (cleaned.length !== originalLen) {
          p.keywords = cleaned;
          modified = true;
        }
      }
    });

    if (modified) {
      if (!opts?.dryRun) {
        fs.writeFileSync(CATALOG_PATH, JSON.stringify(products, null, 2) + '\n', 'utf8');
      }
      return {
        changed: true,
        file: 'python/vintage_products.json',
        commitMessage: 'fix(catalog): normalize product numeric pricing and deduplicate keywords'
      };
    }

    return { changed: false, message: 'Vintage catalog data integrity is verified and optimal.' };
  }
};
