const Jimp = require('jimp');

// تشخیص لبه ساده با کانولوشن سوبل
async function edgeDetection(imageBuffer, maxWidth = 256) {
  const image = await Jimp.read(imageBuffer);
  const w = Math.min(image.bitmap.width, maxWidth);
  const h = Math.round((w / image.bitmap.width) * image.bitmap.height);
  image.resize(w, h).grayscale();

  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

  const edgeImage = new Jimp(w, h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let gx = 0, gy = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = Jimp.intToRGBA(image.getPixelColor(x + kx, y + ky)).r;
          gx += pixel * sobelX[ky + 1][kx + 1];
          gy += pixel * sobelY[ky + 1][kx + 1];
        }
      }
      const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));
      edgeImage.setPixelColor(Jimp.rgbaToInt(mag, mag, mag, 255), x, y);
    }
  }
  return edgeImage;
}

async function imageTo3D(imageBuffer, maxWidth = 256, format = 'obj', useEdge = false) {
  let image;
  if (useEdge) {
    image = await edgeDetection(imageBuffer, maxWidth);
  } else {
    image = await Jimp.read(imageBuffer);
    const w = Math.min(image.bitmap.width, maxWidth);
    const h = Math.round((w / image.bitmap.width) * image.bitmap.height);
    image.resize(w, h);
  }

  const w = image.bitmap.width;
  const h = image.bitmap.height;
  const vertices = [];
  const faces = [];
  const maxDisp = 2.0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));
      const brightness = (r + g + b) / 3;
      const px = (x / (w - 1) - 0.5) * 5;
      const pz = (y / (h - 1) - 0.5) * 5;
      const py = (brightness / 255) * maxDisp;
      vertices.push({ px, py, pz });
    }
  }

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const i = y * w + x + 1;
      const iRight = i + 1;
      const iDown = i + w;
      const iDownRight = i + w + 1;
      faces.push([i, iDown, iRight], [iRight, iDown, iDownRight]);
    }
  }

  if (format === 'stl') {
    let stl = 'solid model\n';
    for (const [v1, v2, v3] of faces) {
      const p1 = vertices[v1-1], p2 = vertices[v2-1], p3 = vertices[v3-1];
      const u = { x: p2.px - p1.px, y: p2.py - p1.py, z: p2.pz - p1.pz };
      const v = { x: p3.px - p1.px, y: p3.py - p1.py, z: p3.pz - p1.pz };
      const nx = u.y * v.z - u.z * v.y;
      const ny = u.z * v.x - u.x * v.z;
      const nz = u.x * v.y - u.y * v.x;
      const len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
      stl += `facet normal ${(nx/len).toFixed(6)} ${(ny/len).toFixed(6)} ${(nz/len).toFixed(6)}\n`;
      stl += ' outer loop\n';
      stl += `  vertex ${p1.px.toFixed(6)} ${p1.py.toFixed(6)} ${p1.pz.toFixed(6)}\n`;
      stl += `  vertex ${p2.px.toFixed(6)} ${p2.py.toFixed(6)} ${p2.pz.toFixed(6)}\n`;
      stl += `  vertex ${p3.px.toFixed(6)} ${p3.py.toFixed(6)} ${p3.pz.toFixed(6)}\n`;
      stl += ' endloop\nendfacet\n';
    }
    stl += 'endsolid model';
    return stl;
  } else {
    let obj = '# مدل سه‌بعدی تترا شاپ\n';
    obj += 'o TetraModel\n';
    for (const v of vertices) {
      obj += `v ${v.px.toFixed(6)} ${v.py.toFixed(6)} ${v.pz.toFixed(6)}\n`;
    }
    for (const [a, b, c] of faces) {
      obj += `f ${a} ${b} ${c}\n`;
    }
    return obj;
  }
}

const imageToObj = (buf, maxW) => imageTo3D(buf, maxW, 'obj', false);
const imageToObjEdge = (buf, maxW) => imageTo3D(buf, maxW, 'obj', true);
const imageToStl = (buf, maxW) => imageTo3D(buf, maxW, 'stl', false);
const imageToStlEdge = (buf, maxW) => imageTo3D(buf, maxW, 'stl', true);

module.exports = { imageToObj, imageToObjEdge, imageToStl, imageToStlEdge };
