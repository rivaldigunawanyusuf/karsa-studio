// Share-link encoding compatible with mermaid.live / mermaid.ink ("pako:" + base64url(deflate(json))).
import { deflate, inflate } from 'pako';

function toBase64Url(bytes) {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Encode a diagram into the `pako:...` token used by mermaid.live and mermaid.ink. */
export function encodeState({ code, theme = 'auto', name } = {}) {
  const state = {
    code,
    mermaid: JSON.stringify({ theme }, null, 2),
    autoSync: true,
    updateDiagram: true,
    ...(name ? { name } : {}),
  };
  const data = new TextEncoder().encode(JSON.stringify(state));
  return `pako:${toBase64Url(deflate(data, { level: 9 }))}`;
}

export function decodeState(token) {
  const raw = token.replace(/^#/, '');
  if (raw.startsWith('pako:')) {
    const json = new TextDecoder().decode(inflate(fromBase64Url(raw.slice(5))));
    return JSON.parse(json);
  }
  if (raw.startsWith('base64:')) {
    return JSON.parse(new TextDecoder().decode(fromBase64Url(raw.slice(7))));
  }
  throw new Error('Format link tidak dikenali');
}

export function buildLinks(doc) {
  const token = encodeState({ code: doc.code, theme: doc.style?.theme || 'auto', name: doc.name });
  const base = `${location.origin}${location.pathname}`;
  return {
    token,
    edit: `${base}#${token}`,
    view: `${base}#view/${token}`,
    mermaidLive: `https://mermaid.live/edit#${token}`,
    inkSvg: `https://mermaid.ink/svg/${token}`,
    inkPng: `https://mermaid.ink/img/${token}?type=png`,
  };
}

/** Parse the current location hash. Returns { mode: 'edit'|'view', state } or null. */
export function readHash() {
  const h = location.hash.slice(1);
  if (!h) return null;
  try {
    if (h.startsWith('view/')) return { mode: 'view', state: decodeState(h.slice(5)) };
    if (h.startsWith('pako:') || h.startsWith('base64:')) return { mode: 'edit', state: decodeState(h) };
    // mermaid.live style "#/edit/pako:..." or "#/view/pako:..."
    const m = h.match(/^\/?(edit|view)\/(.+)$/);
    if (m) return { mode: m[1], state: decodeState(m[2]) };
  } catch (e) {
    console.warn('Link share tidak valid', e);
  }
  return null;
}
