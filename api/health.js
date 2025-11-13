module.exports = (req, res) => {
  res.json({
    status: 'healthy',
    message: 'سرور تترا شاپ فعال است',
    timestamp: new Date().toISOString(),
    version: '4.0.0'
  });
};
