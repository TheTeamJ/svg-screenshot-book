const fs = require('fs').promises;
const express = require('express');
const app = express();

app.get('/miilnow.svg', async (req, res) => {
  const data = await fs.readFile('./chap1/pancake.jpg', 'base64');

  res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
  res.end(`<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 500 500" width="500" height="500">
    <image xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0" y="0" width="500" height="500"
      xlink:href="data:image/jpeg;base64,${data}"></image>
    </svg>`);
});

app.listen(8080);
