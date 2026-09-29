// JAGO Backend Server (Node.js REST API & Persistence Service)
// Provides applicant storage, credential authentication, and MediaFire OTA synchronization

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'jago_database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial DB template
const defaultDb = {
  applicants: [],
  applications: [],
  documents: [],
  systemConfig: {
    currentVersion: '1.2',
    latestVersion: '1.2',
    mediaFireMasterFolder: 'https://www.mediafire.com/folder/4fmr1vrov62fl/Documents',
    releaseNotes: 'Official MoTA unified release with real-time applicant authentication and master folder sync.',
    lastBroadcast: Date.now(),
  },
};

function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading database file:', e);
  }
  return defaultDb;
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing database file:', e);
  }
}

// Ensure db file exists
if (!fs.existsSync(DB_FILE)) {
  writeDb(defaultDb);
}

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    let parsedBody = {};
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {}
    }

    // --- API ROUTES ---

    // 1. Health check & version info
    if (pathname === '/api/version' && req.method === 'GET') {
      const db = readDb();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.systemConfig));
      return;
    }

    // 2. Admin OTA Broadcast
    if (pathname === '/api/version/broadcast' && req.method === 'POST') {
      const db = readDb();
      db.systemConfig = {
        ...db.systemConfig,
        latestVersion: parsedBody.version || db.systemConfig.latestVersion,
        mediaFireMasterFolder: parsedBody.folderUrl || db.systemConfig.mediaFireMasterFolder,
        releaseNotes: parsedBody.notes || db.systemConfig.releaseNotes,
        lastBroadcast: Date.now(),
      };
      writeDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, config: db.systemConfig }));
      return;
    }

    // 3. Applicant Login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { identifier, password } = parsedBody;

      // Secret Admin Check
      if (
        (identifier === 'admin@jago.gov.in' || identifier === 'mota.admin') &&
        password === 'jagoadmin@2026'
      ) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            isAdmin: true,
            user: { id: 'ADMIN-01', name: 'MoTA Central Admin', email: 'admin@jago.gov.in' },
          })
        );
        return;
      }

      const db = readDb();
      const applicant = db.applicants.find(
        (a) =>
          a.id === identifier ||
          a.mobile === identifier ||
          (a.aadhaar && a.aadhaar.replace(/\s+/g, '') === identifier.replace(/\s+/g, ''))
      );

      if (!applicant || applicant.password !== password) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid credentials' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, isAdmin: false, user: applicant }));
      return;
    }

    // 4. Applicant Registration (Zero Demo Data)
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const db = readDb();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newApplicant = {
        id: `ST-2026-${randomSuffix}`,
        ...parsedBody,
        createdAt: new Date().toISOString(),
      };
      db.applicants.push(newApplicant);
      writeDb(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, user: newApplicant }));
      return;
    }

    // Default 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  });
});

server.listen(PORT, () => {
  console.log(`[JAGO Backend Service] Server running on http://localhost:${PORT}`);
});
