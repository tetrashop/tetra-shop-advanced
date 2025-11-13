const express = require('express');
const app = express();

app.use(express.json());

// روت ساده برای تست
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'سرور تترا شاپ فعال است',
        version: '2.1.0'
    });
});

// API وضعیت
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        status: 'active',
        services: ['تبدیل 2D به 3D', 'پردازش OCR']
    });
});

module.exports = app;
