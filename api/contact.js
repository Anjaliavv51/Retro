module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required fields.'
    });
  }

  return res.status(200).json({
    success: true,
    message: `Thank you ${name}, your inquiry has been received! Our vintage specialists will reach out soon.`,
    ticketId: `REQ-${Date.now()}`
  });
};
