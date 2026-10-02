/**
 * Retro AI - Retrieval-Augmented Generation (RAG) Product Search System
 * Client-Side Controller & UI Manager
 */

(function () {
  'use strict';

  // Client-side fallback catalog for static offline/preview usage
  const CLIENT_CATALOG = [
    {
      id: "prod-1",
      title: "Vintage Gramophone",
      category: "Audio & Music",
      era: "1920s",
      price: "$299.99",
      price_num: 299.99,
      rating: 4.9,
      image: "image/gramophone.png",
      tag: "Best Seller",
      description: "Handcrafted vintage gramophone with embossed brass horn and solid mahogany base. Plays 78 RPM shellac records with rich, warm analog resonance.",
      use_cases: ["living room acoustic listening", "warm jazz playback", "vintage vinyl records"],
      keywords: ["gramophone", "phonograph", "vinyl", "record", "music", "brass", "horn", "audio", "analog", "acoustic", "jazz", "warm sound"]
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
      description: "Mid-century wooden cabinet AM/FM transistor radio featuring tactile analog rotary tuning dials and warm acoustic speaker warmth.",
      use_cases: ["morning broadcasts", "lo-fi radio warmth", "bedside music"],
      keywords: ["radio", "transistor", "am fm", "tuner", "analog dial", "wooden", "broadcast", "audio", "lo-fi", "warm sound"]
    },
    {
      id: "prod-4",
      title: "Antique Leather Camera",
      category: "Photography",
      era: "1950s",
      price: "$380.00",
      price_num: 380.00,
      rating: 4.9,
      image: "image/camera.png",
      tag: "Limited Edition",
      description: "Collector-grade 35mm rangefinder camera wrapped in genuine aged leather with brushed chrome fixtures and coated f/2.0 prime lens.",
      use_cases: ["street photography", "film travel journal", "analog 35mm portraits"],
      keywords: ["camera", "photography", "film", "35mm", "leather", "lens", "shutter", "analog", "rangefinder", "photos"]
    },
    {
      id: "prod-3",
      title: "Retro Mechanical Typewriter",
      category: "Writing & Office",
      era: "1940s",
      price: "$220.00",
      price_num: 220.00,
      rating: 5.0,
      image: "image/typewriter.png",
      tag: "Featured",
      description: "Heavy-duty cast steel mechanical typewriter in matte black with chrome round keycaps and carriage return bell chime.",
      use_cases: ["creative writing", "author desk display", "poetry & letters", "tactile journaling"],
      keywords: ["typewriter", "writing", "author", "writer", "mechanical", "keys", "letters", "gift for writer", "novel"]
    },
    {
      id: "2.04",
      title: "Portable Type Writer",
      category: "Writing & Office",
      era: "1960s",
      price: "$5.10",
      price_num: 5.10,
      rating: 4.8,
      image: "https://i.pinimg.com/564x/51/1b/f5/511bf5dad07f6e029f6d67e74d12fe88.jpg",
      tag: "Writer Favorite",
      description: "Streamlined portable travel typewriter in a metal carry case with smooth mechanical key travel and crisp typeface impressions.",
      use_cases: ["travel writing", "coffee shop journaling", "retro office desk"],
      keywords: ["typewriter", "typing", "portable", "travel", "writing", "keys", "author", "journal"]
    },
    {
      id: "prod-2",
      title: "Classic Rotary Phone",
      category: "Telephony & Comms",
      era: "1960s",
      price: "$149.50",
      price_num: 149.50,
      rating: 4.8,
      image: "image/telephone.png",
      tag: "Popular",
      description: "Authentic heavy bakelite rotary dial desk telephone with mechanical dual brass bells and fabric-wrapped handset cord.",
      use_cases: ["entryway decorative showpiece", "classic office phone", "tactile dialing experience"],
      keywords: ["telephone", "phone", "rotary", "dial", "bell", "telephony", "bakelite", "desk phone"]
    },
    {
      id: "2.02",
      title: "Retro Numeric Pager",
      category: "Telephony & Comms",
      era: "1990s",
      price: "$5.10",
      price_num: 5.10,
      rating: 4.6,
      image: "https://i.pinimg.com/564x/22/dd/23/22dd2351b747065963a5ba85006d9348.jpg",
      tag: "90s Nostalgia",
      description: "Iconic translucent neon 90s hip-clip beeper pager with monochrome LCD display and tactile buzzer vibration.",
      use_cases: ["90s streetwear accessory", "retro tech collection", "nostalgic gift"],
      keywords: ["pager", "beeper", "90s", "y2k", "telephony", "gadget", "cyber", "streetwear"]
    },
    {
      id: "1.04",
      title: "Movie Screen Carpet",
      category: "Decor & Collectibles",
      era: "1960s",
      price: "$10.20",
      price_num: 10.20,
      rating: 4.9,
      image: "https://i.pinimg.com/564x/1f/58/7f/1f587fe05370d0d84379ba5791c107fb.jpg",
      tag: "Art Deco Accent",
      description: "Lush runner carpet featuring geometric Art Deco cinema patterns inspired by historic 1960s Hollywood movie palace lobbies.",
      use_cases: ["home cinema room", "hallway runner", "cozy listening room decor"],
      keywords: ["carpet", "rug", "movie", "cinema", "decor", "home", "art deco"]
    }
  ];

  // Build and inject Modal HTML
  function injectModal() {
    if (document.getElementById('ragSearchModal')) return;

    const modalHTML = `
      <div id="ragSearchModal" class="rag-modal-overlay" aria-hidden="true" role="dialog">
        <div class="rag-modal-container">
          
          <!-- Header -->
          <div class="rag-modal-header">
            <div class="rag-brand-badge">
              <div class="rag-icon-seal"><i class="fa-solid fa-compass"></i></div>
              <div class="rag-title-group">
                <h2>Retro AI Curator <span class="rag-pill">RAG Engine</span></h2>
                <p>Natural Language Product Search & Vintage Recommendations</p>
              </div>
            </div>
            <button id="ragCloseBtn" class="rag-close-btn" aria-label="Close Search">&times;</button>
          </div>

          <!-- Search Input & Prompt Chips -->
          <div class="rag-search-section">
            <div class="rag-input-wrapper">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                id="ragSearchInput" 
                class="rag-search-input" 
                placeholder="Describe what you want (e.g., 'warm sound system for jazz records' or 'gift for a retro writer')..."
                autocomplete="off"
              />
              <button id="ragSubmitBtn" class="rag-submit-btn">
                <span>Find</span> <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div class="rag-prompt-chips">
              <span class="rag-chips-label"><i class="fa-solid fa-wand-magic-sparkles"></i> Try:</span>
              <button class="rag-chip" data-query="warm vinyl sound for jazz evenings">Warm Vinyl Sound</button>
              <button class="rag-chip" data-query="gift for an author who loves mechanical typewriters">Writer's Mechanical Typewriter</button>
              <button class="rag-chip" data-query="1950s analog camera for street photography">1950s Street Camera</button>
              <button class="rag-chip" data-query="classic rotary desk phone for vintage study">Classic Rotary Phone</button>
              <button class="rag-chip" data-query="90s nostalgic gadget with buttons">90s Retro Gadget</button>
            </div>
          </div>

          <!-- Body / Results View -->
          <div class="rag-modal-body" id="ragModalBody">
            <!-- Initial Empty State -->
            <div id="ragEmptyState" class="rag-empty-state">
              <div class="rag-empty-icon"><i class="fa-solid fa-feather-pointed"></i></div>
              <h3>Ask our AI Vintage Curator in Plain English</h3>
              <p>Our Retrieval-Augmented Generation system understands eras, acoustics, writing aesthetics, and vintage vibes to find and recommend the perfect retro treasures.</p>
            </div>

            <!-- Loading Spinner -->
            <div id="ragLoadingState" class="rag-loading-state">
              <div class="rag-spinner"></div>
              <div class="rag-loading-text">Consulting the Vintage Archives...</div>
              <div class="rag-loading-subtext" id="ragLoadingStep">Embedding natural language query & matching historical artifacts...</div>
            </div>

            <!-- Dynamic Results Container -->
            <div id="ragResultsArea" style="display: none;"></div>
          </div>

        </div>
      </div>

      <!-- Toast Notification -->
      <div id="ragToast" class="rag-toast">
        <i class="fa-solid fa-circle-check"></i>
        <span id="ragToastMsg">Added to your cart!</span>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupEvents();
  }

  // Event Listeners setup
  function setupEvents() {
    const modal = document.getElementById('ragSearchModal');
    const closeBtn = document.getElementById('ragCloseBtn');
    const input = document.getElementById('ragSearchInput');
    const submitBtn = document.getElementById('ragSubmitBtn');

    // Open triggers
    document.querySelectorAll('.rag-nav-trigger, [data-rag-trigger]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    // Close triggers
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
      // Ctrl+K or / to open
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName))) {
        e.preventDefault();
        openModal();
      }
    });

    // Submit actions
    submitBtn.addEventListener('click', () => {
      const q = input.value.trim();
      if (q) performSearch(q);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) performSearch(q);
      }
    });

    // Quick prompt chips
    document.querySelectorAll('.rag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        input.value = query;
        performSearch(query);
      });
    });
  }

  function openModal() {
    const modal = document.getElementById('ragSearchModal');
    const input = document.getElementById('ragSearchInput');
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 150);
  }

  function closeModal() {
    const modal = document.getElementById('ragSearchModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Perform RAG Search (API with Client Fallback)
  async function performSearch(query) {
    const emptyState = document.getElementById('ragEmptyState');
    const loadingState = document.getElementById('ragLoadingState');
    const resultsArea = document.getElementById('ragResultsArea');
    const loadingStep = document.getElementById('ragLoadingStep');

    emptyState.style.display = 'none';
    resultsArea.style.display = 'none';
    loadingState.classList.add('active');

    // Fun simulated loading steps for immersive UX
    const steps = [
      "Analyzing natural language query intent & historical era...",
      "Executing hybrid semantic vector retrieval across catalog...",
      "Augmenting context & synthesizing curator recommendation notes..."
    ];
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      if (loadingStep) loadingStep.textContent = steps[stepIdx];
    }, 450);

    let result = null;

    try {
      // 1. Try local API endpoints
      const endpoints = ['/api/search/rag', '/api/rag-search'];
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            result = await res.json();
            break;
          }
        } catch (err) {
          // continue to next endpoint
        }
      }
    } catch (apiErr) {
      console.warn('[RAG] API fetch error, using client engine fallback:', apiErr);
    }

    clearInterval(stepInterval);

    // 2. Client-side fallback if server API is unavailable
    if (!result || !result.recommendations) {
      result = clientFallbackSearch(query);
    }

    loadingState.classList.remove('active');
    renderResults(result);
  }

  // Pure Client Fallback Hybrid Retrieval + Generation
  function clientFallbackSearch(query) {
    const qLower = query.toLowerCase();
    const tokens = qLower.match(/\b[a-z0-9]{3,}\b/g) || [];

    const scored = CLIENT_CATALOG.map(item => {
      let score = 0;
      const titleTokens = item.title.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
      const keywords = (item.keywords || []).map(k => k.toLowerCase());
      const desc = item.description.toLowerCase();

      tokens.forEach(t => {
        if (titleTokens.includes(t)) score += 0.40;
        else if (keywords.some(k => k.includes(t))) score += 0.25;
        else if (desc.includes(t)) score += 0.12;
      });

      if (qLower.includes(item.category.toLowerCase().split(' ')[0])) score += 0.25;
      if (item.era && qLower.includes(item.era.toLowerCase().slice(0, 4))) score += 0.20;

      const finalScore = Math.min(1.0, score);
      const relevancePercentage = Math.min(99, Math.max(55, Math.round(55 + finalScore * 44)));

      return {
        ...item,
        match_score: finalScore,
        relevance_percentage: relevancePercentage,
        match_reason: `Authentic ${item.era} design (${item.tag}). Perfect for ${item.use_cases[0]} with verified 5-star collector rating.`
      };
    });

    scored.sort((a, b) => b.match_score - a.match_score);
    const topItems = scored.slice(0, 4);

    return {
      success: true,
      query,
      retrieved_count: topItems.length,
      curator_response: {
        summary: `For your query "${query}", we hand-selected authentic artifacts from our vintage vaults, leading with the **${topItems[0].title}** for its uncompromised historical character.`,
        styling_tip: "Highlight this vintage artifact under warm incandescent lighting on a solid wood shelf or study desk."
      },
      recommendations: topItems,
      related_queries: [
        "warm vinyl record player for jazz evenings",
        "mechanical typewriter for writer gift",
        "vintage 1950s analog camera"
      ]
    };
  }

  // Render RAG Output to DOM
  function renderResults(data) {
    const resultsArea = document.getElementById('ragResultsArea');
    if (!resultsArea) return;

    const { query, curator_response, recommendations, related_queries } = data;

    let cardsHTML = '';
    recommendations.forEach(prod => {
      cardsHTML += `
        <div class="rag-product-card" data-product-id="${prod.id}">
          <div class="rag-card-image-wrap">
            <img src="${prod.image}" alt="${prod.title}" class="rag-card-img" onerror="this.src='image/camera.png'" />
            <span class="rag-score-badge">${prod.relevance_percentage}% Match</span>
            <span class="rag-era-badge">${prod.era || 'Vintage'}</span>
          </div>
          <div class="rag-card-content">
            <span class="rag-card-category">${prod.category}</span>
            <h5 class="rag-card-title">${prod.title}</h5>
            <div class="rag-card-meta">
              <span class="rag-card-price">${prod.price}</span>
              <span class="rag-card-rating"><i class="fa-solid fa-star"></i> ${prod.rating || 4.9}</span>
            </div>
            <div class="rag-match-reason">
              <strong><i class="fa-solid fa-wand-magic-sparkles"></i> Why this matches:</strong>
              ${prod.match_reason}
            </div>
            <div class="rag-card-actions">
              <button 
                class="rag-add-cart-btn" 
                data-id="${prod.id}" 
                data-name="${prod.title}" 
                data-price="${prod.price_num || parseFloat(String(prod.price).replace(/[^0-9.]/g, '')) || 10.20}"
              >
                <i class="fa-solid fa-cart-shopping"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    });

    let relatedHTML = '';
    if (related_queries && related_queries.length > 0) {
      relatedHTML = `
        <div class="rag-related-bar">
          <span class="rag-related-label"><i class="fa-solid fa-compass"></i> Explore Related:</span>
          ${related_queries.map(rq => `<button class="rag-related-chip" data-rq="${rq}">${rq}</button>`).join('')}
        </div>
      `;
    }

    resultsArea.innerHTML = `
      <!-- Curator Synthesis Box -->
      <div class="rag-curator-box">
        <div class="rag-curator-header">
          <i class="fa-solid fa-quote-left"></i> Vintage Curator's Recommendation
        </div>
        <div class="rag-curator-summary">${curator_response.summary}</div>
        <div class="rag-curator-tip">
          <i class="fa-solid fa-lightbulb"></i>
          <span><strong>Styling & Pairing Tip:</strong> ${curator_response.styling_tip}</span>
        </div>
      </div>

      <!-- Results Heading -->
      <div class="rag-results-heading">
        <h4><i class="fa-solid fa-box-archive"></i> Recommended Vintage Artifacts</h4>
        <span class="rag-results-count">${recommendations.length} items curated for "${query}"</span>
      </div>

      <!-- Grid -->
      <div class="rag-products-grid">
        ${cardsHTML}
      </div>

      <!-- Related Queries -->
      ${relatedHTML}
    `;

    resultsArea.style.display = 'block';

    // Hook up Add to Cart buttons
    resultsArea.querySelectorAll('.rag-add-cart-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));

        addToRetroCart(id, name, price);

        // Visual feedback
        const origHTML = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
        this.classList.add('added');
        showToast(`Added "${name}" to your cart!`);

        setTimeout(() => {
          this.innerHTML = origHTML;
          this.classList.remove('added');
        }, 2200);
      });
    });

    // Hook up Related Query chips
    resultsArea.querySelectorAll('.rag-related-chip').forEach(chip => {
      chip.addEventListener('click', function () {
        const rq = this.getAttribute('data-rq');
        const input = document.getElementById('ragSearchInput');
        if (input) input.value = rq;
        performSearch(rq);
      });
    });
  }

  // Sync with Retro's cart localStorage
  function addToRetroCart(id, name, price) {
    try {
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existing = cartItems.find(item => item.id === id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cartItems.push({
          id: id,
          name: name,
          price: price,
          quantity: 1
        });
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // Update badge count if present
      const badge = document.getElementById('badgeCount');
      if (badge) {
        const total = cartItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
        badge.textContent = total > 0 ? total : '';
      }
    } catch (e) {
      console.error('[RAG Cart Error]:', e);
    }
  }

  // Toast helper
  function showToast(msg) {
    const toast = document.getElementById('ragToast');
    const toastMsg = document.getElementById('ragToastMsg');
    if (!toast) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectModal);
  } else {
    injectModal();
  }

  // Expose global controller
  window.RetroRAG = {
    open: openModal,
    close: closeModal,
    search: performSearch
  };
})();
