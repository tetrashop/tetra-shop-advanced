const BASE = 'http://localhost:3000';

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
  } catch (e) {
    console.log(`❌ ${name}: ${e.message}`);
  }
}

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

(async () => {
  // سلامت
  await test('Health', async () => {
    const r = await fetch(BASE + '/api/health').then(r=>r.json());
    if (r.status !== 'healthy') throw new Error('unhealthy');
  });

  // ثبت‌نام
  await test('Register', async () => {
    const r = await post('/api/users/register', { username: 'test' + Date.now(), password: '123456' });
    if (!r.success) throw new Error(r.message);
  });

  // ورود
  let token;
  await test('Login', async () => {
    const r = await post('/api/users/login', { username: 'admin', password: 'admin' });
    // اگر کاربر admin وجود نداشت، اول می‌سازیم
    if (!r.success) {
      await post('/api/users/register', { username: 'admin', password: 'admin' });
      const r2 = await post('/api/users/login', { username: 'admin', password: 'admin' });
      if (!r2.success) throw new Error('login failed');
      token = r2.token;
    } else token = r.token;
  });

  // 2D->3D نمونه
  await test('3D Convert', async () => {
    const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='; // یک پیکسل قرمز
    const r = await post('/api/convert-3d', { imageData: dummyBase64, format: 'obj' });
    if (!r.success) throw new Error(r.message);
  });

  // OCR
  await test('OCR', async () => {
    const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const r = await post('/api/ocr', { imageData: dummyBase64 });
    if (!r.success) throw new Error(r.message);
  });

  // Writer
  await test('Writer', async () => {
    const r = await post('/api/writer', { type: 'product', params: { product: 'تست' } });
    if (!r.success) throw new Error(r.message);
  });

  console.log('🎉 تست‌ها پایان یافتند');
})();
