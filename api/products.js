module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const products = [
    { id: "prod-1", title: "Vintage Gramophone", category: "Audio", price: "$299.99", rating: 4.9, image: "image/gramophone.png", tag: "Best Seller" },
    { id: "prod-2", title: "Classic Rotary Phone", category: "Telephony", price: "$149.50", rating: 4.8, image: "image/telephone.png", tag: "Popular" },
    { id: "prod-3", title: "Retro Mechanical Typewriter", category: "Office", price: "$220.00", rating: 5.0, image: "image/typewriter.png", tag: "Featured" },
    { id: "prod-4", title: "Antique Leather Camera", category: "Photography", price: "$380.00", rating: 4.9, image: "image/camera.png", tag: "Limited Edition" }
  ];
  res.status(200).json({ success: true, count: products.length, products });
};
