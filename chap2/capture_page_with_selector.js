const puppeteer = require('puppeteer')
const AnchorsInArea = require('anchors-in-area')

function formatRange ({ x, y, width, height, diff }) {
  x += diff.x
  y += diff.y
  return {
    x,
    y,
    width,
    height,
    scroll: { x, y },
    page: {
      left: x,
      top: y,
    }
  }
}

async function getPageSizes (page) {
  // ページ全体の高さを取得して、画面のheightに指定することでscrollしなくて済む
  // ただし無限スクロールによるコンテンツの継ぎ足しには対応していない
  return await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.scrollHeight
  ])
}

async function captureWithSelector (url, selector, diff) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, { timeout: 30 * 1000, waitUntil: 'networkidle0'})
  await page.waitFor(500)

  const [width, height] = await getPageSizes(page)
  await page.setViewport({
    width,
    height: Math.max(6000, height),
    deviceScaleFactor: 2
  })

  const range = await page.evaluate(s => {
    const elem = document.querySelector(s)
    if (!elem) return {}
    const { left: x, top: y, width, height } = elem.getBoundingClientRect()
    return { x, y, width, height }
  }, selector)
  range.diff = diff

  const backgroundImageFilePath = `./chap2/out/tweet.png`
  const anchors = await page.evaluate(
    AnchorsInArea.getAnchors, JSON.stringify(formatRange(range)))
  const buf = await page.screenshot({
    clip: {
      x: range.x + diff.x,
      y: range.y + diff.y,
      width: range.width + diff.w,
      height: range.height + diff.h
    },
    path: backgroundImageFilePath
  })
  browser.close()

  return {
    width: range.width + diff.w,
    height: range.height + diff.h,
    backgroundImageFilePath,
    anchors
  }
}

async function captureTweet (url) {
  const { width, height, backgroundImageFilePath, anchors } = await captureWithSelector(
    url, '.permalink-inner', { x: 10, y: 10, w: -20, h: -10 }, 2000)
  return {
    title: 'tweet',
    width,
    height,
    anchors,
    backgroundImageFilePath,
  }
}

module.exports = { captureTweet }
