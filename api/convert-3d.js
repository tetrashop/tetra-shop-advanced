export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, format = 'obj' } = req.body;
    
    // شبیه‌سازی پردازش
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = {
      success: true,
      message: 'تبدیل با موفقیت انجام شد',
      data: {
        modelId: 'model_' + Date.now(),
        vertexCount: Math.floor(Math.random() * 1000) + 500,
        faceCount: Math.floor(Math.random() * 1500) + 800, 
        processingTime: '۰.۵ ثانیه',
        format: format
      }
    };
    
    res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در پردازش درخواست'
    });
  }
}
