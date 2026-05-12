// نسخه‌ی پیشرفته: قالب پایه + پشتیبانی از مدل زبانی خارجی
const templates = {
  product: [
    "محصول {product} با ویژگی‌های {feature1} و {feature2} عرضه شد. قیمت: {price} تومان.",
    "با {product}، تجربه‌ای نو از {feature1} داشته باشید. فقط {price} تومان.",
    "معرفی {product}: ترکیبی از {feature1} و {feature2}. هم‌اکنون {price} تومان."
  ],
  blog: [
    "امروز درباره {topic} صحبت می‌کنیم. {aspect} اهمیت زیادی دارد. در ادامه {detail} را بررسی می‌کنیم.",
    "{topic} دنیا را تغییر می‌دهد. با ما همراه شوید تا {aspect} را بهتر بشناسید. {detail}",
    "راهنمای کامل {topic}: از {aspect} تا {detail}"
  ],
  social: [
    "🔥 فرصت استثنایی: {product} با تخفیف {discount}٪ تا ساعت {time} امشب! #تترا_شاپ",
    "✨ تازه رسید: {product} با {feature} همین حالا در تترا شاپ. {hashtag}",
    "🚀 {product} با قیمت {price} تومان. {benefit} را از دست ندهید!"
  ]
};

const keywords = {
  product: ['گوشی هوشمند', 'هدفون بی‌سیم', 'ساعت هوشمند', 'لپ‌تاپ', 'تبلت', 'دوربین عکاسی'],
  feature: ['باتری قدرتمند', 'AMOLED', '108MP', 'ضدآب', 'پردازنده سریع', 'حافظه بالا'],
  topic: ['هوش مصنوعی', 'اینترنت اشیا', 'بلاکچین', 'واقعیت مجازی'],
  hashtag: ['#تکنولوژی', '#جدید', '#حراج', '#فروش_ویژه']
};

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function fillTemplate(template, params) {
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] || '');
}

function generateLocal(type, params) {
  const typeTemplates = templates[type] || templates.product;
  const template = pickRandom(typeTemplates);
  const defaults = {
    product: pickRandom(keywords.product),
    feature1: pickRandom(keywords.feature),
    feature2: pickRandom(keywords.feature),
    feature: pickRandom(keywords.feature),
    price: Math.floor(Math.random() * 9000000 + 1000000).toLocaleString('fa-IR'),
    discount: Math.floor(Math.random() * 30 + 10),
    time: '۲۴',
    topic: pickRandom(keywords.topic),
    aspect: pickRandom(keywords.feature),
    detail: 'جزئیات کامل',
    hashtag: pickRandom(keywords.hashtag),
    benefit: pickRandom(keywords.feature)
  };
  return fillTemplate(template, { ...defaults, ...params });
}

// بخش اتصال به Hugging Face
async function generateWithAI(type, params) {
  const HF_TOKEN = process.env.HF_TOKEN;
  if (!HF_TOKEN) {
    return null; // اگر توکن نبود، fallback به روش محلی
  }
  const prompt = `Generate a ${type} content in Persian about a product named "${params.product || 'محصول جدید'}" with features: ${params.feature1 || 'ویژگی اول'} and ${params.feature2 || 'ویژگی دوم'} priced at ${params.price || 'مناسب'} tomans. Make it short and attractive.`;
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 150, temperature: 0.7 }
      })
    });
    if (!response.ok) throw new Error('AI API error');
    const result = await response.json();
    // استخراج متن تولید شده
    return result[0]?.generated_text?.replace(prompt, '').trim() || null;
  } catch (err) {
    console.error('AI writer error:', err.message);
    return null;
  }
}

async function generateText(type, params) {
  // اول سعی با AI اگر تنظیم شده باشد
  const aiText = await generateWithAI(type, params);
  if (aiText) return aiText;
  // در غیر این صورت خروجی محلی
  return generateLocal(type, params);
}

module.exports = { generateText };
