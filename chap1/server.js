// node chap1/server.js
const express = require('express');
const app = express();

app.get('/today.svg', (req, res) => {
  const now = new Date();
  const date = now.getDate();
  const day = '日月火水木金土'.charAt(now.getDay());
  res.writeHead(200, { 'Content-Type': 'image/svg+xml' });

  res.end(`<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 300" width="400" height="300">
    <rect x="10" y="10" width="380" height="280" fill="#D5EBE7" />
    <text x="50%" y="160" font-weight="600" font-size="160"
        text-anchor="middle" fill="#000">${date}</text>
    <text x="50%" y="260" font-weight="600" font-size="80"
        text-anchor="middle" fill="#000">${day}</text>
    </svg>`);
});

app.listen(8080);
