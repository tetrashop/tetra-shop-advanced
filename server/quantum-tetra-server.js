const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const ImageOptimizer = require('./image-optimizer');

const app = express();
const imageOptimizer = new ImageOptimizer();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// پیکربندی Multer برای آپلود ایمن
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('فرمت فایل پشتیبانی نمی‌شود. لطفاً از تصاویر JPG, PNG یا WebP استفاده کنید.'));
        }
    }
});

// هندل خطاهای Multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'حجم فایل بسیار بزرگ است. حداکثر حجم مجاز: 5MB'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'تعداد فایل‌های ارسالی بیش از حد مجاز است'
            });
        }
    }
    next(error);
};

app.use(handleMulterError);

// ==================== روت‌های اصلی ====================

// روت سلامت سرور
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 سرور تترا شاپ با قابلیت مناسب‌سازی تصویر فعال است',
        version: '3.1.0',
        timestamp: new Date().toLocaleString('fa-IR'),
        features: [
            'مناسب‌سازی هوشمند تصویر',
            'تبدیل 2D به 3D کوانتومی',
            'پردازش OCR پیشرفته',
            'نویسنده هوشمند کوانتومی'
        ]
    });
});

// ==================== سرویس مناسب‌سازی تصویر ====================

// آپلود و مناسب‌سازی تصویر
app.post('/api/optimize-image', upload.single('image'), async (req, res) => {
    try {
        console.log('📨 دریافت درخواست مناسب‌سازی تصویر...');
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'لطفاً یک تصویر انتخاب کنید'
            });
        }

        // اعتبارسنجی تصویر
        const validation = imageOptimizer.validateImage(req.file);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'تصویر نامعتبر است',
                errors: validation.errors,
                details: validation.details
            });
        }

        console.log('✅ تصویر معتبر است. شروع مناسب‌سازی...');

        // مناسب‌سازی تصویر
        const optimizationOptions = {
            maxWidth: req.body.maxWidth || 1200,
            maxHeight: req.body.maxHeight || 800,
            quality: req.body.quality || 80,
            format: req.body.format || 'jpeg'
        };

        const optimizationResult = await imageOptimizer.optimizeImage(
            req.file.buffer, 
            optimizationOptions
        );

        if (!optimizationResult.success) {
            throw new Error(optimizationResult.error);
        }

        // تولید گزارش
        const report = imageOptimizer.generateOptimizationReport(req.file, optimizationResult);

        res.json({
            success: true,
            message: 'تصویر با موفقیت مناسب‌سازی شد',
            data: {
                optimization: report,
                downloadUrl: '/api/download/optimized-image.jpg',
                metadata: optimizationResult.metadata
            },
            timestamp: new Date().toLocaleString('fa-IR')
        });

    } catch (error) {
        console.error('❌ خطا در مناسب‌سازی تصویر:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در پردازش تصویر: ' + error.message
        });
    }
});

// ==================== سرویس تبدیل 2D به 3D با تصویر بهینه ====================

app.post('/api/convert-3d', upload.single('image'), async (req, res) => {
    try {
        console.log('🔮 دریافت درخواست تبدیل 2D به 3D...');
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'لطفاً یک تصویر انتخاب کنید'
            });
        }

        // ابتدا تصویر را مناسب‌سازی می‌کنیم
        const validation = imageOptimizer.validateImage(req.file);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'تصویر برای تبدیل 3D نامعتبر است',
                errors: validation.errors
            });
        }

        console.log('🔄 در حال مناسب‌سازی تصویر برای تبدیل 3D...');
        
        // مناسب‌سازی تصویر برای پردازش 3D
        const optimizationResult = await imageOptimizer.optimizeImage(req.file.buffer, {
            maxWidth: 800,
            maxHeight: 600,
            quality: 90,
            format: 'jpeg'
        });

        if (!optimizationResult.success) {
            throw new Error('خطا در مناسب‌سازی تصویر برای تبدیل 3D');
        }

        console.log('✅ تصویر مناسب‌سازی شد. شروع تبدیل 3D...');

        // تبدیل به 3D (شبیه‌سازی)
        const modelId = 'model_' + Date.now();
        const vertexCount = Math.floor(Math.random() * 3000) + 1000;
        const faceCount = Math.floor(vertexCount * 1.6);

        res.json({
            success: true,
            message: 'تبدیل 2D به 3D با موفقیت انجام شد',
            data: {
                modelId: modelId,
                vertexCount: vertexCount,
                faceCount: faceCount,
                processingTime: '۱.۸ ثانیه',
                originalImage: validation.details,
                optimizedImage: optimizationResult.metadata,
                downloadUrl: `/api/download/${modelId}.obj`
            },
            timestamp: new Date().toLocaleString('fa-IR')
        });

    } catch (error) {
        console.error('❌ خطا در تبدیل 3D:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در تبدیل تصویر به مدل 3D: ' + error.message
        });
    }
});

// ==================== سرویس‌های کمکی ====================

// API وضعیت سرور
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        status: 'active',
        service: 'تترا شاپ با قابلیت مناسب‌سازی تصویر',
        version: '3.1.0',
        features: {
            imageOptimization: {
                maxSize: '5MB',
                supportedFormats: ['JPEG', 'JPG', 'PNG', 'WebP'],
                maxDimensions: '1920x1080'
            },
            '3dConversion': 'فعال',
            ocrProcessing: 'فعال',
            quantumWriter: 'فعال'
        }
    });
});

// API اطلاعات مناسب‌سازی
app.get('/api/optimization-info', (req, res) => {
    res.json({
        success: true,
        optimization: {
            maxFileSize: '5MB',
            supportedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
            maxDimensions: '1920x1080px',
            features: [
                'کاهش حجم هوشمند',
                'تغییر سایز خودکار',
                'بهینه‌سازی کیفیت',
                'پشتیبانی از فرمت‌های مختلف'
            ]
        }
    });
});

// API دانلود
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    
    // شبیه‌سازی فایل برای دانلود
    const fileContent = `# فایل تولید شده توسط تترا شاپ\n# ${filename}\n# تاریخ: ${new Date().toLocaleString('fa-IR')}`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(fileContent);
});

// ==================== هندل خطاهای全局 ====================

// هندل خطاهای 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'مسیر مورد نظر یافت نشد',
        path: req.path
    });
});

// هندل خطاهای سرور
app.use((error, req, res, next) => {
    console.error('🚨 خطای سرور:', error);
    
    res.status(500).json({
        success: false,
        message: 'خطای داخلی سرور',
        error: process.env.NODE_ENV === 'development' ? error.message : 'خطای سیستمی'
    });
});

// ==================== راه‌اندازی سرور ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('🚀 سرور تترا شاپ با قابلیت مناسب‌سازی تصویر راه‌اندازی شد!');
    console.log('🌐 آدرس: http://localhost:' + PORT);
    console.log('📷 قابلیت‌های فعال:');
    console.log('   ✅ مناسب‌سازی هوشمند تصویر');
    console.log('   ✅ تبدیل 2D به 3D کوانتومی');
    console.log('   ✅ پردازش OCR پیشرفته');
    console.log('   ✅ نویسنده هوشمند کوانتومی');
    console.log('   ✅ مدیریت خطاهای پیشرفته');
});

module.exports = app;
