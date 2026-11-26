// DompetKeluarga — server berkas statis, ditulis dari nol.
// Melayani direktori app/ di port 8080 (atau --port / PORT).
// Jalankan: node serve.ts [--port 8080]

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const AKAR_APP = resolve(fileURLToPath(new URL('.', import.meta.url)), 'app');
const AKAR_REPO = resolve(fileURLToPath(new URL('.', import.meta.url)));

const TIPE = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
};

function portDariArgv() {
  const bendera = process.argv.indexOf('--port');
  if (bendera >= 0 && process.argv[bendera + 1]) return Number(process.argv[bendera + 1]);
  if (process.env.PORT) return Number(process.env.PORT);
  return 8080;
}

// Petakan jalur URL ke berkas di dalam AKAR_APP; /dossier.json diambil
// dari akar repo. Jalur di luar akar ditolak.
function petakan(jalurUrl) {
  const bersih = decodeURIComponent(jalurUrl.split('?')[0]);
  if (bersih === '/dossier.json') return join(AKAR_REPO, 'dossier.json');
  let relatif = bersih === '/' ? 'index.html' : bersih.replace(/^\//, '');
  if (relatif.endsWith('/')) relatif += 'index.html';
  const gabung = normalize(join(AKAR_APP, relatif));
  if (!gabung.startsWith(AKAR_APP + sep) && gabung !== AKAR_APP) return null;
  return gabung;
}

const server = createServer(async (req, res) => {
  try {
    const target = petakan(req.url ?? '/');
    if (!target) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Ditolak\n');
      return;
    }
    const isi = await readFile(target);
    res.writeHead(200, {
      'content-type': TIPE[extname(target)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(isi);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Tidak ditemukan\n');
  }
});

const port = portDariArgv();
server.listen(port, () => {
  console.log(`DompetKeluarga di http://localhost:${port}`);
});
