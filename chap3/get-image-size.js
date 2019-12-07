async function getImageSize (srcUrl) {
  try {
    const res = await fetch(srcUrl, { mode: 'cors' });
    const buf = await res.arrayBuffer();
    const { width, height, dpi } = parsePngFormat(buf);
    const dpr = dpi / 72;

    const naturalSize = {
      width : width / dpr,
      height: height / dpr
    };
    return naturalSize;
  } catch (err) {
    throw err;
  }
}
