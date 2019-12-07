const toBin = (value, digits) => value.toString(2).padStart(digits, '0')

const toHex = (value, digits) => value.toString(16).padStart(digits, '0')

function isPng (byteArray, ptr) {
  const pngSignature = '89 50 4E 47 0D 0A 1A 0A'
  const signature = readBytes(byteArray, ptr, 8).map(v => toHex(v, 2))
  return signature.join(' ').toUpperCase() === pngSignature
}

function readBytes (byteArray, ptr, byteLength) {
  const {pos} = ptr
  const res = byteArray.slice(pos, pos + byteLength)
  ptr.pos += byteLength
  return Array.from(res)
}

function readIHDR (byteArray, ptr) {
  // https://tools.ietf.org/html/rfc2083#page-15
  // Length, ChunkType
  ptr.pos += (4 + 4)
  let width = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8))
  width = parseInt(width.join(''), 2)
  let height = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8))
  height = parseInt(height.join(''), 2)
  // Bit depth, Color type, Compression method, Filter method, nterlace method, CRC
  ptr.pos += (1 + 1 + 1 + 1 + 1 + 4)
  return {width, height}
}

function getCharCodes (str) {
  return str.split('').map(c => c.charCodeAt(0)).join(' ')
}

function parsePngFormat (arrayBuffer) {
  const ptr = {pos: 0}
  const byteArray = new Uint8Array(arrayBuffer)
  return readChunks(byteArray, ptr)
}

const readpHYs = (byteArray, ptr) => {
  // https://tools.ietf.org/html/rfc2083#page-22
  const pixelsPerUnitXAxis = parseInt(
    readBytes(byteArray, ptr, 4).map(v => toBin(v, 8)).join(''), 2)
  const pixelsPerUnitYAxis = parseInt(
    readBytes(byteArray, ptr, 4).map(v => toBin(v, 8)).join(''), 2)
  const unitSpecifier = readBytes(byteArray, ptr, 1).pop()
  let dpi = 72
  if (unitSpecifier === 1) {
    // dots per inch を計算する
    dpi = Math.floor(Math.max(pixelsPerUnitXAxis, pixelsPerUnitYAxis) / (unitSpecifier * 39.3))
  }
  return dpi
}

const readChunks = (byteArray, ptr) => {
  if (!isPng(byteArray, ptr)) {
    return {
      width: undefined,
      height: undefined,
      dpi: undefined
    }
  }
  const {width, height} = readIHDR(byteArray, ptr)
  let dpi
  while (true) {
    if (ptr.pos >= byteArray.length) break

    let chunkLength = readBytes(byteArray, ptr, 4).map(v => toBin(v, 8))
    chunkLength = parseInt(chunkLength.join(''), 2)

    const chunkType = readBytes(byteArray, ptr, 4).join(' ')
    if (chunkType === getCharCodes('IDAT') || chunkType === getCharCodes('IEND')) break
    switch (chunkType) {
      case getCharCodes('pHYs'):
        dpi = readpHYs(byteArray, ptr)
        break
      default:
        ptr.pos += chunkLength
    }
    ptr.pos += 4 // CRC
  }
  return {width, height, dpi}
}
