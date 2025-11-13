const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// روت اصلی - رابط کاربری
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تبدیل 2D به 3D - تترا شاپ</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: Tahoma; }
            body { background: linear-gradient(135deg, #667eea, #764ba2); color: #333; padding: 20px; min-height: 100vh; }
            .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
            .header { text-align: center; padding: 20px 0; margin-bottom: 30px; border-bottom: 2px solid #eee; }
            .header h1 { font-size: 2.5em; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .upload-section { border: 3px dashed #667eea; border-radius: 15px; padding: 40px; text-align: center; margin: 20px 0; cursor: pointer; background: rgba(102,126,234,0.05); }
            .btn { padding: 12px 30px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; margin: 10px; font-weight: bold; }
            .btn:disabled { background: #ccc; cursor: not-allowed; }
            .result { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 10px; display: none; }
            .loading { display: none; text-align: center; margin: 20px 0; }
            .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔮 تبدیل 2D به 3D</h1>
                <p>سیستم کوانتومی تترا شاپ</p>
            </div>
            
            <div class="upload-section" onclick="document.getElementById('fileInput').click()">
                <div style="font-size: 4em;">📁</div>
                <h3>برای آپلود تصویر کلیک کنید</h3>
                <p>فرمت‌های مجاز: JPG, PNG</p>
                <input type="file" id="fileInput" style="display: none;" accept=".jpg,.jpeg,.png" onchange="handleFileSelect(event)">
            </div>
            
            <div style="text-align: center;">
                <button class="btn" id="convertBtn" onclick="convertTo3D()" disabled>شروع تبدیل</button>
            </div>
            
            <div class="loading" id="loadingSection">
                <div class="spinner"></div>
                <p>در حال پردازش تصویر...</p>
            </div>
            
            <div class="result" id="resultSection">
                <h3>نتایج تبدیل:</h3>
                <div id="resultContent"></div>
            </div>
        </div>

        <script>
            let selectedFile = null;
            const baseUrl = window.location.origin;
            
            function handleFileSelect(event) {
                const file = event.target.files[0];
                if (file && file.size < 5 * 1024 * 1024) { // حداکثر 5MB
                    selectedFile = file;
                    document.getElementById('convertBtn').disabled = false;
                    
                    const uploadSection = document.querySelector('.upload-section');
                    uploadSection.innerHTML = `
                        <div style="font-size: 3em;">📷</div>
                        <h3>فایل انتخاب شده:</h3>
                        <p><strong>${file.name}</strong></p>
                        <p>(${(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                        <button class="btn" onclick="document.getElementById('fileInput').click()" style="background: #666;">
                            تغییر فایل
                        </button>
                    `;
                } else {
                    alert('لطفاً فایلی کوچک‌تر از 5MB انتخاب کنید');
                }
            }
            
            async function convertTo3D() {
                if (!selectedFile) return;
                
                const convertBtn = document.getElementById('convertBtn');
                const loadingSection = document.getElementById('loadingSection');
                const resultSection = document.getElementById('resultSection');
                const resultContent = document.getElementById('resultContent');
                
                // نمایش لودینگ
                convertBtn.disabled = true;
                convertBtn.textContent = 'در حال پردازش...';
                loadingSection.style.display = 'block';
                resultSection.style.display = 'none';
                
                try {
                    const formData = new FormData();
                    formData.append('image', selectedFile);
                    formData.append('format', 'obj');
                    
                    const response = await fetch(baseUrl + '/api/convert-3d', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        resultContent.innerHTML = \`
                            <div style="background: #1a1a1a; color: #00ff00; padding: 15px; border-radius: 8px; font-family: monospace;">
                                <strong>✅ تبدیل موفق</strong><br>
                                مدل: \${result.data.modelId}<br>
                                رأس: \${result.data.vertexCount}<br>
                                وجه: \${result.data.faceCount}<br>
                                زمان: \${result.data.processingTime}
                            </div>
                            <div style="text-align: center; margin-top: 15px;">
                                <a href="\${result.data.downloadUrl}" class="btn" download style="background: #2ecc71;">
                                    📥 دانلود فایل OBJ
                                </a>
                            </div>
                        \`;
                    } else {
                        resultContent.innerHTML = '<div style="color: red;">❌ ' + result.message + '</div>';
                    }
                    
                } catch (error) {
                    resultContent.innerHTML = '<div style="color: red;">❌ خطا در ارتباط با سرور</div>';
                } finally {
                    loadingSection.style.display = 'none';
                    resultSection.style.display = 'block';
                    convertBtn.disabled = false;
                    convertBtn.textContent = 'شروع تبدیل';
                }
            }
        </script>
    </body>
    </html>
    `);
});

// API تبدیل 3D - بدون پردازش سنگین
app.post('/api/convert-3d', async (req, res) => {
    try {
        console.log('📨 دریافت درخواست تبدیل 3D');
        
        // شبیه‌سازی پردازش سریع
        const modelId = 'model_' + Date.now();
        const vertexCount = Math.floor(Math.random() * 2000) + 500;
        const faceCount = Math.floor(vertexCount * 1.5);
        
        res.json({
            success: true,
            message: 'تبدیل 2D به 3D با موفقیت انجام شد',
            data: {
                modelId: modelId,
                vertexCount: vertexCount,
                faceCount: faceCount,
                processingTime: (Math.random() * 1 + 0.5).toFixed(2) + ' ثانیه',
                downloadUrl: `/api/download/${modelId}.obj`
            },
            timestamp: new Date().toLocaleString('fa-IR')
        });
        
    } catch (error) {
        console.error('❌ خطا:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در پردازش'
        });
    }
});

// API دانلود
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    
    // تولید یک فایل OBJ ساده
    const objContent = `# مدل 3D تولید شده توسط تترا شاپ
# فایل: ${filename}

v 0.0 0.0 0.0
v 1.0 0.0 0.0  
v 0.0 1.0 0.0
v 0.0 0.0 1.0

f 1 2 3
f 1 3 4
f 1 4 2
f 2 4 3`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(objContent);
});

// API وضعیت
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        status: 'active',
        service: 'تبدیل 2D به 3D',
        version: '2.2.0'
    });
});

// هندل کردن همه routes
app.all('*', (req, res) => {
    res.json({
        success: true,
        message: 'سرور تترا شاپ',
        path: req.path
    });
});

module.exports = app;
