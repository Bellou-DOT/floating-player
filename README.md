# floating-player

A tiny always-on-top window that plays any Twitch stream or YouTube video in a corner of your screen, over everything else — games, your IDE, a spreadsheet.

Paste a link, press Enter. That's the whole app.

![Platform](https://img.shields.io/badge/platform-Windows-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)

## Why

Browser Picture-in-Picture only pops out the `<video>` element, drops the player's own controls, and dies when you close the tab. A second browser window sits behind your game. This is a 290 px window that stays on top, remembers your last link, and has no browser around it.

## Use

1. Download `Overlay.exe` from the [Releases](../../releases) page, or build it yourself (below).
2. Double-click it. No installer, no admin rights, nothing written outside the app.
3. Hover the top of the window → paste a link → `Enter`.

| Gesture | Action |
| --- | --- |
| Top bar (52 px) or bottom strip (22 px) | Move the window |
| Window edges | Resize (locked to 16:9) |
| `▶` | Load the link |
| `✕` | Quit |

The bar fades to 20% opacity when you're not hovering it, so the video stays unobstructed. The last link is remembered between runs.

### Links it understands

| Input | Plays |
| --- | --- |
| `twitch.tv/<channel>` | Live stream |
| `twitch.tv/videos/<id>` | VOD |
| `clips.twitch.tv/<slug>` | Clip |
| `youtube.com/watch?v=<id>`, `youtu.be/<id>` | Video or live |
| `youtube.com/shorts/<id>` | Short |
| `youtube.com/...&list=<id>` | Playlist |
| Any other URL | Loaded as-is in the frame (works if the site allows embedding) |

## How it works

Three details are worth knowing if you read the source:

**The local HTTP server.** Twitch's embedded player requires a `parent` parameter matching the domain that hosts it, and it refuses `file://` outright. So the 60-line UI is served over `http://127.0.0.1:17645` instead of being loaded from disk — `localhost` is a domain Twitch accepts. That single constraint is why there's a server in a desktop app.

**`setAlwaysOnTop(win, 'screen-saver')`.** The plain `alwaysOnTop: true` flag loses against other topmost windows. The `screen-saver` level wins, which is what keeps it above borderless-fullscreen games.

**Embedded players are treated as untrusted.** The renderer runs sandboxed with context isolation and no Node integration; `setWindowOpenHandler` denies every popup an ad or a player might try to open and hands the URL to the real browser instead; `will-navigate` refuses anything that isn't our own origin, so a page can't replace the UI.

## Build

```bash
npm install
npm test          # asserts on the link → player URL conversion
npm start         # run from source
npm run dist      # → dist/Overlay.exe, one portable file
```

Four source files, ~130 lines total: `main.js` (window + server), `index.html` (UI), `embed.js` (link parsing), `test.js` (its tests). **Zero runtime dependencies** — Electron and electron-builder are dev-only, and `npm audit` reports 0 vulnerabilities.

## Known limitations

- **Windows only.** Nothing in the code is Windows-specific, but only the Windows build is produced and tested.
- **The binary is unsigned**, so Windows SmartScreen shows "Windows protected your PC" on first launch — *More info* → *Run anyway*. Code signing requires a paid certificate.
- **It does not sit above true exclusive-fullscreen** (DirectX) games. Borderless/windowed fullscreen is fine, which is what most games default to now.
- The UI labels are in French.
- Default Electron icon.
- No click-through, adjustable opacity, global hotkeys, or multiple simultaneous players.

## License

MIT
