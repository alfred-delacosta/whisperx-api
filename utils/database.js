import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'whisperx.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS transcriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_name TEXT NOT NULL,
    generated_id TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export function insertTranscription(originalName, generatedId) {
  const stmt = db.prepare('INSERT OR IGNORE INTO transcriptions (original_name, generated_id) VALUES (?, ?)');
  return stmt.run(originalName, generatedId);
}

export function getTranscriptionByOriginal(originalName) {
  const stmt = db.prepare('SELECT * FROM transcriptions WHERE original_name = ?');
  return stmt.get(originalName);
}

export function getTranscriptionByGenerated(generatedId) {
  const stmt = db.prepare('SELECT * FROM transcriptions WHERE generated_id = ?');
  return stmt.get(generatedId);
}

export function getTranscriptionByName(name) {
  let record = getTranscriptionByOriginal(name);
  if (record) return record;
  record = getTranscriptionByGenerated(name);
  if (record) return record;
  const stmt = db.prepare('SELECT * FROM transcriptions WHERE original_name LIKE ? OR original_name = ?');
  record = stmt.get(`${name}.%`, name);
  return record;
}

export default db;