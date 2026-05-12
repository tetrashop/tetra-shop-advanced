const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'tetra_super_secret_1405';

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

// میدلور اجباری: فقط کاربران وارد شده
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'توکن احراز هویت لازم است' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'توکن نامعتبر یا منقضی شده' });
  }
}

module.exports = { generateToken, verifyToken, authMiddleware };
