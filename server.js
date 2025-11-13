const express = require('express');
const app = express();

app.use(express.json());

// روت اصلی
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 سرور تترا شاپ فعال است (نسخه توسعه)',
    version: '4.0.0',
    timestamp: new Date().toLocaleString('fa-IR')
  });
});

// API سلامت
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'سرور فعال است',
    timestamp: new Date().toISOString()
  });
});

// API وضعیت
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'active',
    version: '4.0.0'
  });
});

// API تبدیل 3D
app.post('/api/convert-3d', (req, res) => {
  try {
    const result = {
      success: true,
      message: 'تبدیل موفق',
      data: {
        modelId: 'model_' + Date.now(),
        processingTime: '۰.۵ ثانیه'
      }
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 سرور توسعه در پورت ${PORT} اجرا شد`);
});

module.exports = app;
