/* eslint-disable */
// Transcodes the recorded webm to the landing page's public MP4, trimming
// leading boot-phase frames based on the offset written by render-demo.js.

const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'out')
const META_PATH = path.join(OUT_DIR, 'demo.render.json')
const WEBM_PATH = path.join(OUT_DIR, 'demo.webm')
const TARGET_MP4 = path.resolve(ROOT, '..', 'landing', 'public', 'demo.mp4')

if (!fs.existsSync(META_PATH) || !fs.existsSync(WEBM_PATH)) {
  console.error('Missing render artifacts. Run `node scripts/render-demo.js` first.')
  process.exit(1)
}

const meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'))
const seek = Number(meta.ffmpegSeekSec || 0).toFixed(3)
const duration = Number(meta.durationSec || 128).toFixed(3)

console.log(`[transcode] seek=${seek}s duration=${duration}s`)
console.log(`[transcode] -> ${TARGET_MP4}`)

const args = [
  '-y',
  '-ss', seek,
  '-i', WEBM_PATH,
  '-t', duration,
  '-vf', 'crop=1920:1080:0:0',
  '-c:v', 'libx264',
  '-preset', 'slow',
  '-crf', '23',
  '-pix_fmt', 'yuv420p',
  '-profile:v', 'high',
  '-level', '4.1',
  '-movflags', '+faststart',
  '-an',
  TARGET_MP4,
]

const res = spawnSync('ffmpeg', args, { stdio: 'inherit' })
process.exit(res.status ?? 1)
