// Mermaid rendering wrapper: config building, rendering, error normalisation.
import mermaid from 'mermaid';
import elkLayouts from '@mermaid-js/layout-elk';
import { getPreset } from './themes.js';

mermaid.registerLayoutLoaders(elkLayouts);

// Icon packs for architecture diagrams (loaded lazily only when referenced, e.g. `logos:aws-lambda`).
mermaid.registerIconPacks([
  { name: 'logos', loader: () => fetch('https://unpkg.com/@iconify-json/logos@1/icons.json').then((r) => r.json()) },
  { name: 'mdi', loader: () => fetch('https://unpkg.com/@iconify-json/mdi@1/icons.json').then((r) => r.json()) },
]);

export const DEFAULT_STYLE = {
  theme: 'auto',
  preset: '',
  look: 'classic',
  layout: 'elk',
  curve: 'basis',
  fontFamily: '',
  fontSize: 16,
  themeVariables: {},
};

function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  const out = Array.isArray(target) ? [...target] : { ...target };
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof out[k] === 'object' && out[k] !== null) {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export function parseUserConfig(json) {
  if (!json || !json.trim()) return { ok: true, value: {} };
  try {
    const value = JSON.parse(json);
    if (typeof value !== 'object' || Array.isArray(value)) throw new Error('Config harus berupa objek JSON');
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: e.message, value: {} };
  }
}

/** Whether the resulting diagram has a dark background. */
export function isDarkStyle(style) {
  const preset = getPreset(style.preset);
  if (preset) return !!preset.dark;
  if (style.theme === 'auto') {
    return document.documentElement.dataset.theme === 'dark';
  }
  return style.theme === 'dark';
}

export function buildConfig(style = DEFAULT_STYLE, userConfig = {}) {
  const s = { ...DEFAULT_STYLE, ...style };
  const preset = getPreset(s.preset);
  const themeVariables = {
    ...(preset ? preset.vars : {}),
    ...(s.themeVariables || {}),
  };
  if (s.fontFamily) themeVariables.fontFamily = s.fontFamily;
  if (s.fontSize) themeVariables.fontSize = `${s.fontSize}px`;

  const hasCustomVars = Object.keys(s.themeVariables || {}).length > 0;
  const base = {
    startOnLoad: false,
    securityLevel: 'strict',
    // Mermaid only honours most themeVariables on the `base` theme.
    theme: preset || hasCustomVars ? 'base' : (s.theme === 'auto' ? (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default') : s.theme),
    look: s.look,
    layout: s.layout,
    themeVariables,
    flowchart: { curve: s.curve, htmlLabels: true },
    deterministicIds: false,
    suppressErrorRendering: true,
  };
  if (preset && preset.dark) base.darkMode = true;
  return deepMerge(base, userConfig);
}

let counter = 0;
let queue = Promise.resolve();

function cleanupTemp(id) {
  document.getElementById(id)?.remove();
  document.getElementById(`d${id}`)?.remove();
  document.getElementById(`i${id}`)?.remove();
}

/** Number of source lines that mermaid strips before handing text to the parser (frontmatter). */
function strippedLineOffset(code) {
  const m = code.replace(/\r\n/g, '\n').match(/^\s*---\n[\s\S]*?\n---\s*\n/);
  return m ? m[0].split('\n').length - 1 : 0;
}

export function normalizeError(err, code) {
  let message = (err && (err.message || err.str)) || String(err);
  message = message.replace(/^Error:\s*/, '');
  let line = null;
  const hashLine = err?.hash?.loc?.first_line ?? err?.hash?.line;
  if (typeof hashLine === 'number') line = hashLine + (err.hash.loc ? 0 : 1);
  if (line == null) {
    const m = message.match(/line[:\s]+(\d+)/i);
    if (m) line = parseInt(m[1], 10);
  }
  if (line != null) line += strippedLineOffset(code);
  return { message: message.trim(), line };
}

/**
 * Render mermaid code to SVG. Calls are serialised because mermaid uses global config state.
 * @returns {Promise<{ok:boolean, svg?:string, bindFunctions?:Function, diagramType?:string, time:number, error?:{message:string,line:number|null}}>}
 */
export function renderDiagram(code, config) {
  const job = queue.then(async () => {
    const t0 = performance.now();
    const id = `ms-svg-${++counter}`;
    try {
      mermaid.initialize(config);
      await mermaid.parse(code);
      const { svg, bindFunctions, diagramType } = await mermaid.render(id, code);
      return { ok: true, svg, bindFunctions, diagramType, time: performance.now() - t0 };
    } catch (err) {
      cleanupTemp(id);
      return { ok: false, error: normalizeError(err, code), time: performance.now() - t0 };
    }
  });
  queue = job.catch(() => {});
  return job;
}

export { mermaid };
