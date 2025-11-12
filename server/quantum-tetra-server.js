const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// روت اصلی
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تترا شاپ - فعال</title>
        <style>
            body { 
                font-family: Tahoma; 
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white; 
                text-align: center; 
                padding: 50px;
            }
            .container {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 تترا شاپ فعال شد</h1>
            <p>سرور با موفقیت راه‌اندازی شده است</p>
            <div style="margin-top: 30px;">
                <a href="/api/object-line/status" style="color: white; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 10px; text-decoration: none;">تست API</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

// API‌ها
app.get('/api/object-line/status', (req, res) => {
    res.json({
        success: true,
        message: 'سرور فعال است',
        data: {
            server: "objects-line.tetra.cloud",
            status: "active"
        }
    });
});

app.post('/api/quantum/2d-to-3d', (req, res) => {
    res.json({
        success: true,
        message: 'تبدیل 2D به 3D انجام شد',
        data: { /* داده‌های نمونه */ }
    });
});

// سایر API‌ها...

// راه‌اندازی سرور - سازگار با Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 سرور فعال روی پورت: ' + PORT);
});

module.exports = app;
