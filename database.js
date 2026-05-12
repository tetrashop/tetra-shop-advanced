const initSqlJs = require('sql.js');
const fs = require('fs');

let db;
const DB_FILE = './tetra.db';

async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_FILE)) {
    const buffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

async function createUser(username, hashedPassword) {
  const database = await getDb();
  try {
    database.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    saveDb();
    return { success: true };
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return { success: false, message: 'نام کاربری تکراری است' };
    }
    throw err;
  }
}

async function findUser(username) {
  const database = await getDb();
  const result = database.exec('SELECT * FROM users WHERE username = ?', [username]);
  if (result.length && result[0].values.length) {
    const row = result[0].values[0];
    return {
      id: row[0],
      username: row[1],
      password: row[2],
      created_at: row[3]
    };
  }
  return null;
}

module.exports = { getDb, createUser, findUser, saveDb };
