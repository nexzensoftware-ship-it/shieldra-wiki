/* eslint-disable */
// Records the Shieldra product demo HTML (React/Babel in-browser animation)
// into a video file by screen-capturing a Playwright browser session.
//
// Usage: node apps/video/scripts/render-demo.js
//
// Output: apps/video/out/demo.webm  (Playwright's native format)
// A follow-up ffmpeg step transcodes this to apps/web/public/demo.mp4.

const path = require('path')
const fs = require('fs')
const http = require('http')
const { chromium } = require('playwright')

const ROOT = path.resolve(__dirname, '..')
const DEMO_DIR = path.join(ROOT, 'Demo video')
const HTML_FILE = 'Shieldra Product Video.html'
const OUT_DIR = path.join(ROOT, 'out')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

function startServer(rootDir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
      const filePath = path.join(rootDir, urlPath === '/' ? '/' + HTML_FILE : urlPath)
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

// Animation is 128s (11 scenes). The Stage autoplays on mount, but the first
// ~1s of playback has compositor paint artifacts in headless Chromium. We
// detect the exact wall-clock at which animation t=0 occurred, then start
// the final MP4 at animation t=1.0s — the logo is fully opaque by then, so
// the crop looks intentional, not truncated.
const ANIMATION_DURATION_S = 128
const TRIM_HEAD_S = 1.0
const TRIM_TAIL_BUFFER_S = 1.0

;(async () => {
  if (!fs.existsSync(path.join(DEMO_DIR, HTML_FILE))) {
    console.error('Missing HTML at', path.join(DEMO_DIR, HTML_FILE))
    process.exit(1)
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const { server, url: serverUrl } = await startServer(DEMO_DIR)
  console.log('[render] serving', DEMO_DIR, 'at', serverUrl)

  // 1920x1080 canvas + 44px playback bar (hidden by css injection below).
  const viewport = { width: 1920, height: 1124 }

  const browser = await chromium.launch({ headless: true })
  const recordStartedAt = Date.now()
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT_DIR, size: viewport },
  })
  const page = await context.newPage()
  page.on('console', (msg) => console.log('[page]', msg.type(), msg.text()))
  page.on('pageerror', (err) => console.log('[pageerror]', err.message))
  page.on('requestfailed', (req) => console.log('[requestfailed]', req.url(), req.failure()?.errorText))

  // Clear the persisted playhead so the stage starts from t=0 on mount.
  await page.addInitScript(() => {
    try { localStorage.clear() } catch {}
  })

  console.log('[render] loading', serverUrl)
  await page.goto(serverUrl, { waitUntil: 'networkidle', timeout: 60_000 })

  // Solid-fill the background. We intentionally do NOT hide the Stage's
  // playback bar: when it's display:none the flex layout re-centers the
  // 1080-tall canvas inside the 1124-tall wrapper, producing a 22px black
  // band at the top that bleeds into our crop. Leaving the bar visible
  // keeps the canvas flush with (0,0); the ffmpeg crop (1920x1080 from 0,0)
  // excludes the bar cleanly.
  await page.addStyleTag({
    content: `
      html, body { background: #020617 !important; overflow: hidden !important; }
    `,
  })

  // Wait for React to render the Stage (Babel needs to compile in-browser).
  await page.waitForFunction(() => !!document.querySelector('#root > div'), null, { timeout: 60_000 })
  // Wait for web fonts so text paints in the final typeface.
  await page.evaluate(() => document.fonts?.ready).catch(() => {})

  // Detect animation t=0 wall-clock by observing the Stage's persisted playhead.
  const DETECT_AT_S = 0.1
  await page.waitForFunction(
    (threshold) => {
      try {
        return parseFloat(localStorage.getItem('shieldra-video:t') || '0') >= threshold
      } catch { return false }
    },
    DETECT_AT_S,
    { timeout: 30_000 },
  )
  const detectedAt = Date.now()
  const animStartOffsetMs = detectedAt - recordStartedAt - DETECT_AT_S * 1000
  console.log(
    `[render] animation t=0 at webm offset ${(animStartOffsetMs / 1000).toFixed(2)}s`,
  )

  // Record until animation finishes + tail buffer.
  const recordingEndsAt = recordStartedAt + animStartOffsetMs + (ANIMATION_DURATION_S + TRIM_TAIL_BUFFER_S) * 1000
  const remainingMs = Math.max(0, recordingEndsAt - Date.now())
  console.log(`[render] recording ${(remainingMs / 1000).toFixed(1)}s more`)
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
  const finalPath = path.join(OUT_DIR, 'demo.webm')
  fs.renameSync(rawPath, finalPath)
  console.log('[render] wrote', finalPath, `(${(fs.statSync(finalPath).size / 1_048_576).toFixed(1)} MB)`)

  // Emit trim plan: skip TRIM_HEAD_S into the animation to avoid compositor
  // paint artifacts during Chromium's first frames; keep full remaining length.
  const finalDuration = ANIMATION_DURATION_S - TRIM_HEAD_S
  const meta = {
    webm: finalPath,
    animStartOffsetSec: animStartOffsetMs / 1000,
    ffmpegSeekSec: Math.max(0, (animStartOffsetMs + TRIM_HEAD_S * 1000) / 1000),
    durationSec: finalDuration,
  }
  fs.writeFileSync(path.join(OUT_DIR, 'demo.render.json'), JSON.stringify(meta, null, 2))
  console.log('[render] trim plan:', meta)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
