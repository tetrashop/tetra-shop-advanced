const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// سرو فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '../client')));

// روت اصلی - رابط کاربری
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// API‌های موجود (همان کد قبلی)
app.get('/api/object-line/status', (req, res) => {
    console.log('🔍 درخواست وضعیت سرور');
    res.json({
        success: true,
        message: 'سرور تترا شاپ فعال است',
        data: {
            server: "objects-line.tetra.cloud",
            status: "active",
            version: "2.0.0",
            uptime: "99.8%",
            services: [
                "تبدیل 2D به 3D کوانتومی",
                "پردازش OCR پیشرفته", 
                "نویسنده هوشمند",
                "محاسبات ابری"
            ]
        },
        timestamp: new Date().toLocaleString('fa-IR')
    });
});

app.post('/api/quantum/2d-to-3d', (req, res) => {
    console.log('🔮 درخواست تبدیل 2D به 3D');
    const { test, image, points, config } = req.body;
    
    res.json({
        success: true,
        message: 'تبدیل کوانتومی با موفقیت انجام شد',
        data: {
            conversionId: 'conv_' + Math.random().toString(36).substr(2, 9),
            inputPoints: points || 100,
            outputPoints: 500,
            processingTime: '۲۳ms',
            polar3D: Array.from({length: 5}, (_, i) => ({
                id: i + 1,
                r: (Math.random() * 10).toFixed(3),
                θ: (Math.random() * Math.PI * 2).toFixed(3),
                φ: (Math.random() * Math.PI).toFixed(3)
            }))
        },
        timestamp: new Date().toLocaleString('fa-IR')
    });
});

// سایر API‌ها...

// راه‌اندازی سرور
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 سرور تترا شاپ با رابط کاربری پیشرفته راه‌اندازی شد!');
    console.log('🌐 آدرس دسترسی: http://localhost:' + PORT);
});

module.exports = app;
