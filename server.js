const express = require('express');
const app = express();
const { imageToObj, imageToObjEdge, imageToStl, imageToStlEdge } = require('./converter');
const { performOCR, performOCROffline } = require('./ocr');
const { generateText } = require('./writer');
const { createUser, findUser } = require('./database');
const { generateToken, authMiddleware } = require('./auth');
const bcrypt = require('bcryptjs');
const path = require('path');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const modelCache = new Map();

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/api/health', (req, res) => res.json({ status: 'healthy' }));

app.post('/api/users/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'نام کاربری و رمز الزامی است' });
    const hashed = await bcrypt.hash(password, 10);
    const result = await createUser(username, hashed);
    if (!result.success) return res.status(409).json({ success: false, message: result.message });
    res.status(201).json({ success: true, message: 'ثبت‌نام موفق' });
  } catch (err) { next(err); }
});

app.post('/api/users/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'نام کاربری و رمز الزامی است' });
    const user = await findUser(username);
    if (!user) return res.status(401).json({ success: false, message: 'کاربر یافت نشد' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'رمز اشتباه است' });
    const token = generateToken(user);
    res.json({ success: true, token, user: { id: user.id, username: user.username } });
  } catch (err) { next(err); }
});

app.get('/api/users/me', authMiddleware, (req, res) => res.json({ success: true, user: req.user }));

app.post('/api/convert-3d', async (req, res, next) => {
  try {
    let { imageData, format = 'obj', useEdge = false } = req.body;
    if (!imageData || typeof imageData !== 'string') return res.status(400).json({ success: false, message: 'imageData الزامی' });
    const matches = imageData.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    if (!matches) return res.status(400).json({ success: false, message: 'فرمت تصویر نامعتبر' });
    const imageBuffer = Buffer.from(matches[2], 'base64');
    let content;
    if (format === 'stl') content = useEdge ? await imageToStlEdge(imageBuffer, 256) : await imageToStl(imageBuffer, 256);
    else { content = useEdge ? await imageToObjEdge(imageBuffer, 256) : await imageToObj(imageBuffer, 256); format = 'obj'; }
    const modelId = `model_${Date.now()}.${format}`;
    modelCache.set(modelId, content);
    res.json({ success: true, data: { modelId, downloadUrl: `/api/download?model=${encodeURIComponent(modelId)}`, format, usedEdge: useEdge } });
  } catch (err) { next(err); }
});

app.post('/api/ocr', async (req, res, next) => {
  try {
    const { imageData, lang = 'eng' } = req.body;
    if (!imageData) return res.status(400).json({ success: false, message: 'imageData الزامی' });
    const matches = imageData.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    if (!matches) return res.status(400).json({ success: false, message: 'فرمت تصویر نامعتبر' });
    const imageBuffer = Buffer.from(matches[2], 'base64');

    let text;
    try {
      // تلاش با Tesseract (روی Vercel جواب می‌دهد)
      text = await performOCR(imageBuffer, lang);
    } catch (tesseractErr) {
      console.warn('Tesseract failed, fallback to offline OCR:', tesseractErr.message);
      // Fallback به OCR آفلاین (سریع روی لوکال)
      text = await performOCROffline(imageBuffer);
    }

    res.json({ success: true, data: { text, lang } });
  } catch (err) {
    console.error('OCR Error:', err.message);
    res.status(500).json({ success: false, message: 'خطا در پردازش OCR' });
  }
});

app.post('/api/writer', async (req, res, next) => {
  try {
    const { type = 'product', params = {} } = req.body;
    if (!['product', 'blog', 'social'].includes(type)) return res.status(400).json({ success: false, message: 'نوع نامعتبر' });
    const content = await generateText(type, params);
    res.json({ success: true, data: { type, content } });
  } catch (err) { next(err); }
});

app.get('/api/download', (req, res) => {
  const modelId = req.query.model;
  if (!modelId || !modelCache.has(modelId)) return res.status(404).json({ success: false, message: 'فایل یافت نشد' });
  const content = modelCache.get(modelId);
  modelCache.delete(modelId);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${modelId}"`);
  res.send(content);
});

app.use((req, res) => res.status(404).json({ success: false, message: 'مسیر یافت نشد' }));
app.use((err, req, res, next) => {
  console.error('🚨 خطای سرور:', err.stack);
  res.status(500).json({ success: false, message: 'خطای داخلی سرور' });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) app.listen(PORT, () => console.log(`🎉 تترا شاپ پایدار روی http://localhost:${PORT}`));
module.exports = app;
