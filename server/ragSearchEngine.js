/**
 * RAG (Retrieval-Augmented Generation) Search Engine for Retro (Server ESM).
 * Provides hybrid semantic retrieval, context augmentation, and generative curation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load product catalog
let catalog = [];
try {
  const catalogPath = path.join(__dirname, '../python/vintage_products.json');
  if (fs.existsSync(catalogPath)) {
    catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  }
} catch (err) {
  console.warn('[RAG] Warning loading vintage_products.json:', err.message);
}

// Fallback catalog if file not readable
if (!catalog || catalog.length === 0) {
  catalog = [
    {
      id: "prod-1",
      title: "Vintage Gramophone",
      category: "Audio & Music",
      era: "1920s",
      price: "$299.99",
      rating: 4.9,
      image: "image/gramophone.png",
      tag: "Best Seller",
      description: "Handcrafted vintage gramophone with embossed brass horn and solid mahogany base. Plays 78 RPM shellac records with rich, warm analog resonance.",
      use_cases: ["living room acoustic listening", "warm jazz playback", "vintage vinyl records"],
      keywords: ["gramophone", "phonograph", "vinyl", "record", "music", "brass", "horn", "audio", "analog", "acoustic", "jazz", "warm sound"]
    },
    {
      id: "prod-2",
      title: "Classic Rotary Phone",
      category: "Telephony & Comms",
      era: "1960s",
      price: "$149.50",
      rating: 4.8,
      image: "image/telephone.png",
      tag: "Popular",
      description: "Authentic heavy bakelite rotary dial desk telephone with mechanical dual brass bells and fabric-wrapped handset cord.",
      use_cases: ["entryway decorative showpiece", "classic office phone", "tactile dialing experience"],
      keywords: ["telephone", "phone", "rotary", "dial", "bell", "telephony", "bakelite", "desk phone"]
    },
    {
      id: "prod-3",
      title: "Retro Mechanical Typewriter",
      category: "Writing & Office",
      era: "1940s",
      price: "$220.00",
      rating: 5.0,
      image: "image/typewriter.png",
      tag: "Featured",
      description: "Heavy-duty cast steel mechanical typewriter in matte black with chrome round keycaps and carriage return bell chime.",
      use_cases: ["creative writing", "author desk display", "poetry & letters", "tactile journaling"],
      keywords: ["typewriter", "writing", "author", "writer", "mechanical", "keys", "letters", "gift for writer"]
    },
    {
      id: "prod-4",
      title: "Antique Leather Camera",
      category: "Photography",
      era: "1950s",
      price: "$380.00",
      rating: 4.9,
      image: "image/camera.png",
      tag: "Limited Edition",
      description: "Collector-grade 35mm rangefinder camera wrapped in genuine aged leather with brushed chrome fixtures and coated f/2.0 prime lens.",
      use_cases: ["street photography", "film travel journal", "analog 35mm portraits"],
      keywords: ["camera", "photography", "film", "35mm", "leather", "lens", "shutter", "analog", "rangefinder"]
    }
  ];
}

/**
 * Natural language intent extraction
 */
export function extractIntent(query) {
  const q = (query || '').toLowerCase();

  const eraMap = {
    '1910s': ['1910', '1910s', 'edison', 'cylinder', 'victorian'],
    '1920s': ['1920', '1920s', 'twenties', 'speakeasy', 'gramophone'],
    '1930s': ['1930', '1930s', 'art deco'],
    '1940s': ['1940', '1940s', 'noir', 'steel', 'wartime'],
    '1950s': ['1950', '1950s', 'fifties', 'mid-century', 'atomic'],
    '1960s': ['1960', '1960s', 'sixties', 'transistor', 'retro'],
    '1970s': ['1970', '1970s', 'seventies', 'analog', 'disco'],
    '1980s': ['1980', '1980s', 'eighties', 'cassette'],
    '1990s': ['1990', '1990s', 'nineties', 'pager', 'beeper', 'y2k']
  };

  let detectedEra = null;
  for (const [era, triggers] of Object.entries(eraMap)) {
    if (triggers.some(t => q.includes(t))) {
      detectedEra = era;
      break;
    }
  }

  const catMap = {
    'Audio & Music': ['sound', 'audio', 'music', 'vinyl', 'record', 'gramophone', 'radio', 'acoustic', 'jazz', 'song', 'phonograph', 'listen', 'speaker'],
    'Photography': ['photo', 'camera', 'film', 'lens', 'shutter', 'portrait', 'photography', 'pictures', 'snapshot'],
    'Writing & Office': ['write', 'writer', 'author', 'typewriter', 'typing', 'letters', 'poetry', 'journal', 'desk', 'stationery'],
    'Telephony & Comms': ['phone', 'telephone', 'rotary', 'dial', 'call', 'pager', 'beeper', 'communication'],
    'Entertainment & Screens': ['tv', 'television', 'screen', 'cinema', 'movie', 'broadcast'],
    'Decor & Collectibles': ['decor', 'carpet', 'rug', 'crossbow', 'sedan', 'home', 'display', 'toy', 'marbles']
  };

  let detectedCategory = null;
  for (const [cat, triggers] of Object.entries(catMap)) {
    if (triggers.some(t => q.includes(t))) {
      detectedCategory = cat;
      break;
    }
  }

  return {
    rawQuery: query,
    detectedEra,
    detectedCategory
  };
}

