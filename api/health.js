module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'online',
    platform: 'Vercel Serverless',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
};
