const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'feedback.json');
const ALLOWED_TOPICS = new Set([
  'General Feedback',
  'Report a Bug',
  'Suggest a Feature',
  'Submit a Real Case',
  'Legal Content Issue',
  'Other',
]);

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ feedback: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  if (req.url === '/api/feedback' && req.method === 'GET') {
    try {
      const db = readDb();
      return sendJson(res, 200, db.feedback || []);
    } catch (err) {
      return sendJson(res, 500, { error: 'Failed to read feedback DB.' });
    }
  }

  if (req.url === '/api/feedback' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) req.socket.destroy();
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const topic = typeof parsed.topic === 'string' ? parsed.topic.trim() : '';
        const message = typeof parsed.message === 'string' ? parsed.message.trim() : '';

        if (!topic || !ALLOWED_TOPICS.has(topic)) {
          return sendJson(res, 400, { error: 'Invalid topic.' });
        }
        if (!message) {
          return sendJson(res, 400, { error: 'Message is required.' });
        }

        const db = readDb();
        const entry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          topic,
          message,
          createdAt: new Date().toISOString(),
        };

        db.feedback = Array.isArray(db.feedback) ? db.feedback : [];
        db.feedback.push(entry);
        writeDb(db);

        return sendJson(res, 201, { ok: true, entry });
      } catch (err) {
        return sendJson(res, 400, { error: 'Invalid JSON body.' });
      }
    });

    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  ensureDb();
  console.log(`Feedback API running on http://localhost:${PORT}`);
});
