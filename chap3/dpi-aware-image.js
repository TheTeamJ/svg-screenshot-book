class DpiAwareImage extends HTMLElement {
  constructor () {
    super();
    this.render();
  }

  static get is () {
    return 'dpi-aware-image';
  }

  static get observedAttributes () {
    return ['src'];
  }

  async attributeChangedCallback (attr, oldVal, newVal) {
    if (oldVal === newVal) return;
    switch (attr) {
      case 'src': {
        if (!newVal) return;
        const { width, height } = await getImageSize(newVal);
        this.renderSvg(newVal, { width, height });
        break;
      }
    }
  }

  renderSvg (srcUrl, { width, height }) {
    const viewBox = `0 0 ${width} ${height}`;
    const span = this.root.querySelector('#svg-area');
    span.innerHTML = `
      <svg id='dpi-aware-image'
        width='${width}' height='${height}' viewBox='${viewBox}'>
        <foreignObject x='0' y='0' width='${width}' height='${height}'>
          <img width='100%' height='100%' src='${srcUrl}' />
        </foreignObject>
      </svg>
    `;
  }

  render () {
    this.root = this.attachShadow({ mode: 'open' });
    this.root.innerHTML = `
      <style>
        #dpi-aware-image {
          width: auto;
          height: auto;
          max-width: var(--max-width);
          max-height: var(--max-height);
          display: block;
        }
        #dpi-aware-image img {
          display: block;
        }
      </style>
      <span id='svg-area'></span>`;
  }
}

window.customElements.define(DpiAwareImage.is, DpiAwareImage);
