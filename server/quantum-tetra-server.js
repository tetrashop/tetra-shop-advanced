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

// ایمپورت مبدل 3D
const converter3D = require('./quantum-3d-converter');
app.use('/api/quantum/2d-to-3d-convert', converter3D);

// روت اصلی - رابط کاربری تبدیل 3D
app.get('/converter', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/converter-ui.html'));
});

// روت اصلی - پنل مدیریت
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// API‌های موجود
app.get('/api/object-line/status', (req, res) => {
    res.json({
        success: true,
        message: 'سرور تترا شاپ فعال است',
        data: {
            server: "objects-line.tetra.cloud",
            status: "active",
            version: "2.0.0",
            services: [
                "تبدیل 2D به 3D کوانتومی",
                "پردازش OCR پیشرفته", 
                "نویسنده هوشمند",
                "محاسبات ابری"
            ]
        }
    });
});

// راه‌اندازی سرور
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 سرور تترا شاپ با سیستم تبدیل 3D راه‌اندازی شد!');
    console.log('🌐 آدرس رابط تبدیل 3D: http://localhost:' + PORT + '/converter');
    console.log('📊 آدرس پنل مدیریت: http://localhost:' + PORT);
});

module.exports = app;
