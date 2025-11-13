const express = require('express');
const app = express();

// Middleware پایه
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// روت اصلی - تست سلامت
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 سرور تترا شاپ فعال است',
        version: '3.0.0',
        timestamp: new Date().toISOString()
    });
});

// API ساده برای تست
app.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        services: ['تبدیل 3D', 'پردازش تصویر'],
        uptime: '100%'
    });
});

// API تبدیل 3D ساده‌شده
app.post('/api/convert-3d', (req, res) => {
    try {
        res.json({
            success: true,
            message: 'تبدیل با موفقیت انجام شد',
            data: {
                modelId: 'model_' + Date.now(),
                format: 'obj',
                downloadUrl: '/api/download/sample.obj'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API دانلود
app.get('/api/download/:file', (req, res) => {
    res.json({
        success: true,
        message: 'فایل آماده دانلود است',
        filename: req.params.file
    });
});

// هندل کردن خطاها
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'خطای سرور' 
    });
});

// هندل کردن همه مسیرها
app.all('*', (req, res) => {
    res.json({
        success: true,
        message: 'سرور تترا شاپ',
        path: req.path
    });
});

// Export ساده برای Vercel
module.exports = app;
