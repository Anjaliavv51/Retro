/**
 * Retro Natural Language Database Query Agent - Frontend Client Controller
 */

(function () {
  'use strict';

  // Fallback catalog for pure offline browser execution if server is unreachable
  const CLIENT_SEED_PRODUCTS = [
    {
      id: "prod-1",
      title: "Vintage Gramophone",
      category: "Audio & Music",
      era: "1920s",
      price: "$299.99",
      price_num: 299.99,
      rating: 4.9,
      image: "../image/gramophone.png",
      tag: "Best Seller",
      description: "Handcrafted vintage gramophone with embossed brass horn and mahogany base. Plays 78 RPM shellac records.",
      stock: 5
    },
    {
      id: "1.02",
      title: "Vintage Transistor Radio",
      category: "Audio & Music",
      era: "1960s",
      price: "$10.20",
      price_num: 10.20,
      rating: 4.8,
      image: "https://i.pinimg.com/736x/11/c1/c5/11c1c5ba22a14271bef63012dcaa0631.jpg",
      tag: "Nostalgic Hit",
      description: "Mid-century wooden cabinet AM/FM transistor radio featuring tactile analog rotary tuning dials.",
      stock: 14
    },
    {
      id: "prod-4",
      title: "Antique Leather Camera",
      category: "Photography",
      era: "1950s",
      price: "$380.00",
      price_num: 380.00,
      rating: 4.9,
      image: "../image/camera.png",
      tag: "Limited Edition",
      description: "Collector-grade 35mm rangefinder camera wrapped in genuine aged saddle leather with prime f/2.0 lens.",
      stock: 3
    },
    {
      id: "prod-3",
      title: "Retro Mechanical Typewriter",
      category: "Writing & Office",
      era: "1940s",
      price: "$220.00",
      price_num: 220.00,
      rating: 5.0,
      image: "../image/typewriter.png",
      tag: "Featured",
      description: "Cast-iron desktop mechanical typewriter with glass keycaps and crisp mechanical bell action.",
      stock: 7
    },
    {
      id: "prod-2",
      title: "Classic Rotary Phone",
      category: "Telephony",
      era: "1950s",
      price: "$149.50",
      price_num: 149.50,
      rating: 4.8,
      image: "../image/telephone.png",
      tag: "Popular",
      description: "Heavy-duty bell-ringer rotary desk phone in polished Bakelite black finish.",
      stock: 10
    }
  ];

  // DOM Elements
  const inputEl = document.getElementById('dbQueryInput');
  const submitBtn = document.getElementById('dbSubmitBtn');
  const loaderEl = document.getElementById('dbLoader');
  const resultsContainer = document.getElementById('dbResultsContainer');
  const mqlCodeEl = document.getElementById('dbMqlCode');
  const narrativeEl = document.getElementById('dbNarrative');
  const recordCountBadge = document.getElementById('dbRecordCountBadge');
  const targetCollectionBadge = document.getElementById('dbTargetCollectionBadge');
  const recordsGridEl = document.getElementById('dbRecordsGrid');
  const tableViewWrapper = document.getElementById('dbTableViewWrapper');
  const copyCodeBtn = document.getElementById('dbCopyCodeBtn');
  const chips = document.querySelectorAll('.db-chip');

  // Stats Elements
  const statProducts = document.getElementById('statProducts');
  const statUsers = document.getElementById('statUsers');
  const statReviews = document.getElementById('statReviews');
  const statDbStatus = document.getElementById('statDbStatus');

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    fetchDbStats();
    setupEventListeners();
  });

  function setupEventListeners() {
    if (submitBtn) {
      submitBtn.addEventListener('click', () => triggerQuery(inputEl.value));
    }

    if (inputEl) {
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          triggerQuery(inputEl.value);
        }
      });
    }

    if (chips) {
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const queryText = chip.getAttribute('data-query') || chip.textContent.trim();
          if (inputEl) inputEl.value = queryText;
          triggerQuery(queryText);
        });
      });
    }

    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => {
        if (mqlCodeEl) {
          navigator.clipboard.writeText(mqlCodeEl.textContent);
          const orig = copyCodeBtn.innerHTML;
          copyCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(() => { copyCodeBtn.innerHTML = orig; }, 1800);
        }
      });
    }
  }

  // Fetch Database Statistics
  async function fetchDbStats() {
    const endpoints = ['/api/db-agent/stats', 'http://localhost:5000/api/db-agent/stats', 'http://localhost:3000/api/db-agent/stats'];
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep);
        if (res.ok) {
          const data = await res.json();
          if (statProducts) statProducts.textContent = data.counts.products;
          if (statUsers) statUsers.textContent = data.counts.users;
          if (statReviews) statReviews.textContent = data.counts.reviews;
          if (statDbStatus) {
            statDbStatus.textContent = data.status === 'online' ? 'MongoDB Online' : 'Local Cache Active';
            statDbStatus.style.color = data.status === 'online' ? '#81c784' : '#e5a95d';
          }
          return;
        }
      } catch (e) {}
    }
  }

  // Main Query Trigger
  async function triggerQuery(query) {
    if (!query || !query.trim()) return;

    if (loaderEl) loaderEl.classList.add('active');
    if (resultsContainer) resultsContainer.classList.remove('active');

    let agentResponse = null;

    // 1. Try Live Server Endpoints
    const endpoints = [
      `/api/db-agent/query?q=${encodeURIComponent(query)}`,
      `/api/db-agent?q=${encodeURIComponent(query)}`,
      `http://localhost:5000/api/db-agent/query?q=${encodeURIComponent(query)}`,
      `http://localhost:3000/api/db-agent/query?q=${encodeURIComponent(query)}`
    ];

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          agentResponse = await res.json();
          break;
        }
      } catch (err) {
        // continue trying next endpoint
      }
    }

    // 2. Client-side Fallback if servers are offline
    if (!agentResponse || !agentResponse.success) {
      console.warn('[DbAgent Frontend] Backend API not reached, executing client-side MQL simulation.');
      agentResponse = clientSimulateDbQuery(query);
    }

    if (loaderEl) loaderEl.classList.remove('active');
    renderAgentResults(agentResponse);
  }

  // Render Query Results
  function renderAgentResults(data) {
    if (!resultsContainer) return;

    // Generated MQL
    if (mqlCodeEl) {
      mqlCodeEl.textContent = data.generatedMQL || '// No query generated';
    }

    // Narrative Text
    if (narrativeEl) {
      // Basic markdown bold replacement for aesthetics
      const formatted = (data.narrative || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      narrativeEl.innerHTML = `<i class="fa-solid fa-sparkles text-warning me-2"></i> ${formatted}`;
    }

    // Metadata Badges
    if (recordCountBadge) recordCountBadge.textContent = `${data.count || 0} Records`;
    if (targetCollectionBadge) targetCollectionBadge.textContent = `Collection: ${data.targetCollection || 'products'}`;

    // Render Grid vs Table
    const results = data.results || [];
    const isProductGrid = data.targetCollection === 'products' && data.queryType !== 'aggregate' && data.queryType !== 'count';

    if (isProductGrid && recordsGridEl && tableViewWrapper) {
      recordsGridEl.style.display = 'grid';
      tableViewWrapper.style.display = 'none';
      recordsGridEl.innerHTML = '';

      if (results.length === 0) {
        recordsGridEl.innerHTML = '<p class="text-muted p-4">No matching vintage artifacts found.</p>';
      } else {
        results.forEach(prod => {
          const card = document.createElement('div');
          card.className = 'db-record-card';
          card.innerHTML = `
            <img src="${prod.image || '../image/gramophone.png'}" alt="${prod.title}" class="db-record-img" onerror="this.src='../image/gramophone.png'" />
            <h4 class="db-record-title">${prod.title}</h4>
            <div class="db-record-meta">
              <span>${prod.price || ('$' + prod.price_num)}</span>
              <span><i class="fa-solid fa-star text-warning"></i> ${prod.rating || 5.0}</span>
            </div>
            <div class="db-record-desc">${prod.description || 'Rare collectible preserved in mint historical condition.'}</div>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <span class="badge bg-secondary">${prod.category || 'Vintage'}</span>
              <span class="text-muted small">${prod.era || 'Historic'}</span>
            </div>
          `;
          recordsGridEl.appendChild(card);
        });
      }
    } else if (tableViewWrapper && recordsGridEl) {
      recordsGridEl.style.display = 'none';
      tableViewWrapper.style.display = 'block';

      if (results.length === 0) {
        tableViewWrapper.innerHTML = '<p class="text-muted p-4">No records found matching criteria.</p>';
      } else {
        // Build dynamic table
        const keys = Object.keys(results[0]).filter(k => k !== '__v' && k !== 'password');
        let tableHTML = `
          <div class="db-table-responsive">
            <table class="db-data-table">
              <thead>
                <tr>${keys.map(k => `<th>${formatHeader(k)}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${results.map(row => `
                  <tr>
                    ${keys.map(k => `<td>${formatCellValue(row[k])}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        tableViewWrapper.innerHTML = tableHTML;
      }
    }

    resultsContainer.classList.add('active');
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function formatHeader(key) {
    if (key === '_id') return 'ID / Category';
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  function formatCellValue(val) {
    if (val === null || val === undefined) return '<span class="text-muted">-</span>';
    if (typeof val === 'object') return JSON.stringify(val);
    if (typeof val === 'number') return val.toLocaleString();
    return String(val);
  }

  // Pure Client-Side Fallback Engine
  function clientSimulateDbQuery(query) {
    const qLower = query.toLowerCase();
    let target = 'products';
    if (/\b(user|users|account)\b/.test(qLower)) target = 'users';
    else if (/\b(review|reviews|feedback)\b/.test(qLower)) target = 'reviews';

    if (target === 'users') {
      return {
        success: true,
        naturalQuery: query,
        targetCollection: 'users',
        queryType: 'find',
        generatedMQL: 'db.users.find({}).project({ password: 0 }).limit(10)',
        count: 3,
        results: [
          { name: "Vintage Curator", email: "curator@retro-vintage.com", role: "curator", registered: "2024-01-10" },
          { name: "Audiophile Alice", email: "alice@analogvinyl.org", role: "customer", registered: "2024-02-15" },
          { name: "Marcus Aurelius", email: "marcus@antiques.net", role: "customer", registered: "2024-03-01" }
        ],
        narrative: "Retrieved **3** registered user records from **users** (passwords masked)."
      };
    }

    if (/\b(count|how many)\b/.test(qLower)) {
      return {
        success: true,
        naturalQuery: query,
        targetCollection: 'products',
        queryType: 'count',
        generatedMQL: 'db.products.countDocuments()',
        count: CLIENT_SEED_PRODUCTS.length,
        results: [{ count: CLIENT_SEED_PRODUCTS.length }],
        narrative: `Found **${CLIENT_SEED_PRODUCTS.length}** total items in the **products** catalog.`
      };
    }

    let filtered = [...CLIENT_SEED_PRODUCTS];
    if (/\b(audio|music)\b/.test(qLower)) {
      filtered = filtered.filter(p => p.category.includes('Audio'));
    } else if (/\b(camera|photo)\b/.test(qLower)) {
      filtered = filtered.filter(p => p.category.includes('Photo'));
    } else if (/\b(typewriter|writing)\b/.test(qLower)) {
      filtered = filtered.filter(p => p.category.includes('Writing'));
    }

    const underMatch = qLower.match(/under\s*\$?(\d+)/);
    if (underMatch) {
      const maxP = parseFloat(underMatch[1]);
      filtered = filtered.filter(p => p.price_num <= maxP);
    }

    return {
      success: true,
      naturalQuery: query,
      targetCollection: 'products',
      queryType: 'find',
      generatedMQL: `db.products.find({ "category": /${filtered[0] ? filtered[0].category : 'vintage'}/i }).limit(10)`,
      count: filtered.length,
      results: filtered,
      narrative: `Retrieved **${filtered.length}** products matching your criteria.`
    };
  }

})();
