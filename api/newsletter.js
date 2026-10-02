module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { email } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Welcome to the Retro Club! You have successfully subscribed for an exclusive 30% vintage discount.'
  });
};
