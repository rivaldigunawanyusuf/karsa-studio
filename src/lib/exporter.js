// Export helpers: SVG / PNG / JPEG / PDF / clipboard.

export function svgDimensions(svgString) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;
  const vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
  let width = vb[2];
  let height = vb[3];
  if (!width || !height) {
    width = parseFloat(svg.getAttribute('width')) || 800;
    height = parseFloat(svg.getAttribute('height')) || 600;
  }
  return { width, height };
}

/**
 * Inlines CSS from <style> blocks into style="..." attributes
 * so vector editors (Figma, Illustrator) can render colors.
 */
function inlineSvgStyles(svg) {
  const styles = svg.querySelectorAll('style');
  let cssText = '';
  styles.forEach(s => { cssText += s.textContent + '\n'; });
  
  // Remove CSS comments
  cssText = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  
  const svgId = svg.getAttribute('id');
  const cssRegex = /([^{]+)\s*\{\s*([^}]+)\s*\}/g;
  let match;
  while ((match = cssRegex.exec(cssText)) !== null) {
    let selectors = match[1].split(',').map(s => s.trim());
    let declarations = match[2].trim().replace(/\n/g, ' ');
    if (!declarations) continue;
    
    selectors.forEach(selector => {
      // Ignore pseudo-classes, pseudo-elements, media queries
      if (selector.includes(':') || selector.startsWith('@')) return;
      
      // Strip out the SVG's own ID from the selector if present
      if (svgId) {
        const idRegex = new RegExp(`^#${svgId}\\s*`);
        selector = selector.replace(idRegex, '');
      }
      
      if (!selector) return;
      
      try {
        const els = svg.querySelectorAll(selector);
        els.forEach(el => {
          el.style.cssText += ';' + declarations;
        });
        
        if (svg.matches && svg.matches(selector)) {
          svg.style.cssText += ';' + declarations;
        }
      } catch (e) {
        // Ignore invalid selectors
      }
    });
  }
}

/**
 * Produce a standalone SVG string with explicit size and optional background.
 */
export function standaloneSvg(svgString, { background = null, padding = 0 } = {}) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;
  const { width, height } = svgDimensions(svgString);
  const vb = (svg.getAttribute('viewBox') || `0 0 ${width} ${height}`).split(/[\s,]+/).map(Number);
  const [x, y] = vb;
  const w = width + padding * 2;
  const h = height + padding * 2;
  svg.setAttribute('viewBox', `${x - padding} ${y - padding} ${w} ${h}`);
  svg.setAttribute('width', String(w));
  svg.setAttribute('height', String(h));
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svg.style.maxWidth = '';
  svg.style.removeProperty('max-width');
  if (background) {
    const rect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(x - padding));
    rect.setAttribute('y', String(y - padding));
    rect.setAttribute('width', String(w));
    rect.setAttribute('height', String(h));
    rect.setAttribute('fill', background);
    svg.insertBefore(rect, svg.firstChild);
  }
  
  inlineSvgStyles(svg);
  
  return new XMLSerializer().serializeToString(svg);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal memuat SVG ke gambar'));
    img.src = src;
  });
}

export async function svgToCanvas(svgString, { scale = 2, background = null, padding = 16 } = {}) {
  const svg = standaloneSvg(svgString, { padding });
  const { width, height } = svgDimensions(svg);
  const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  const canvas = document.createElement('canvas');
  const maxSide = 16384;
  const s = Math.min(scale, maxSide / width, maxSide / height);
  canvas.width = Math.round(width * s);
  canvas.height = Math.round(height * s);
  const ctx = canvas.getContext('2d');
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function canvasToBlob(canvas, type = 'image/png', quality = 0.95) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Gagal membuat gambar'))), type, quality);
    } catch (e) {
      reject(e);
    }
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadText(text, filename, mime = 'text/plain') {
  downloadBlob(new Blob([text], { type: `${mime};charset=utf-8` }), filename);
}

export async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

export async function copyImage(blobPromise) {
  if (!window.ClipboardItem) throw new Error('Browser tidak mendukung salin gambar');
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blobPromise })]);
}

export function printSvgAsPdf(svgString, title = 'diagram', background = '#ffffff') {
  const svg = standaloneSvg(svgString, { padding: 24, background });
  const { width, height } = svgDimensions(svg);
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  document.body.appendChild(iframe);
  const d = iframe.contentDocument;
  d.open();
  d.write(`<!doctype html><html><head><title>${title.replace(/</g, '')}</title>
<style>
  @page { size: ${Math.ceil(width)}px ${Math.ceil(height)}px; margin: 0; }
  html, body { margin: 0; padding: 0; background: ${background}; }
  svg { display: block; width: 100vw; height: auto; }
</style></head><body>${svg}</body></html>`);
  d.close();
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => iframe.remove(), 1500);
  }, 250);
}

export function safeFilename(name) {
  return (name || 'diagram').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'diagram';
}
