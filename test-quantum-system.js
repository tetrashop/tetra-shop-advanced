// test-quantum-system.js
const AdvancedTetraClient = require('./client/advanced-client');

async function testQuantumSystem() {
    console.log('🧪 شروع تست اکوسیستم کوانتومی تترا شاپ...\n');
    
    const client = new AdvancedTetraClient();

    try {
        // تست سرور اشیاء لاین
        console.log('1. 🔗 تست سرور اشیاء لاین...');
        const objectLineStatus = await client.checkObjectLineStatus();
        console.log('✅ وضعیت سرور:', objectLineStatus);

        // تست نویسنده کوانتومی
        console.log('\n2. ✍️ تست نویسنده کوانتومی...');
        const writingResult = await client.generateContent(
            'تبدیل دو بعدی به سه بعدی در مختصات قطبی'
        );
        console.log('✅ محتوای تولید شده:', writingResult.data.generatedContent);

        // تست محاسبات ابری
        console.log('\n3. 🌐 تست محاسبات ابری...');
        const computeResult = await client.delegateComputation(
            'پردازش ورشکستگی در مختصات قطبی',
            { cpu: '4 cores', ram: '8GB' }
        );
        console.log('✅ نتیجه محاسبات:', computeResult.data.computationResult);

        console.log('\n🎉 تمام تست‌ها با موفقیت انجام شد!');
        console.log('🚀 اکوسیستم تترا شاپ آماده بهره‌برداری است');

    } catch (error) {
        console.error('❌ خطا در تست سیستم:', error.message);
    }
}

// اجرای تست
testQuantumSystem();
