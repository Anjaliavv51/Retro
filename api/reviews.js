module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sampleReviews = [
    { id: 1, name: "Sophia Turner", rating: 5, comment: "The vintage camera collection is absolutely stunning. Received mine in pristine condition!", date: "2024-03-15" },
    { id: 2, name: "Liam Henderson", rating: 5, comment: "Nostalgic vibes, excellent customer support, and fast delivery. Retro is truly unmatched.", date: "2024-03-20" },
    { id: 3, name: "Emma Watson", rating: 4, comment: "Loved the vinyl record player. High quality craftsmanship and timeless design.", date: "2024-03-28" }
  ];

  if (req.method === 'POST') {
    const { name, rating, comment } = req.body || {};
    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your review is now live.',
      review: { id: Date.now(), name, rating: Number(rating) || 5, comment, date: new Date().toISOString().split('T')[0] }
    });
  }

  return res.status(200).json({ success: true, total: sampleReviews.length, reviews: sampleReviews });
};
