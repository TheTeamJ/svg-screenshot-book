const puppeteer = require('puppeteer')
const AnchorsInArea = require('anchors-in-area')

async function capture ({ url, viewport, range }) {
  const browser = await puppeteer.launch({ hedless: true })
  const page = await browser.newPage()
  await page.goto(url, {
    timeout: 30 * 1000,
    waitUntil: 'networkidle0'
  })
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 2.0
  })

  // (ア)
  const anchors = await page.evaluate(AnchorsInArea.getAnchors, JSON.stringify(range))
  const backgroundImageFilePath = './chap2/out/background.png'

  const title = await page.title()
  await page.screenshot({
    clip: range,
    path: backgroundImageFilePath
  })
  browser.close()

  return {
    title,
    width: range.width,
    height: range.height,
    anchors,
    backgroundImageFilePath
  }
}

module.exports = { capture }
