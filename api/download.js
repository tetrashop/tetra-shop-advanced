module.exports = (req, res) => {
  const file = req.query.file || 'model.obj';
  
  // محتوای فایل نمونه
  const content = `# فایل تولید شده توسط تترا شاپ
# مدل 3D
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 0.0 1.0 0.0
f 1 2 3`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="${file}"`);
  res.send(content);
};
