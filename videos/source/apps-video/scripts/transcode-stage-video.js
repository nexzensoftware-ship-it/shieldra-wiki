/* eslint-disable */
// Transcodes a recorded stage webm to MP4 at YouTube-friendly settings.
//
// Required env:
//   STAGE_SLUG   — matches the slug used by render-stage-video.js
//   STAGE_OUTPUT — absolute output path for the MP4
// Optional env:
//   STAGE_CRF     — H.264 CRF quality (default 18, visually lossless-ish)
//   STAGE_PRESET  — x264 preset (default "slow")
//   STAGE_SILENT_AUDIO — "1" to mux a silent AAC track so YouTube/players
//                        that expect an audio stream don't choke (default off).
//   STAGE_AUDIO_TRACK  — path to an MP3/WAV/AAC narration track to mux as
//                        the MP4's audio; aligned to MP4 t=0. Overrides
//                        STAGE_SILENT_AUDIO when set.
//   STAGE_AUDIO_OFFSET — seconds of silence to prepend to the audio track
//                        (defaults to 0). Use this when the narration spec
//                        was timed against the un-trimmed animation while
//                        the rendered MP4 starts after the head trim.

const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process')

const SLUG = process.env.STAGE_SLUG
const TARGET = process.env.STAGE_OUTPUT
if (!SLUG || !TARGET) {
  console.error('Set STAGE_SLUG and STAGE_OUTPUT')
  process.exit(1)
}

const OUT_DIR = path.resolve(__dirname, '..', 'out')
const META_PATH = path.join(OUT_DIR, `${SLUG}.render.json`)
const WEBM_PATH = path.join(OUT_DIR, `${SLUG}.webm`)

if (!fs.existsSync(META_PATH) || !fs.existsSync(WEBM_PATH)) {
  console.error(`Missing ${META_PATH} or ${WEBM_PATH}. Run render-stage-video.js first.`)
  process.exit(1)
}

const meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'))
const seek = Number(meta.ffmpegSeekSec || 0).toFixed(3)
const duration = Number(meta.durationSec || 0).toFixed(3)

const crf = process.env.STAGE_CRF || '18'
const preset = process.env.STAGE_PRESET || 'slow'
const audioTrack = process.env.STAGE_AUDIO_TRACK || ''
const audioOffsetSec = Number(process.env.STAGE_AUDIO_OFFSET || 0)
const withSilentAudio = !audioTrack && process.env.STAGE_SILENT_AUDIO === '1'

if (audioTrack && !fs.existsSync(audioTrack)) {
  console.error('STAGE_AUDIO_TRACK not found at', audioTrack)
  process.exit(1)
}

fs.mkdirSync(path.dirname(TARGET), { recursive: true })

console.log(`[transcode] ${SLUG}: seek=${seek}s duration=${duration}s crf=${crf} preset=${preset}`)
if (audioTrack) console.log(`[transcode] mux audio: ${audioTrack} (offset ${audioOffsetSec}s)`)
else if (withSilentAudio) console.log('[transcode] silent AAC track')
else console.log('[transcode] no audio (-an)')
console.log(`[transcode] -> ${TARGET}`)

const args = ['-y']
// Audio source first, video second — keeps the input indexes stable below.
if (audioTrack) {
  if (audioOffsetSec > 0) {
    args.push('-itsoffset', String(audioOffsetSec))
  }
  args.push('-i', audioTrack)
} else if (withSilentAudio) {
  args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000')
}
args.push(
  '-ss', seek,
  '-i', WEBM_PATH,
  '-t', duration,
  '-vf', 'crop=1920:1080:0:0',
  '-c:v', 'libx264',
  '-preset', preset,
  '-crf', crf,
  '-pix_fmt', 'yuv420p',
  '-profile:v', 'high',
  '-level', '4.1',
  '-movflags', '+faststart',
  '-r', '30',
)
if (audioTrack || withSilentAudio) {
  args.push(
    '-map', '1:v:0',
    '-map', '0:a:0',
    '-c:a', 'aac',
    '-b:a', audioTrack ? '192k' : '128k',
    '-ar', '48000',
    '-shortest',
  )
} else {
  args.push('-an')
}
args.push(TARGET)

const res = spawnSync('ffmpeg', args, { stdio: 'inherit' })
process.exit(res.status ?? 1)
