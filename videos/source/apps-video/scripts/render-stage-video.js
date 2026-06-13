/* eslint-disable */
// Generic renderer for the in-browser React/Babel animation HTML files under
// apps/video/. Screen-captures a Playwright browser session for the animation's
// duration, trims compositor paint artifacts, and emits the raw webm + a
// `<slug>.render.json` trim plan consumed by transcode-stage-video.js.
//
// Required env:
//   STAGE_DIR          — absolute path to the directory containing the HTML
//   STAGE_HTML         — HTML filename inside STAGE_DIR
//   STAGE_DURATION_S   — animation duration in seconds (matches <Stage duration={...}>)
//   STAGE_PERSIST_KEY  — the <Stage persistKey="..."> value, used to detect t=0
//   STAGE_SLUG         — output file base name (e.g. "demo" → out/demo.webm, demo.render.json)
// Optional env:
//   STAGE_TRIM_HEAD_S       — seconds of animation to discard at the start (default 1.0)
//   STAGE_TRIM_TAIL_S       — extra record buffer after animation ends (default 1.0)
//   STAGE_VIEWPORT_WIDTH    — browser viewport width (default 1920)
//   STAGE_VIEWPORT_HEIGHT   — browser viewport height (default 1124; use 1080 for
//                             stages that fill the viewport edge-to-edge)
//   STAGE_MOUNT_SELECTOR    — CSS selector to wait for before detecting playhead
//                             (default '#root > div')
//   STAGE_EXTRA_CSS         — extra CSS to inject (e.g. hide overlay chrome bars)

const path = require('path')
const fs = require('fs')
const http = require('http')
const { chromium } = require('playwright')

const STAGE_DIR = process.env.STAGE_DIR
const HTML_FILE = process.env.STAGE_HTML
const ANIMATION_DURATION_S = Number(process.env.STAGE_DURATION_S)
const PERSIST_KEY = process.env.STAGE_PERSIST_KEY
const SLUG = process.env.STAGE_SLUG
const TRIM_HEAD_S = Number(process.env.STAGE_TRIM_HEAD_S || 1.0)
const TRIM_TAIL_BUFFER_S = Number(process.env.STAGE_TRIM_TAIL_S || 1.0)
const VIEWPORT_WIDTH = Number(process.env.STAGE_VIEWPORT_WIDTH || 1920)
const VIEWPORT_HEIGHT = Number(process.env.STAGE_VIEWPORT_HEIGHT || 1124)
const MOUNT_SELECTOR = process.env.STAGE_MOUNT_SELECTOR || '#root > div'
const EXTRA_CSS = process.env.STAGE_EXTRA_CSS || ''

for (const [k, v] of [
  ['STAGE_DIR', STAGE_DIR],
  ['STAGE_HTML', HTML_FILE],
  ['STAGE_DURATION_S', ANIMATION_DURATION_S],
  ['STAGE_PERSIST_KEY', PERSIST_KEY],
  ['STAGE_SLUG', SLUG],
]) {
  if (!v || (typeof v === 'number' && !Number.isFinite(v))) {
    console.error(`Missing required env var: ${k}`)
    process.exit(1)
  }
}

const OUT_DIR = path.resolve(__dirname, '..', 'out')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

function startServer(rootDir, htmlFile) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
      const filePath = path.join(rootDir, urlPath === '/' ? '/' + htmlFile : urlPath)
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403); res.end('Forbidden'); return
      }
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found: ' + urlPath); return }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' })
        res.end(data)
      })
    })
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      resolve({ server, url: `http://127.0.0.1:${port}/` })
    })
  })
}

;(async () => {
  if (!fs.existsSync(path.join(STAGE_DIR, HTML_FILE))) {
    console.error('Missing HTML at', path.join(STAGE_DIR, HTML_FILE))
    process.exit(1)
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const { server, url: serverUrl } = await startServer(STAGE_DIR, HTML_FILE)
  console.log('[render]', SLUG, '— serving', STAGE_DIR, 'at', serverUrl)

  const viewport = { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }

  const browser = await chromium.launch({ headless: true })
  const recordStartedAt = Date.now()
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT_DIR, size: viewport },
  })
  const page = await context.newPage()
  page.on('pageerror', (err) => console.log('[pageerror]', err.message))
  page.on('requestfailed', (req) => console.log('[requestfailed]', req.url(), req.failure()?.errorText))

  // Clear the persisted playhead so the stage starts from t=0 on mount.
  await page.addInitScript((key) => {
    try { localStorage.clear() } catch {}
    try { localStorage.removeItem(key + ':t') } catch {}
  }, PERSIST_KEY)

  console.log('[render] loading', serverUrl)
  // 'load' instead of 'networkidle' because stages that embed <video> tags
  // stream continuously, which prevents networkidle from ever firing.
  await page.goto(serverUrl, { waitUntil: 'load', timeout: 60_000 })

  await page.addStyleTag({
    content: `html, body { background: #020617 !important; overflow: hidden !important; } ${EXTRA_CSS}`,
  })

  await page.waitForFunction((sel) => !!document.querySelector(sel), MOUNT_SELECTOR, { timeout: 60_000 })
  await page.evaluate(() => document.fonts?.ready).catch(() => {})

  // Detect animation t=0 wall-clock by observing the Stage's persisted playhead.
  const DETECT_AT_S = 0.1
  await page.waitForFunction(
    ({ key, threshold }) => {
      try {
        return parseFloat(localStorage.getItem(key + ':t') || '0') >= threshold
      } catch { return false }
    },
    { key: PERSIST_KEY, threshold: DETECT_AT_S },
    { timeout: 30_000 },
  )
  const detectedAt = Date.now()
  const animStartOffsetMs = detectedAt - recordStartedAt - DETECT_AT_S * 1000
  console.log(
    `[render] animation t=0 at webm offset ${(animStartOffsetMs / 1000).toFixed(2)}s`,
  )

  const recordingEndsAt = recordStartedAt + animStartOffsetMs + (ANIMATION_DURATION_S + TRIM_TAIL_BUFFER_S) * 1000
  const remainingMs = Math.max(0, recordingEndsAt - Date.now())
  console.log(`[render] recording ${(remainingMs / 1000).toFixed(1)}s more (animation is ${ANIMATION_DURATION_S}s)`)
  await page.waitForTimeout(remainingMs)

  const videoHandle = page.video()
  await context.close()
  await browser.close()
  await new Promise((r) => server.close(r))

  if (!videoHandle) {
    console.error('No video handle — did recordVideo fail?')
    process.exit(2)
  }
  const rawPath = await videoHandle.path()
  const finalPath = path.join(OUT_DIR, `${SLUG}.webm`)
  fs.renameSync(rawPath, finalPath)
  console.log('[render] wrote', finalPath, `(${(fs.statSync(finalPath).size / 1_048_576).toFixed(1)} MB)`)

  const finalDuration = ANIMATION_DURATION_S - TRIM_HEAD_S
  const meta = {
    webm: finalPath,
    animStartOffsetSec: animStartOffsetMs / 1000,
    ffmpegSeekSec: Math.max(0, (animStartOffsetMs + TRIM_HEAD_S * 1000) / 1000),
    durationSec: finalDuration,
  }
  fs.writeFileSync(path.join(OUT_DIR, `${SLUG}.render.json`), JSON.stringify(meta, null, 2))
  console.log('[render] trim plan:', meta)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
