const fs = require('fs').promises;
const express = require('express');
const app = express();

app.get('/content-dpr/sample.png', async (req, res) => {
  const buf = await fs.readFile('./chap3/sample/retina_sample.png');
  res.set({
    'Content-Type': 'image/png',
    'Content-DPR': 2.0
  });
  res.send(buf);
});

app.listen(8080);
