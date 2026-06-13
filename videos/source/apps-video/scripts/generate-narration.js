#!/usr/bin/env node
/**
 * Generate narration for a Shieldra video using the default voice from
 * voice-config.json. Reads a narration spec, runs edge-tts per scene,
 * then stitches the per-scene MP3s into a single track placed at each
 * scene's start time.
 *
 * Usage:
 *   node scripts/generate-narration.js <narration-spec.json>
 *
 * Spec format:
 * {
 *   "name": "what-is-hipaa",
 *   "totalDurationSec": 180,
 *   "outputDir": "What is HIPAA_/audio",     // relative to apps/video/
 *   "trackOutput": "out/what-is-hipaa-narration.mp3",
 *   "scenes": [
 *     { "id": "title", "start": 5, "end": 13, "text": "..." },
 *     { "id": "definition", "start": 13, "end": 30, "text": "...", "rate": "+0%" }
 *   ]
 * }
 *
 * `rate` per scene is optional and overrides the default.
 *
 * Requires: uvx (uv installed at ~/.local/bin/uvx) and ffmpeg on PATH.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const VIDEO_ROOT = path.resolve(__dirname, '..')
const CONFIG = JSON.parse(fs.readFileSync(path.join(VIDEO_ROOT, 'voice-config.json'), 'utf8'))

const specPath = process.argv[2]
if (!specPath) {
  console.error('Usage: node generate-narration.js <narration-spec.json>')
  process.exit(1)
}

const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const outputDir = path.resolve(VIDEO_ROOT, spec.outputDir)
fs.mkdirSync(outputDir, { recursive: true })

// Make sure uvx is reachable even when PATH doesn't include ~/.local/bin
const env = { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH}` }

console.log(`Voice: ${CONFIG.voice}  Rate: ${CONFIG.rate}`)
console.log(`Generating ${spec.scenes.length} scene(s) → ${outputDir}`)

// 1) Generate per-scene MP3s.
for (const scene of spec.scenes) {
  const file = path.join(outputDir, `scene_${scene.id}.mp3`)
  const rate = scene.rate ?? CONFIG.rate
  // edge-tts uses argparse, which interprets a leading '-' as a new flag.
  // Pass rate/volume/pitch as `--name=value` so argparse keeps them attached.
  const cmd = [
    'uvx', 'edge-tts',
    '--voice', CONFIG.voice,
    `--rate=${rate}`,
    `--volume=${CONFIG.volume}`,
    `--pitch=${CONFIG.pitch}`,
    '--text', JSON.stringify(scene.text),
    '--write-media', JSON.stringify(file),
  ].join(' ')
  execSync(cmd, { env, stdio: 'inherit' })
}

// 2) Probe each scene's actual duration so we can gate sequentially. TTS
//    rendering varies in real length, so the spec's `start` is the EARLIEST
//    a scene may begin — if the prior scene is still playing we push it later.
const SCENE_GAP_MS = 150
const probeDuration = (file) => {
  const out = execSync(
    `ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`,
    { env },
  ).toString().trim()
  return parseFloat(out)
}

const scheduled = []
let cursorMs = 0
for (const scene of spec.scenes) {
  const file = path.join(outputDir, `scene_${scene.id}.mp3`)
  const dur = probeDuration(file)
  const desiredMs = Math.round(scene.start * 1000)
  const startMs = Math.max(desiredMs, cursorMs)
  if (startMs > desiredMs) {
    const slip = (startMs - desiredMs) / 1000
    console.warn(`[narration] '${scene.id}' delayed ${slip.toFixed(2)}s to avoid overlap (would have collided with previous scene's tail)`)
  }
  scheduled.push({ ...scene, file, durSec: dur, startMs, endMs: startMs + Math.round(dur * 1000) })
  cursorMs = startMs + Math.round(dur * 1000) + SCENE_GAP_MS
}

const totalSpeechMs = cursorMs
const totalDurationMs = Math.round(spec.totalDurationSec * 1000)
if (totalSpeechMs > totalDurationMs) {
  console.warn(`[narration] speech runs ${(totalSpeechMs / 1000).toFixed(2)}s but spec is ${spec.totalDurationSec}s — final ${((totalSpeechMs - totalDurationMs) / 1000).toFixed(2)}s of speech will be cut off.`)
}

// 3) Stitch sequentially. Because we've eliminated overlap, amix is safe and
//    the output is guaranteed to play one voice at a time.
const inputs = scheduled.map((s) => `-i "${s.file}"`).join(' ')
const filters = scheduled
  .map((s, i) => `[${i}:a]adelay=${s.startMs}|${s.startMs}[a${i}]`)
  .join('; ')
const mixInputs = scheduled.map((_, i) => `[a${i}]`).join('')
const trackOut = path.resolve(VIDEO_ROOT, spec.trackOutput)
fs.mkdirSync(path.dirname(trackOut), { recursive: true })

const ffmpegCmd = [
  'ffmpeg', '-y', inputs,
  '-filter_complex', `"${filters}; ${mixInputs}amix=inputs=${scheduled.length}:duration=longest:normalize=0[out]"`,
  '-map', '"[out]"',
  '-t', spec.totalDurationSec,
  '-c:a', 'libmp3lame', '-b:a', '192k', '-ar', '44100',
  `"${trackOut}"`,
].join(' ')

execSync(ffmpegCmd, { env, stdio: 'inherit' })
console.log(`\nNarration track: ${trackOut}`)
console.log('Schedule:')
for (const s of scheduled) {
  console.log(`  ${s.id.padEnd(12)} ${(s.startMs / 1000).toFixed(2)}s → ${(s.endMs / 1000).toFixed(2)}s  (${s.durSec.toFixed(2)}s speech)`)
}
