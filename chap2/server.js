// node chap2/server.js
const express = require('express');
const fsPromises = require('fs').promises
const { capture } = require('./capture_page');
const { captureTweet } = require('./capture_page_with_selector');
const { parseOptions } = require('./lib');
const { createSVGTag } = require('./svg-screenshot');

const app = express();

app.get('/range/:range/viewport/:viewport', async (req, res) => {
  const { viewport, range } = req.params;
  const url = req.query.url;
  console.log('received:', url)
  const options = parseOptions({ url, range, viewport });

  // コード2.1で定義したcapture関数を実行してSVG画像を保存する
  const { title, width, height, anchors, backgroundImageFilePath } = await capture(options);

  // SVG画像を組み立てて返却する
  const image = await fsPromises.readFile(backgroundImageFilePath, 'base64');
  const svgStr = createSVGTag({
    width,
    height,
    image,
    url,
    title: decodeURIComponent(title),
    anchors
  });
  res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
  res.end(svgStr);
});


// コード2.5に対応
// ex) http://localhost:8080/capture/twitter/daizplus/1200084117951434753
app.get('/capture/twitter/:username/:tweetId', async (req, res) => {
  const { username, tweetId } = req.params
  console.log('received:', username, tweetId)

  const url = `https://twitter.com/${username}/status/${tweetId}`
  const { width, height, anchors, backgroundImageFilePath } = await captureTweet(url)

  const image = await fsPromises.readFile(backgroundImageFilePath, 'base64')
  const svgStr = createSVGTag({
    width,
    height,
    image,
    url,
    title: `@${username} (${tweetId})`,
    anchors
  })
  res.writeHead(200, { 'Content-Type': 'image/svg+xml' })
  res.end(svgStr)
})


app.listen(8080);
