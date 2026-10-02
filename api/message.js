module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    message: 'Welcome to Retro! Step into timeless vintage elegance.',
    status: 'active',
    timestamp: new Date().toISOString()
  });
};
