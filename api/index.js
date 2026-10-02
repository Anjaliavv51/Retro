const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory store for dynamic data (persists across warm serverless invocations)
let dynamicReviews = [
  {
    id: 1,
    name: "Sophia Turner",
    rating: 5,
    comment: "The vintage camera collection is absolutely stunning. Received mine in pristine condition!",
    date: "2024-03-15"
  },
  {
    id: 2,
    name: "Liam Henderson",
    rating: 5,
    comment: "Nostalgic vibes, excellent customer support, and fast delivery. Retro is truly unmatched.",
    date: "2024-03-20"
  },
  {
    id: 3,
    name: "Emma Watson",
    rating: 4,
    comment: "Loved the vinyl record player. High quality craftsmanship and timeless design.",
    date: "2024-03-28"
  }
];

let contactSubmissions = [];
let newsletterSubscribers = [];

// Dynamic API Endpoints

// 1. Health & Status
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'Vercel Serverless',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});

// 2. Server Message (used by frontend / dynamic banner)
app.get('/api/message', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Retro! Step into timeless vintage elegance.',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// 3. Dynamic Products / Collections API
app.get('/api/products', (req, res) => {
  const products = [
    {
      id: "prod-1",
      title: "Vintage Gramophone",
      category: "Audio",
      price: "$299.99",
      rating: 4.9,
      image: "image/gramophone.png",
      tag: "Best Seller"
    },
    {
      id: "prod-2",
      title: "Classic Rotary Phone",
      category: "Telephony",
      price: "$149.50",
      rating: 4.8,
      image: "image/telephone.png",
      tag: "Popular"
    },
    {
      id: "prod-3",
      title: "Retro Mechanical Typewriter",
      category: "Office",
      price: "$220.00",
      rating: 5.0,
      image: "image/typewriter.png",
      tag: "Featured"
    },
    {
      id: "prod-4",
      title: "Antique Leather Camera",
      category: "Photography",
      price: "$380.00",
      rating: 4.9,
      image: "image/camera.png",
      tag: "Limited Edition"
    }
  ];
  res.status(200).json({ success: true, count: products.length, products });
});

// 4. Contact Form Submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required fields.'
    });
  }

  const submission = {
    id: `REQ-${Date.now()}`,
    name,
    email,
    phone: phone || 'N/A',
    message: message || '',
    submittedAt: new Date().toISOString()
  };

  contactSubmissions.push(submission);

  return res.status(200).json({
    success: true,
    message: `Thank you ${name}, your inquiry has been received! Our vintage specialists will reach out soon.`,
    ticketId: submission.id
  });
});

// 5. Newsletter Subscription
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }

  if (!newsletterSubscribers.includes(email.toLowerCase())) {
    newsletterSubscribers.push(email.toLowerCase());
  }

  return res.status(200).json({
    success: true,
    message: 'Welcome to the Retro Club! You have successfully subscribed to exclusive vintage drops.'
  });
});

// 6. Dynamic Reviews (GET & POST)
app.get('/api/reviews', (req, res) => {
  res.status(200).json({
    success: true,
    total: dynamicReviews.length,
    reviews: dynamicReviews
  });
});

app.post('/api/reviews', (req, res) => {
  const { name, rating, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).json({
      success: false,
      error: 'Name and comment are required to leave a review.'
    });
  }

  const newReview = {
    id: dynamicReviews.length + 1,
    name,
    rating: Number(rating) || 5,
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  dynamicReviews.unshift(newReview);

  return res.status(201).json({
    success: true,
    message: 'Thank you for your feedback! Your review is now live.',
    review: newReview
  });
});

// 7. Retrieval-Augmented Generation (RAG) Product Search API
const { searchRAG } = require('./ragSearchEngine.cjs');

async function handleRagRequest(req, res) {
  try {
    const query = req.method === 'GET'
      ? (req.query.q || req.query.query || '')
      : (req.body.q || req.body.query || '');

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required. Provide ?q=... or JSON { query: "..." }'
      });
    }

    const topK = parseInt(req.method === 'GET' ? req.query.limit : req.body.limit, 10) || 4;
    const result = await searchRAG(query.trim(), topK);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[RAG API Index Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'RAG search failed: ' + err.message
    });
  }
}

app.get('/api/search/rag', handleRagRequest);
app.post('/api/search/rag', handleRagRequest);
app.get('/api/rag-search', handleRagRequest);
app.post('/api/rag-search', handleRagRequest);

// Fallback for unmatched API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    requestedUrl: req.originalUrl
  });
});

module.exports = app;
