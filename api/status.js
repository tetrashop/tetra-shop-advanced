module.exports = (req, res) => {
  res.json({
    success: true,
    status: 'active',
    service: 'تترا شاپ',
    version: '4.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production'
  });
};