/**
 * Tokenize string into meaningful word tokens
 */
function tokenize(text) {
  return (text || '').toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
}

/**
 * Perform hybrid semantic + lexical retrieval in pure Node.js
 */
export function searchHybridNode(query, topK = 4) {
  const intent = extractIntent(query);
  const qTokens = tokenize(query);

  const scored = catalog.map(product => {
    let lexicalScore = 0;
    const titleTokens = tokenize(product.title);
    const kwTokens = (product.keywords || []).map(k => k.toLowerCase());
    const descTokens = tokenize(product.description);
    const categoryTokens = tokenize(product.category);

    for (const token of qTokens) {
      if (titleTokens.includes(token)) lexicalScore += 0.40;
      else if (kwTokens.some(k => k.includes(token))) lexicalScore += 0.25;
      else if (categoryTokens.includes(token)) lexicalScore += 0.20;
      else if (descTokens.includes(token)) lexicalScore += 0.10;
    }

    // Intent alignment boost
    let intentBoost = 0;
    if (intent.detectedCategory && product.category.toLowerCase().includes(intent.detectedCategory.toLowerCase())) {
      intentBoost += 0.25;
    }
    if (intent.detectedEra && product.era && product.era.includes(intent.detectedEra)) {
      intentBoost += 0.20;
    }

    // Quality prior
    const qualityPrior = ((product.rating || 4.5) - 4.0) * 0.1;

    const finalScore = Math.min(1.0, lexicalScore + intentBoost + qualityPrior);
    const relevancePercentage = Math.min(99, Math.max(52, Math.round(55 + finalScore * 44)));

    return {
      product,
      finalScore: Number(finalScore.toFixed(4)),
      relevancePercentage
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.finalScore - a.finalScore);
  const topMatches = scored.slice(0, topK);

  // Generate Curator Response
  const curation = generateCuratorResponse(query, topMatches, intent);

  const recommendations = topMatches.map(item => {
    const p = { ...item.product };
    p.match_score = item.finalScore;
    p.relevance_percentage = item.relevancePercentage;
    p.match_reason = curation.curatedReasons[p.id] || `Selected for authentic ${p.era || 'vintage'} heritage and design synergy.`;
    return p;
  });

  return {
    success: true,
    query,
    intent,
    retrieved_count: recommendations.length,
    curator_response: {
      summary: curation.summary,
      styling_tip: curation.stylingTip
    },
    recommendations,
    related_queries: generateRelatedQueries(intent)
  };
}

/**
 * Generative Synthesis
 */
function generateCuratorResponse(query, matches, intent) {
  if (!matches || matches.length === 0) {
    return {
      summary: `We scanned our vintage vault for "${query}", but couldn't find an exact match. Try exploring our analog audio, 35mm cameras, or mechanical typewriters!`,
      stylingTip: "Vintage pieces look best when paired with warm ambient lighting and natural wood accents.",
      curatedReasons: {}
    };
  }

  const top = matches[0].product;
  const era = intent.detectedEra || top.era || 'classic vintage';
  const qLower = query.toLowerCase();

  let summary = '';
  if (qLower.includes('gift')) {
    summary = `For an exceptional vintage gift matching "${query}", we handpicked ${matches.length} authentic treasures from the ${era}. The standout choice is the **${top.title}**, celebrated for its tactile craftsmanship and timeless appeal.`;
  } else if (['warm', 'sound', 'audio', 'vinyl', 'music', 'jazz'].some(w => qLower.includes(w))) {
    summary = `To immerse your space in warm acoustic nostalgia for "${query}", our vintage curator highlights sound pieces from the ${era}. The **${top.title}** delivers organic analog depth and quintessential period elegance.`;
  } else if (['write', 'writer', 'type', 'journal', 'letter'].some(w => qLower.includes(w))) {
    summary = `To inspire distraction-free creative flow for "${query}", we curated classic mechanical writing gear. The **${top.title}** offers satisfying key travel and the signature carriage return chime.`;
  } else {
    summary = `Our vintage archives matched ${matches.length} period-accurate artifacts for "${query}". Rooted in the ${era} era, the **${top.title}** delivers uncompromised authenticity, artisanal build quality, and nostalgic charm.`;
  }

  const curatedReasons = {};
  for (const m of matches) {
    const p = m.product;
    const useCase = (p.use_cases && p.use_cases[0]) || 'vintage decor';
    curatedReasons[p.id] = `Authentic ${p.era || 'vintage'} design (${p.tag || 'Special Pick'}). Ideal for ${useCase} with ${p.aesthetic || 'period charm'}. Rated ${p.rating || 4.8}/5 by collectors.`;
  }

  let stylingTip = "Display this piece as a dedicated focal point on a natural wooden credenza or bookshelf, complemented by warm incandescent illumination.";
  if (top.category === 'Audio & Music') {
    stylingTip = "Pair with low-wattage warm filament Edison bulbs and an open record crate for the ultimate cozy acoustic sanctuary.";
  } else if (top.category === 'Writing & Office') {
    stylingTip = "Complement your typewriter with heavy cotton stationery, a brass desk lamp, and a leather notebook for inspired writing sessions.";
  } else if (top.category === 'Photography') {
    stylingTip = "Keep your vintage camera in a distressed leather bag and test with high-grain black-and-white 35mm film in morning natural light.";
  }

  return {
    summary,
    stylingTip,
    curatedReasons
  };
}

/**
 * Related search suggestions
 */
function generateRelatedQueries(intent) {
  const cat = intent.detectedCategory;
  if (cat === 'Audio & Music') {
    return [
      "warm vinyl record player for jazz evenings",
      "1960s mid-century tube radio with analog dial",
      "handcrafted brass gramophone with acoustic horn"
    ];
  }
  if (cat === 'Photography') {
    return [
      "vintage 35mm leather rangefinder camera",
      "classic analog film camera for travel snapshots",
      "1950s street photography vintage gear"
    ];
  }
  if (cat === 'Writing & Office') {
    return [
      "distraction free mechanical typewriter for authors",
      "portable metal travel typewriter in carry case",
      "thoughtful gift for an old-school poet or novelist"
    ];
  }
  if (cat === 'Telephony & Comms') {
    return [
      "authentic heavy bakelite rotary desk phone",
      "antique candlestick telephone with separate earpiece",
      "retro 90s cyber beeper pager with clip"
    ];
  }
  return [
    "warm sound system for jazz records",
    "gift for a retro writer who loves mechanical feedback",
    "authentic 1950s analog camera for street photography"
  ];
}

/**
 * Execute search: Tries Python first for full TF-IDF vector math,
 * and falls back seamlessly to Node.js hybrid search.
 */
export function searchRAG(query, topK = 4) {
  return new Promise((resolve) => {
    const pythonScript = path.join(__dirname, '../python/rag_search.py');

    if (!fs.existsSync(pythonScript)) {
      return resolve(searchHybridNode(query, topK));
    }

    const pyProcess = spawn('python', [pythonScript, query, '--json'], {
      windowsHide: true,
      timeout: 4000
    });

    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    pyProcess.on('close', (code) => {
      if (code === 0 && stdoutData.trim()) {
        try {
          const parsed = JSON.parse(stdoutData.trim());
          return resolve(parsed);
        } catch (e) {
          console.warn('[RAG] Python JSON parse fallback:', e.message);
        }
      }
      // Fallback to pure Node.js search
      resolve(searchHybridNode(query, topK));
    });

    pyProcess.on('error', () => {
      // Python not available on system, use Node.js
      resolve(searchHybridNode(query, topK));
    });
  });
}
