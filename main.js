const { app, BrowserWindow, shell } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 17645;
const ORIGIN = `http://localhost:${PORT}`;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

// Twitch refuses to embed from file:// — serving the page on localhost gives it a valid `parent`.
// basename() + extension allowlist: the URL can never reach outside this directory.
http.createServer((req, res) => {
  const name = req.url === '/' ? 'index.html' : path.basename(req.url.split('?')[0]);
  const file = path.join(__dirname, name);
  if (!TYPES[path.extname(name)] || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(name)] });
  res.end(fs.readFileSync(file));
}).listen(PORT, '127.0.0.1');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 480, height: 290, minWidth: 220, minHeight: 140,
    frame: false, resizable: true, backgroundColor: '#000',
    alwaysOnTop: true, fullscreenable: false,
    webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false },
  });
  win.setAlwaysOnTop(true, 'screen-saver');   // stays above fullscreen-windowed games
  win.setAspectRatio(16 / 9);

  // An embedded player must not be able to spawn its own always-on-top window,
  // nor replace our UI: ads and outbound links go to the real browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(ORIGIN)) e.preventDefault();
  });

  win.loadURL(`${ORIGIN}/`);
});

app.on('window-all-closed', () => app.quit());
