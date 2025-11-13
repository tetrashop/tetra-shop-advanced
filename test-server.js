import express from 'express';
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'سرور تست فعال است', timestamp: new Date().toISOString() });
});

app.listen(3001, () => {
  console.log('🚀 سرور تست در پورت 3001 اجرا شد');
});
