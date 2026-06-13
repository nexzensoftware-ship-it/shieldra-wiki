#!/usr/bin/env node
/**
 * Render an HTML thumbnail to PNG (1280x720, YouTube standard).
 *
 * Usage: node scripts/render-thumbnail.js <input.html> <output.png>
 */
const { chromium } = require('playwright')
const path = require('path')

const [, , input, output] = process.argv
if (!input || !output) {
  console.error('Usage: node render-thumbnail.js <input.html> <output.png>')
  process.exit(1)
}

;(async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto('file://' + path.resolve(input))
  // Wait for fonts (Inter / JetBrains Mono) to load before snapping
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.resolve(output), type: 'png', fullPage: false })
  await browser.close()
  console.log(`Wrote ${output}`)
})().catch((err) => { console.error(err); process.exit(1) })
