const { createWorker } = require('tesseract.js');
const Jimp = require('jimp');

async function performOCR(imageBuffer, lang = 'eng') {
  const worker = await createWorker({
    logger: m => console.log(m)
  });
  try {
    await worker.load();
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    const { data: { text } } = await worker.recognize(imageBuffer);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}

// Fallback آفلاین
const { PNG } = require('pngjs');
const OCRAD = require('ocrad.js');

async function performOCROffline(imageBuffer) {
  try {
    const image = await Jimp.read(imageBuffer);
    image.grayscale().contrast(1).resize(800, Jimp.AUTO);
    const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    const png = PNG.sync.read(pngBuffer);
    return OCRAD(png).trim();
  } catch (e) {
    throw new Error('OCR failed');
  }
}

module.exports = { performOCR, performOCROffline };
