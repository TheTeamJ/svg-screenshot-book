const parseOptions = ({ url, range, viewport }) => {
  range = range.replace(/-/g, ',')
  viewport = viewport.replace(/-/g, ',')
  range = (range || '0,0,300,300').split(',').map(px => parseInt(px.trim()))
  const win = (viewport || '600,400').split(',').map(px => parseInt(px.trim()))
  const res = {
    url,
    range: {
      x: range[0],
      y: range[1],
      width: range[2],
      height: range[3],
      scroll: {
        x: range[0],
        y: range[1]
      },
      page: {
        left: range[0],
        top: range[1],
      }
    },
    viewport: {
      width: win[0],
      height: Math.max(win[1], (range[1] + range[3]))
    }
  }
  return res
}

module.exports = { parseOptions }
