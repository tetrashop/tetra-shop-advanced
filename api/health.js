export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    message: 'سرور تترا شاپ فعال است',
    timestamp: new Date().toISOString(),
    version: '4.1.0'
  });
}
