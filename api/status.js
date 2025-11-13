export default function handler(req, res) {
  res.status(200).json({
    success: true,
    status: 'active', 
    service: 'تترا شاپ',
    version: '4.1.0',
    environment: process.env.NODE_ENV || 'production'
  });
}
