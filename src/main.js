/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MERMAID STUDIO - Main Application
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import './styles/index.css';
import { store } from './lib/store.js';
import { LANGUAGES, translateDocument, t } from './lib/i18n.js';
import { createMermaidEditor, createJsonEditor } from './lib/editor.js';
import { renderDiagram, buildConfig, parseUserConfig, DEFAULT_STYLE, isDarkStyle } from './lib/renderer.js';
import { TEMPLATES, TEMPLATE_CATEGORIES } from './lib/templates.js';
import { MERMAID_THEMES, PRESETS, CURVES, FONTS, COLOR_VARS, getPreset } from './lib/themes.js';
import { SNIPPETS_BY_TYPE, detectDiagramType, TYPE_LABELS } from './lib/snippets.js';
import { buildLinks, readHash } from './lib/share.js';
import {
  standaloneSvg, svgToCanvas, canvasToBlob, downloadBlob,
  downloadText, copyText, copyImage, printSvgAsPdf, safeFilename,
} from './lib/exporter.js';

import { $, $$, on, esc } from './lib/utils.js';
import { toast, openModal, closeModal, confirmModal, importModal, closeDropdowns, initUI } from './lib/ui.js';

const settings = store.settings;


/* ── UI theme ── */
function applyUiTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('#btn-theme-toggle').innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
}
const ICONS = {
  moon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
};
applyUiTheme(settings.uiTheme);
on($('#btn-theme-toggle'), 'click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

  // Show loading overlay
  $('#theme-overlay').classList.add('active');

  // Wait a frame to ensure overlay is visible before freezing the main thread
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      store.setSetting('uiTheme', next);
      applyUiTheme(next);

      const currentDiagramTheme = store.active?.style?.theme || 'auto';
      if (currentDiagramTheme === 'auto') {
        // Bypass the 350ms debounce for immediate re-render
        clearTimeout(renderTimer);
        doRender().then(() => {
          $('#theme-overlay').classList.remove('active');
        });
      } else {
        setTimeout(() => $('#theme-overlay').classList.remove('active'), 100);
      }
    });
  });
});

/* ━━━━━━━━━━━━━ Editors ━━━━━━━━━━━━━ */
const mermaidEditor = createMermaidEditor($('#editor-code'), {
  doc: store.active.code,
  onChange: (code) => {
    store.updateActive({ code }, { silent: true });
    markDirty();
    if (settings.autoRender) scheduleRender();
  },
  onCursor: ({ line, col, selection, lines }) => {
    const lang = store.settings.language;
    const selText = selection ? ` (${selection} <span data-i18n="stat_sel">${t('stat_sel', lang) || 'selected'}</span>)` : '';
    $('#status-cursor').innerHTML = `Ln ${line}, Col ${col}${selText}`;
    $('#status-lines').innerHTML = `${lines} <span data-i18n="stat_lines">${t('stat_lines', lang) || 'lines'}</span>`;
  },
  onSave: () => {
    const saved = store.snapshot('Simpan manual', { force: true });
    if (saved) toast(t('t_snap_saved', store.settings.language), 'success');
    doRender();
  },
});

const configEditor = createJsonEditor($('#editor-config'), {
  doc: store.active.config || '{}',
  onChange: (json) => {
    store.updateActive({ config: json }, { silent: true });
    markDirty();
    if (settings.autoRender) scheduleRender();
  },
});

$$('.editor-tab').forEach((tab) => on(tab, 'click', () => {
  $$('.editor-tab').forEach((t) => t.classList.toggle('active', t === tab));
  const isConfig = tab.dataset.editorTab === 'config';
  $('#editor-code-wrap').style.display = isConfig ? 'none' : '';
  $('#editor-config-wrap').style.display = isConfig ? '' : 'none';
  $('#quick-insert').style.display = isConfig ? 'none' : '';
  (isConfig ? configEditor.view : mermaidEditor.view).focus();
}));

function applyEditorSettings() {
  mermaidEditor.setWrap(settings.wordWrap);
  mermaidEditor.setLineNumbers(settings.lineNumbers);
  document.documentElement.style.setProperty('--editor-font-size', `${settings.fontSize}px`);
  $('#btn-render').style.display = settings.autoRender ? 'none' : '';
}

function markDirty() { 
  const lang = store.settings.language;
  $('#status-saved').innerHTML = `<span class="dot dot-warn"></span> <span data-i18n="saving">${t('saving', lang)}</span>`; 
}
store.addEventListener('saved', () => { 
  const lang = store.settings.language;
  $('#status-saved').innerHTML = `<span class="dot dot-ok"></span> <span data-i18n="saved">${t('saved', lang)}</span>`; 
});

/* ━━━━━━━━━━━━━ Rendering ━━━━━━━━━━━━━ */
let currentSvg = null;
let svgSize = { w: 0, h: 0 };
let renderSeq = 0;
let renderTimer = null;
let needsFit = true;

function scheduleRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(doRender, settings.renderDelay || 350);
}

async function doRender() {
  clearTimeout(renderTimer);
  const seq = ++renderSeq;
  const code = mermaidEditor.getCode();
  const style = { ...DEFAULT_STYLE, ...(store.active.style || {}) };
  const cfg = parseUserConfig(configEditor.getCode());
  $('#status-config').style.display = cfg.ok ? 'none' : '';

  const emptyEl = $('#preview-empty');
  const errEl = $('#preview-error');

  if (!code.trim()) {
    currentSvg = null;
    svgWrap.innerHTML = '';
    emptyEl.style.display = '';
    errEl.style.display = 'none';
    mermaidEditor.setErrors([]);
    $('#status-render').textContent = '';
    document.body.classList.add('ready');
    return;
  }

  $('#render-indicator').classList.add('active');
  const result = await renderDiagram(code, buildConfig(style, cfg.value));
  if (seq !== renderSeq) return; // a newer render superseded this one
  $('#render-indicator').classList.remove('active');

  const type = detectDiagramType(code);
  $('#status-type').innerHTML = type ? `<span class="type-pill">${esc(TYPE_LABELS[type] || type)}</span>` : '';
  updateQuickInsert(type);

  if (result.ok) {
    currentSvg = result.svg;
    svgWrap.innerHTML = result.svg;
    svgWrap.style.display = '';
    errEl.style.display = 'none';
    emptyEl.style.display = 'none';
    canvas.classList.remove('has-error');
    result.bindFunctions?.(svgWrap);

    // Give the SVG an explicit intrinsic size so zoom/pan math is reliable.
    const svgEl = svgWrap.querySelector('svg');
    const vb = svgEl?.viewBox?.baseVal;
    if (svgEl && vb && vb.width) {
      svgSize = { w: vb.width, h: vb.height };
      svgEl.setAttribute('width', vb.width);
      svgEl.setAttribute('height', vb.height);
      svgEl.style.maxWidth = 'none';
    } else if (svgEl) {
      const r = svgEl.getBoundingClientRect();
      svgSize = { w: r.width / zoom, h: r.height / zoom };
    }

    canvas.classList.toggle('diagram-dark', isDarkStyle(style));
    canvas.classList.toggle('diagram-light', !isDarkStyle(style));
    mermaidEditor.setErrors([]);
    if (needsFit) fitToView();
    $('#status-render').innerHTML = `<span class="dot dot-ok"></span> ${Math.round(result.time)} ms`;
    store.maybeAutoSnapshot();
  } else {
    // Keep the last good diagram visible, dimmed, and show the error overlay.
    canvas.classList.add('has-error');
    errEl.style.display = '';
    emptyEl.style.display = 'none';
    $('#err-msg').textContent = result.error.message;
    const errLine = $('#err-line');
    if (result.error.line) {
      errLine.style.display = '';
      errLine.dataset.line = result.error.line;
      errLine.textContent = `Lompat ke baris ${result.error.line} →`;
    } else {
      errLine.style.display = 'none';
    }
    mermaidEditor.setErrors([result.error]);
    const lang = store.settings.language;
    $('#status-render').innerHTML = `<span class="dot dot-err"></span> <span data-i18n="syntax_error">${t('syntax_error', lang)}</span>`;
  }
  document.body.classList.add('ready');
}

on($('#err-line'), 'click', (e) => {
  const line = parseInt(e.currentTarget.dataset.line, 10);
  if (line) mermaidEditor.gotoLine(line);
});
on($('#btn-render'), 'click', doRender);

/* ━━━━━━━━━━━━━ Zoom & Pan ━━━━━━━━━━━━━ */
const canvas = $('#preview-canvas');
const svgWrap = $('#preview-svg');
let zoom = 1, panX = 0, panY = 0;

function updateTransform() {
  svgWrap.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  $('#zoom-text').textContent = `${Math.round(zoom * 100)}%`;
}

function fitToView() {
  const cw = canvas.clientWidth, ch = canvas.clientHeight;
  if (!svgSize.w || !cw || !ch) return;
  const pad = 32;
  zoom = Math.min((cw - pad * 2) / svgSize.w, (ch - pad * 2) / svgSize.h, 1.5);
  zoom = Math.max(0.05, zoom);
  panX = (cw - svgSize.w * zoom) / 2;
  panY = (ch - svgSize.h * zoom) / 2;
  needsFit = false;
  updateTransform();
}

function zoomAt(factor, cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2) {
  const nz = Math.max(0.05, Math.min(zoom * factor, 10));
  panX = cx - (cx - panX) * (nz / zoom);
  panY = cy - (cy - panY) * (nz / zoom);
  zoom = nz;
  updateTransform();
}

function zoomActual() {
  const cw = canvas.clientWidth, ch = canvas.clientHeight;
  zoom = 1;
  panX = (cw - svgSize.w) / 2;
  panY = Math.max(24, (ch - svgSize.h) / 2);
  updateTransform();
}

on(canvas, 'wheel', (e) => {
  e.preventDefault();
  const r = canvas.getBoundingClientRect();
  // Pinch on trackpad arrives as ctrl+wheel. A classic mouse wheel sends large, line-based
  // vertical steps; a trackpad sends small pixel deltas (often with deltaX) → treat as pan.
  const isMouseWheel = e.deltaMode !== 0 || (e.deltaX === 0 && Math.abs(e.deltaY) >= 50 && Number.isInteger(e.deltaY));
  if (e.ctrlKey || e.metaKey || (isMouseWheel && !e.shiftKey)) {
    const factor = Math.exp(-e.deltaY * (e.ctrlKey && !isMouseWheel ? 0.01 : 0.0015));
    zoomAt(factor, e.clientX - r.left, e.clientY - r.top);
  } else {
    panX -= e.shiftKey ? e.deltaY : e.deltaX;
    panY -= e.shiftKey ? 0 : e.deltaY;
    updateTransform();
  }
}, { passive: false });

let pan = null;
on(canvas, 'pointerdown', (e) => {
  if (e.button !== 0 && e.button !== 1) return;
  if (e.target.closest('a')) return;
  pan = { x: e.clientX - panX, y: e.clientY - panY, id: e.pointerId };
  try { canvas.setPointerCapture(e.pointerId); } catch (err) { }
  canvas.classList.add('panning');
});
on(canvas, 'pointermove', (e) => {
  if (!pan || pan.id !== e.pointerId) return;
  panX = e.clientX - pan.x;
  panY = e.clientY - pan.y;
  updateTransform();
});
const endPan = (e) => {
  if (!pan) return;
  if (e && e.pointerId) {
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { }
  }
  pan = null;
  canvas.classList.remove('panning');
};
on(canvas, 'pointerup', endPan);
on(canvas, 'pointercancel', endPan);
on(canvas, 'pointercancel', endPan);
on(canvas, 'dblclick', fitToView);

on($('#btn-zoom-in'), 'click', () => zoomAt(1.2));
on($('#btn-zoom-out'), 'click', () => zoomAt(1 / 1.2));
on($('#btn-zoom-fit'), 'click', fitToView);
on($('#btn-zoom-reset'), 'click', zoomActual);
on($('#btn-fullscreen'), 'click', () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else $('#preview-panel').requestFullscreen?.();
});
on(document, 'fullscreenchange', () => setTimeout(fitToView, 60));
new ResizeObserver(() => { if (needsFit || currentSvg) requestAnimationFrame(fitToViewIfAuto); }).observe(canvas);
let lastCanvasSize = '';
function fitToViewIfAuto() {
  const key = `${canvas.clientWidth}x${canvas.clientHeight}`;
  if (key === lastCanvasSize) return;
  lastCanvasSize = key;
  fitToView();
}

/* ━━━━━━━━━━━━━ Split pane ━━━━━━━━━━━━━ */
const workspace = $('#workspace');
const handle = $('#resize-handle');
const editorPanel = $('#editor-panel');
let resizing = false;

function applySplit(ratio = settings.splitRatio || 0.42) {
  editorPanel.style.flex = `0 0 ${ratio * 100}%`;
}
on(handle, 'pointerdown', (e) => {
  resizing = true;
  handle.classList.add('dragging');
  handle.setPointerCapture(e.pointerId);
  document.body.classList.add('resizing');
});
on(handle, 'pointermove', (e) => {
  if (!resizing) return;
  const r = workspace.getBoundingClientRect();
  const vertical = window.innerWidth <= 768 || workspace.classList.contains('vertical');
  const ratio = vertical ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
  const clamped = Math.max(0.15, Math.min(ratio, 0.85));
  applySplit(clamped);
  settings.splitRatio = clamped;
});
on(handle, 'pointerup', () => {
  resizing = false;
  handle.classList.remove('dragging');
  document.body.classList.remove('resizing');
  store.setSetting('splitRatio', settings.splitRatio);
});
on(handle, 'dblclick', () => { applySplit(0.42); store.setSetting('splitRatio', 0.42); });

function setLayout(mode) {
  workspace.classList.remove('mode-editor', 'mode-preview');
  if (mode !== 'split') workspace.classList.add(`mode-${mode}`);
  store.setSetting('layoutMode', mode);
  $$('[data-layout]').forEach((b) => b.classList.toggle('active', b.dataset.layout === mode));
  needsFit = true;
  setTimeout(fitToView, 30);
}
function setOrientation(dir) {
  workspace.classList.toggle('vertical', dir === 'vertical');
  store.setSetting('orientation', dir);
  $$('[data-orient]').forEach((b) => b.classList.toggle('active', b.dataset.orient === dir));
  needsFit = true;
  setTimeout(fitToView, 30);
}
$$('[data-layout]').forEach((b) => on(b, 'click', () => setLayout(b.dataset.layout)));
$$('[data-orient]').forEach((b) => on(b, 'click', () => setOrientation(b.dataset.orient)));

function setCanvasBg(bg) {
  ['dots', 'grid', 'plain', 'transparent'].forEach((k) => canvas.classList.toggle(`bg-${k}`, k === bg));
  $('#sel-canvas-bg').value = bg;
  store.setSetting('canvasBg', bg);
}
on($('#sel-canvas-bg'), 'change', (e) => setCanvasBg(e.target.value));

/* ━━━━━━━━━━━━━ Sidebar ━━━━━━━━━━━━━ */
function toggleSidebar(open) {
  const sb = $('#sidebar');
  const isOpen = open ?? sb.classList.contains('collapsed');
  sb.classList.toggle('collapsed', !isOpen);
  $('#btn-open-sidebar').classList.toggle('active', isOpen);
  store.setSetting('sidebarOpen', isOpen);
  needsFit = true;
  setTimeout(fitToView, 220);
}
on($('#btn-toggle-sidebar'), 'click', () => toggleSidebar(false));
on($('#btn-open-sidebar'), 'click', () => toggleSidebar());

$$('.sidebar-tab').forEach((tab) => on(tab, 'click', () => {
  $$('.sidebar-tab').forEach((t) => t.classList.toggle('active', t === tab));
  $$('.sidebar-panel').forEach((p) => p.classList.toggle('active', p.id === `panel-${tab.dataset.tab}`));
}));

/* ── Documents ── */
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} mins ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

const selectedDocs = new Set();

function updateBulkActionsUI() {
  const bulk = $('#doc-bulk-actions');
  const count = $('#bulk-count');
  if (selectedDocs.size > 0) {
    bulk.style.display = 'flex';
    count.textContent = t('selected_count', store.settings.language).replace('{count}', selectedDocs.size);
  } else {
    bulk.style.display = 'none';
  }
}

function renderDocList() {
  const q = $('#doc-search').value.trim().toLowerCase();
  const docs = [...store.docs]
    .filter((d) => !q || (d.name || '').toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
    .sort((a, b) => (b.starred - a.starred) || (b.updatedAt - a.updatedAt));
  $('#doc-count').textContent = store.docs.length;

  for (const id of selectedDocs) {
    if (!store.docs.find(d => d.id === id)) selectedDocs.delete(id);
  }
  updateBulkActionsUI();

  $('#doc-list').innerHTML = docs.length ? docs.map((d) => {
    const type = detectDiagramType(d.code);
    const isSelected = selectedDocs.has(d.id);
    return `<li class="doc-item${d.id === store.active.id ? ' active' : ''}${isSelected ? ' selected' : ''}" data-select="${d.id}">
      <input type="checkbox" class="doc-check" data-check="${d.id}" ${isSelected ? 'checked' : ''} title="${t('doc_select', store.settings.language)}" />
      <span class="doc-icon">${esc(TEMPLATES.find((tpl) => tpl.id === type)?.icon || '◇')}</span>
      <span class="doc-meta">
        <span class="doc-name">${esc(d.name || t('untitled_doc', store.settings.language))}</span>
        <span class="doc-sub">${esc((t('cat_' + type, store.settings.language) === 'cat_' + type ? TYPE_LABELS[type] : t('cat_' + type, store.settings.language)) || t('diagram_doc', store.settings.language))} · ${timeAgo(d.updatedAt)}</span>
      </span>
      <span class="doc-actions">
        <button class="icon-btn" data-dup="${d.id}" title="${t('doc_dup', store.settings.language)}">⧉</button>
        <button class="icon-btn danger" data-del="${d.id}" title="${t('doc_del', store.settings.language)}">✕</button>
      </span>
      <button class="doc-star${d.starred ? ' active' : ''}" data-star="${d.id}" title="${t('doc_fav', store.settings.language)}">★</button>
    </li>`;
  }).join('') : `<li class="list-empty">${t('no_match_docs', store.settings.language)}</li>`;
}

on($('#doc-search'), 'input', renderDocList);
on($('#doc-list'), 'click', (e) => {
  if (e.target.matches('.doc-check')) {
    const id = e.target.dataset.check;
    if (e.target.checked) selectedDocs.add(id);
    else selectedDocs.delete(id);
    updateBulkActionsUI();
    e.target.closest('.doc-item').classList.toggle('selected', e.target.checked);
    e.stopPropagation();
    return;
  }
  const star = e.target.closest('[data-star]');
  if (star) { const d = store.docs.find((x) => x.id === star.dataset.star); store.updateDoc(d.id, { starred: !d.starred }); return; }
  const dup = e.target.closest('[data-dup]');
  if (dup) {
    const d = store.docs.find((x) => x.id === dup.dataset.dup);
    confirmModal(t('dup_confirm', store.settings.language).replace('{name}', d.name), () => {
      store.duplicateDoc(d.id);
      toast(t('dup_success', store.settings.language));
    }, 'yes_duplicate', 'primary');
    return;
  }
  const del = e.target.closest('[data-del]');
  if (del) {
    const d = store.docs.find((x) => x.id === del.dataset.del);
    const msg = (t('del_confirm_single', store.settings.language) || `Hapus "${d.name}"? Tindakan ini tidak bisa dibatalkan.`).replace('{name}', d.name);
    confirmModal(msg, () => { store.deleteDoc(d.id); toast(t('t_doc_del', store.settings.language)); });
    return;
  }
  const sel = e.target.closest('[data-select]');
  if (sel && sel.dataset.select !== store.active.id) store.setActive(sel.dataset.select);
});

// Bulk actions
on($('#btn-select-all'), 'click', () => {
  const visibleCheckboxes = $$('#doc-list .doc-check');
  const allSelected = Array.from(visibleCheckboxes).every(cb => cb.checked);
  visibleCheckboxes.forEach(cb => {
    cb.checked = !allSelected;
    if (cb.checked) selectedDocs.add(cb.dataset.check);
    else selectedDocs.delete(cb.dataset.check);
    cb.closest('.doc-item').classList.toggle('selected', cb.checked);
  });
  updateBulkActionsUI();
});

on($('#btn-duplicate-selected'), 'click', () => {
  confirmModal(t('dup_confirm_bulk', store.settings.language).replace('{count}', selectedDocs.size), () => {
    [...selectedDocs].forEach(id => store.duplicateDoc(id));
    selectedDocs.clear();
    toast(t('dup_success', store.settings.language));
    renderDocList();
  }, 'yes_duplicate', 'primary');
});

on($('#btn-delete-selected'), 'click', () => {
  confirmModal(t('del_confirm_bulk', store.settings.language).replace('{count}', selectedDocs.size), () => {
    [...selectedDocs].forEach(id => store.deleteDoc(id));
    selectedDocs.clear();
    toast(t('del_success', store.settings.language).replace('{count}', count));
    renderDocList();
  });
});

// Filter/Cleanup actions
on($('#btn-del-week'), 'click', () => {
  const now = Date.now();
  const docs = store.docs.filter(d => !d.starred && (now - d.updatedAt) > 7 * 24 * 60 * 60 * 1000);
  if (!docs.length) return toast(t('no_docs_week', store.settings.language));
  confirmModal(t('del_confirm_week', store.settings.language).replace('{count}', docs.length), () => { docs.forEach(d => store.deleteDoc(d.id)); toast(t('del_success', store.settings.language).replace('{count}', docs.length)); });
});

on($('#btn-del-month'), 'click', () => {
  const now = Date.now();
  const docs = store.docs.filter(d => !d.starred && (now - d.updatedAt) > 30 * 24 * 60 * 60 * 1000);
  if (!docs.length) return toast(t('no_docs_month', store.settings.language));
  confirmModal(t('del_confirm_month', store.settings.language).replace('{count}', docs.length), () => { docs.forEach(d => store.deleteDoc(d.id)); toast(t('del_success', store.settings.language).replace('{count}', docs.length)); });
});

on($('#btn-del-all'), 'click', () => {
  const docs = store.docs.filter(d => !d.starred);
  if (!docs.length) return toast(t('no_docs_all', store.settings.language));
  confirmModal(t('del_confirm_all', store.settings.language).replace('{count}', docs.length), () => { docs.forEach(d => store.deleteDoc(d.id)); toast(t('del_all_success', store.settings.language)); });
});

on($('#btn-new-doc'), 'click', () => newDocument());

function newDocument(opts = {}) {
  store.addDoc({ name: t('new_doc', store.settings.language), code: '', ...opts });
  setTimeout(() => { $('#doc-title').select(); }, 50);
}

store.addEventListener('active', () => {
  const doc = store.active;
  mermaidEditor.setCode(doc.code);
  configEditor.setCode(doc.config || '{}');
  $('#doc-title').value = doc.name || '';
  document.title = `${doc.name || t('diagram_doc', store.settings.language)} - Karsa Studio`;
  applyStylePanel();
  renderDocList();
  renderHistory();
  needsFit = true;
  doRender();
});
store.addEventListener('docs-changed', renderDocList);
store.addEventListener('history-changed', renderHistory);

on($('#doc-title'), 'input', (e) => {
  store.updateActive({ name: e.target.value }, { silent: true });
  document.title = `${e.target.value || 'Diagram'} - Karsa Studio`;
  markDirty();
  renderDocList();
});
on($('#doc-title'), 'keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); mermaidEditor.focus(); } });

/* ── Templates ── */
function renderTemplates() {
  const q = $('#tpl-search').value.trim().toLowerCase();
  $('#template-container').innerHTML = TEMPLATE_CATEGORIES.map((cat) => {
    const items = TEMPLATES.filter((item) => {
      if (item.category !== cat.id) return false;
      if (!q) return true;
      let tName = t('tpl_name_' + item.id, store.settings.language);
      if (tName === 'tpl_name_' + item.id) tName = item.name;
      let tDesc = t('tpl_desc_' + item.id, store.settings.language);
      if (tDesc === 'tpl_desc_' + item.id) tDesc = item.description;
      return tName.toLowerCase().includes(q) || tDesc.toLowerCase().includes(q);
    });
    if (!items.length) return '';
    let catName = t('cat_' + cat.id, store.settings.language);
    if (catName === 'cat_' + cat.id) catName = cat.name;
    return `<div class="template-category"><h3>${esc(catName)}</h3><div class="template-grid">${items.map((item) => {
      let tName = t('tpl_name_' + item.id, store.settings.language);
      if (tName === 'tpl_name_' + item.id) tName = item.name;
      let tDesc = t('tpl_desc_' + item.id, store.settings.language);
      if (tDesc === 'tpl_desc_' + item.id) tDesc = item.description;
      return `
      <button class="template-card" data-tpl="${item.id}">
        <span class="tc-icon">${esc(item.icon)}</span>
        <span class="tc-name">${esc(tName)}</span>
      </button>`;
    }).join('')}</div></div>`;
  }).join('') || `<div class="list-empty">${t('search_templates', store.settings.language) ? t('search_templates', store.settings.language).split('...')[0] + ' not found' : 'Template tidak ditemukan'}</div>`;
}
on($('#tpl-search'), 'input', renderTemplates);
on($('#template-container'), 'click', (e) => {
  const card = e.target.closest('[data-tpl]');
  if (!card) return;
  const templateItem = TEMPLATES.find((x) => x.id === card.dataset.tpl);
  const mode = $('#tpl-mode').value;

  let tplName = t('tpl_name_' + templateItem.id, store.settings.language);
  if (!tplName || tplName === 'tpl_name_' + templateItem.id) tplName = templateItem.name;
  let tplCode = t('tpl_code_' + templateItem.id, store.settings.language);
  if (!tplCode || tplCode === 'tpl_code_' + templateItem.id) tplCode = templateItem.code;

  if (mode === 'new') {
    store.addDoc({ name: tplName, code: tplCode });
  } else {
    if (store.active.code.trim() !== '') {
      let msg = t('confirm_replace', store.settings.language);
      msg = msg === 'confirm_replace' ? 'Apakah Anda yakin ingin mengganti isi editor saat ini dengan template ini?' : msg;
      confirmModal(msg, () => {
        store.snapshot('Sebelum template', { force: false });
        mermaidEditor.replaceAll(tplCode);
        needsFit = true;
        doRender();
        const loadedText = t('tpl_loaded', store.settings.language);
        toast(loadedText ? loadedText.replace('{name}', tplName) : `Template "${tplName}" dimuat`, 'success');
      }, 'yes_replace', 'warning');
      return;
    }
    store.snapshot('Sebelum template', { force: false });
    mermaidEditor.replaceAll(tplCode);
    needsFit = true;
    doRender();
  }
  const loadedText = t('tpl_loaded', store.settings.language);
  toast(loadedText ? loadedText.replace('{name}', tplName) : `Template "${tplName}" dimuat`, 'success');
});

/* ── Style panel ── */
const FALLBACK_COLORS = {
  primaryColor: '#ececff', primaryTextColor: '#333333', primaryBorderColor: '#9370db',
  lineColor: '#333333', secondaryColor: '#ffffde', tertiaryColor: '#f4f4f4',
  clusterBkg: '#ffffde', noteBkgColor: '#fff5ad',
};
const toHex = (c) => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : /^#[0-9a-f]{3}$/i.test(c || '') ? `#${[...c.slice(1)].map((x) => x + x).join('')}` : null);

function populateStylePanel() {
  const lang = store.settings.language || 'en';
  const fontsTranslated = {
    '': t('font_default', lang) || 'Default',
    'Inter, system-ui, sans-serif': 'Inter',
    'system-ui, -apple-system, Segoe UI, sans-serif': 'System UI',
    'Georgia, Times New Roman, serif': 'Serif (Georgia)',
    "'JetBrains Mono', Menlo, monospace": 'Monospace',
    "'Comic Sans MS', 'Comic Neue', cursive": 'Handwritten'
  };

  const curvesTranslated = { basis: 'Basis', linear: 'Linear', cardinal: 'Cardinal', catmullRom: 'Catmull-Rom', monotoneX: 'Monotone X', monotoneY: 'Monotone Y', natural: 'Natural', step: 'Step', stepBefore: 'Step Before', stepAfter: 'Step After', bumpX: 'Bump X', bumpY: 'Bump Y' };

  $('#sel-theme').innerHTML = MERMAID_THEMES.map((tItem) => `<option value="${tItem.id}">${esc(tItem.name)}</option>`).join('');
  $('#sel-curve').innerHTML = CURVES.map((c) => `<option value="${c}">${curvesTranslated[c] || c}</option>`).join('');
  $('#sel-font').innerHTML = FONTS.map((f) => `<option value="${esc(f.id)}">${esc(fontsTranslated[f.id] || f.name)}</option>`).join('');
  $('#preset-grid').innerHTML = PRESETS.map((p) => `
    <button class="preset" data-preset="${p.id}" title="${esc(p.name)}">
      <span class="preset-swatch">${p.swatch.map((c) => `<span style="background:${c}"></span>`).join('')}</span>
      <span class="preset-name">${esc(p.name)}</span>
    </button>`).join('');

  const colorKeyMap = { primaryColor: 'color_primary', primaryTextColor: 'color_text', primaryBorderColor: 'color_border', lineColor: 'color_line', secondaryColor: 'color_secondary', tertiaryColor: 'color_tertiary', clusterBkg: 'color_bg_subgraph', noteBkgColor: 'color_bg_note' };

  $('#color-vars').innerHTML = COLOR_VARS.map((v) => `
    <label class="color-var-item">
      <input type="color" data-var="${v.key}" />
      <span>${esc(t(colorKeyMap[v.key] || v.label, lang))}</span>
    </label>`).join('');
}

function applyStylePanel() {
  const s = { ...DEFAULT_STYLE, ...(store.active.style || {}) };
  $('#sel-theme').value = s.theme;
  $('#sel-theme').disabled = !!s.preset;
  $('#sel-look').value = s.look;
  $('#sel-layout').value = s.layout;
  $('#sel-curve').value = s.curve;
  $('#sel-font').value = s.fontFamily;
  $('#rng-font-size').value = s.fontSize;
  $('#lbl-font-size').textContent = `${s.fontSize}px`;
  $$('.preset').forEach((el) => el.classList.toggle('active', el.dataset.preset === s.preset));
  const presetVars = getPreset(s.preset)?.vars || {};
  const custom = s.themeVariables || {};
  $$('#color-vars input').forEach((inp) => {
    const k = inp.dataset.var;
    inp.value = toHex(custom[k]) || toHex(presetVars[k]) || FALLBACK_COLORS[k] || '#888888';
    inp.closest('.color-var-item').classList.toggle('custom', k in custom);
  });
  $('#btn-reset-colors').disabled = !Object.keys(custom).length;
}

function patchStyle(patch) {
  const style = { ...DEFAULT_STYLE, ...(store.active.style || {}), ...patch };
  store.updateActive({ style }, { silent: true });
  markDirty();
  applyStylePanel();
  scheduleRender();
}

on($('#sel-theme'), 'change', (e) => patchStyle({ theme: e.target.value, preset: '' }));
on($('#sel-look'), 'change', (e) => patchStyle({ look: e.target.value }));
on($('#sel-layout'), 'change', (e) => { needsFit = true; patchStyle({ layout: e.target.value }); });
on($('#sel-curve'), 'change', (e) => patchStyle({ curve: e.target.value }));
on($('#sel-font'), 'change', (e) => patchStyle({ fontFamily: e.target.value }));
on($('#rng-font-size'), 'input', (e) => patchStyle({ fontSize: parseInt(e.target.value, 10) }));
on($('#preset-grid'), 'click', (e) => {
  const p = e.target.closest('[data-preset]');
  if (!p) return;
  const current = store.active.style?.preset;
  patchStyle({ preset: current === p.dataset.preset ? '' : p.dataset.preset, themeVariables: {} });
});
on($('#color-vars'), 'input', (e) => {
  const k = e.target.dataset.var;
  if (!k) return;
  patchStyle({ themeVariables: { ...(store.active.style?.themeVariables || {}), [k]: e.target.value } });
});
on($('#btn-reset-colors'), 'click', () => patchStyle({ themeVariables: {} }));
on($('#btn-reset-style'), 'click', () => { patchStyle({ ...DEFAULT_STYLE, themeVariables: {} }); toast(t('t_style_reset', store.settings.language)); });

/* ── Quick insert ── */
let lastQiType = undefined;
function updateQuickInsert(type) {
  if (type === lastQiType) return;
  lastQiType = type;
  const snippets = SNIPPETS_BY_TYPE[type] || [];
  $('#quick-insert').innerHTML = snippets.length
    ? `<span class="qi-label">Insert</span>` + snippets.map((s, i) =>
      `<button class="qi-btn" data-qi="${i}" title="${esc(s.detail)}"><span class="qi-icon">${esc(s.icon)}</span>${esc(s.label)}</button>`).join('')
    : `<span class="qi-label">No snippets for this diagram type - use Ctrl+Space for autocomplete</span>`;
}
on($('#quick-insert'), 'click', (e) => {
  const btn = e.target.closest('[data-qi]');
  if (!btn) return;
  const s = SNIPPETS_BY_TYPE[lastQiType][+btn.dataset.qi];
  const text = s.snippet.replace(/\$\{\d+:?([^}]*)\}/g, '$1');
  const view = mermaidEditor.view;
  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const indent = (line.text.match(/^\s*/)?.[0]) || (line.number > 1 ? '    ' : '');
  const body = text.split('\n').map((l, i) => (i ? indent + l : l)).join('\n');
  const insert = line.text.trim() ? `\n${indent}${body}` : body;
  const pos = line.text.trim() ? line.to : line.from + indent.length;
  view.dispatch({
    changes: line.text.trim() ? { from: pos, insert } : { from: line.from, to: line.to, insert: indent + body },
    selection: { anchor: (line.text.trim() ? pos : line.from) + (line.text.trim() ? insert.length : indent.length + body.length) },
    scrollIntoView: true,
  });
  view.focus();
});

/* ── History ── */
function renderHistory() {
  const hist = store.active.history || [];
  $('#history-empty').style.display = hist.length ? 'none' : '';
  $('#history-list').innerHTML = hist.map((h) => {
    const d = new Date(h.ts);
    const lines = h.code.split('\n').length;
    return `<li class="history-item" data-snap="${h.id}">
      <span class="history-dot"></span>
      <span class="history-meta">
        <span class="history-label">${esc(h.label)}</span>
        <span class="history-ts">${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} · ${lines} baris</span>
      </span>
      <button class="icon-btn danger" data-del-snap="${h.id}" title="Hapus snapshot">✕</button>
    </li>`;
  }).join('');
}
on($('#history-list'), 'click', (e) => {
  const del = e.target.closest('[data-del-snap]');
  if (del) { store.deleteSnapshot(del.dataset.delSnap); return; }
  const item = e.target.closest('[data-snap]');
  if (!item) return;
  const snap = store.active.history.find((h) => h.id === item.dataset.snap);
  if (!snap) return;
  store.snapshot('Sebelum restore');
  mermaidEditor.replaceAll(snap.code);
  doRender();
  toast(t('t_ver_restored', store.settings.language), 'success');
});
on($('#btn-snapshot'), 'click', () => {
  if (store.snapshot('Snapshot manual', { force: true })) toast(t('t_snap_saved', store.settings.language), 'success');
});

/* ━━━━━━━━━━━━━ Export ━━━━━━━━━━━━━ */
function exportBackground() {
  const style = { ...DEFAULT_STYLE, ...(store.active.style || {}) };
  if (!isDarkStyle(style)) return '#ffffff';
  return getPreset(style.preset)?.vars?.background || '#1e1e2e';
}

async function handleExportAction(e, dropdownId, chkId) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  closeDropdowns();
  const action = btn.dataset.action;
  const name = safeFilename(store.active.name);
  const needsSvg = !['export-code', 'export-karsa', 'export-project-karsa'].includes(action);
  if (needsSvg && !currentSvg) { toast(t('t_no_render', store.settings.language), 'warning'); return; }
  const bg = exportBackground();
  const transparent = $(`#${chkId}`).checked;

  try {
    switch (action) {
      case 'export-svg':
        downloadText(standaloneSvg(currentSvg, { padding: 16, background: transparent ? null : bg }), `${name}.svg`, 'image/svg+xml');
        break;
      case 'export-png':
      case 'export-png-4x': {
        const scale = action === 'export-png' ? 2 : 4;
        const c = await svgToCanvas(currentSvg, { scale, background: transparent ? null : bg });
        downloadBlob(await canvasToBlob(c), `${name}${scale === 4 ? '@4x' : ''}.png`);
        break;
      }
      case 'export-jpg': {
        const c = await svgToCanvas(currentSvg, { scale: 2, background: bg });
        downloadBlob(await canvasToBlob(c, 'image/jpeg', 0.92), `${name}.jpg`);
        break;
      }
      case 'export-pdf':
        printSvgAsPdf(currentSvg, name, bg);
        return;
      case 'export-karsa': {
        const singleDoc = JSON.stringify({
          name: store.active.name,
          code: store.active.code,
          style: store.active.style || {}
        }, null, 2);
        downloadText(singleDoc, `${name}.krs`, 'application/json');
        break;
      }
      case 'export-project-karsa':
        downloadText(store.exportBackup(), `karsa-studio-project-${new Date().toISOString().slice(0, 10)}.karsa`, 'application/json');
        toast(t('t_proj_saved', store.settings.language), 'success');
        break;
      case 'export-code':
        await copyText(mermaidEditor.getCode());
        toast(t('t_code_copied', store.settings.language), 'success');
        return;
      case 'export-md':
        await copyText('```karsa\n' + mermaidEditor.getCode().trim() + '\n```\n');
        toast(t('t_md_copied', store.settings.language), 'success');
        return;
      case 'copy-svg':
        await copyText(standaloneSvg(currentSvg, { padding: 16 }));
        toast(t('t_svg_copied', store.settings.language), 'success');
        return;
      case 'copy-png': {
        const c = await svgToCanvas(currentSvg, { scale: 2, background: transparent ? null : bg });
        await copyImage(canvasToBlob(c));
        toast(t('t_png_copied', store.settings.language), 'success');
        return;
      }
    }
    toast(t('t_export_ok', store.settings.language), 'success');
  } catch (err) {
    console.error(err);
    toast(t('t_export_fail', store.settings.language).replace('{err}', err.message), 'error');
  }
}

on($('#dropdown-export'), 'click', (e) => handleExportAction(e, 'dropdown-export', 'chk-transparent'));
on($('#dropdown-export-sidebar'), 'click', (e) => handleExportAction(e, 'dropdown-export-sidebar', 'chk-transparent-sidebar'));



/* ━━━━━━━━━━━━━ i18n ━━━━━━━━━━━━━ */
$$('#lang-dropdown .dropdown-item').forEach(el => {
  el.addEventListener('click', () => {
    store.setSetting('language', el.dataset.lang);
  });
});

store.addEventListener('settings', (e) => {
  const { key, value } = e.detail;
  if (key === 'language') {
    translateDocument(document, value);
    $('#lang-text').textContent = LANGUAGES[value].split(' ')[0] || value.toUpperCase();
    renderTemplates(); // re-render template list to translate descriptions if needed
    renderDocList(); // update title translations
    populateStylePanel(); // update dropdown translations
    applyStylePanel(); // re-select current values
  }
});

/* ━━━━━━━━━━━━━ Settings ━━━━━━━━━━━━━ */

function renderSettings() {
  const lang = store.settings.language || 'en';
  const BOOL_SETTINGS = [
    ['autoRender', t('set_auto_render', lang)],
    ['wordWrap', t('set_word_wrap', lang)],
    ['lineNumbers', t('set_line_nums', lang)],
  ];
  $('#settings-body').innerHTML = BOOL_SETTINGS.map(([k, label]) => `
    <div class="setting-row">
      <span class="setting-label">${label}</span>
      <label class="toggle"><input type="checkbox" data-setting="${k}" ${settings[k] ? 'checked' : ''}/><span class="slider"></span></label>
    </div>`).join('') + `
    <div class="setting-row"><span class="setting-label">${t('set_font_size', lang)}</span>
      <input type="number" data-setting="fontSize" value="${settings.fontSize}" min="10" max="24" /></div>
    <div class="setting-row"><span class="setting-label">${t('set_render_delay', lang)}</span>
      <input type="number" data-setting="renderDelay" value="${settings.renderDelay}" min="100" max="3000" step="50" /></div>
    <div class="setting-row"><span class="setting-label">${t('set_auto_snapshot', lang)}</span>
      <input type="number" data-setting="autoSnapshotMinutes" value="${settings.autoSnapshotMinutes}" min="1" max="60" /></div>
    <div class="setting-row"><span class="setting-label">${t('set_storage', lang)}</span>
      <span class="setting-value">${store.docs.length} ${t('set_docs', lang)} · ${(new Blob([localStorage.getItem('mermaid-studio:v1') || '']).size / 1024).toFixed(1)} KB ${t('set_in_browser', lang)}</span></div>`;
}
on($('#settings-body'), 'change', (e) => {
  const k = e.target.dataset.setting;
  if (!k) return;
  const v = e.target.type === 'checkbox' ? e.target.checked : Number(e.target.value);
  store.setSetting(k, v);
  applyEditorSettings();
  if (k === 'autoRender' && v) doRender();
});
on($('#btn-settings'), 'click', () => { renderSettings(); openModal('modal-settings'); });

/* ── Shortcuts ── */
const SHORTCUTS = [
  ['sc_g_editor', [
    ['sc_save', 'Mod+S'], ['sc_auto', 'Ctrl+Space'], ['sc_find', 'Mod+F'],
    ['sc_comment', 'Mod+/'], ['sc_undo', 'Mod+Z / Mod+Shift+Z'], ['sc_indent', 'Tab / Shift+Tab'],
    ['sc_multi', 'Alt+Click'], ['sc_fold', 'Mod+Alt+['],
  ]],
  ['sc_g_app', [
    ['sc_new', 'Alt+N'], ['sc_sidebar', 'Mod+B'], ['sc_render', 'Mod+Enter'],
    ['sc_zoom', 'Mod+= / Mod+-'], ['sc_fit', 'Mod+0'], ['sc_export', 'Mod+Shift+E'],
    ['sc_help', '?'],
  ]],
];
const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
const fmtKeys = (k) => k.split(' / ').map((combo) => combo.split('+').map((x) =>
  `<kbd>${x === 'Mod' ? (isMac ? '⌘' : 'Ctrl') : x === 'Shift' ? (isMac ? '⇧' : 'Shift') : x === 'Alt' ? (isMac ? '⌥' : 'Alt') : esc(x)}</kbd>`).join('')).join(' <span class="kbd-or">/</span> ');

function renderShortcuts() {
  const lang = store.settings.language || 'en';
  $('#shortcut-table').innerHTML = SHORTCUTS.map(([group, rows]) =>
    `<tr><th colspan="2">${t(group, lang)}</th></tr>` + rows.map(([d, k]) => `<tr><td>${t(d, lang)}</td><td>${fmtKeys(k)}</td></tr>`).join('')).join('');
}

on($('#btn-shortcuts'), 'click', () => { renderShortcuts(); openModal('modal-shortcuts'); });

on(document, 'keydown', (e) => {
  const mod = e.metaKey || e.ctrlKey;
  const inField = e.target.closest('input, textarea, select, .cm-editor');
  if (e.key === 'Escape') { $$('.modal-backdrop.open').forEach((m) => closeModal(m.id)); closeDropdowns(); return; }
  if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleSidebar(); }
  else if (mod && e.key === 'Enter') { e.preventDefault(); doRender(); }
  else if (mod && (e.key === '=' || e.key === '+')) { e.preventDefault(); zoomAt(1.2); }
  else if (mod && e.key === '-') { e.preventDefault(); zoomAt(1 / 1.2); }
  else if (mod && e.key === '0') { e.preventDefault(); fitToView(); }
  else if (mod && e.shiftKey && e.code === 'KeyE') { e.preventDefault(); $('[data-action="export-svg"]').click(); }

  else if (e.altKey && e.code === 'KeyN') { e.preventDefault(); newDocument(); }
  else if (e.key === '?' && !inField) { e.preventDefault(); openModal('modal-shortcuts'); }
});

/* ━━━━━━━━━━━━━ Import / backup / drag & drop ━━━━━━━━━━━━━ */
async function importFiles(files) {
  for (const file of files) {
    const text = await file.text();
    try {
      if (/\.json$/i.test(file.name) || /\.karsa$/i.test(file.name)) {
        let isProject = false;
        try {
          const parsed = JSON.parse(text);
          if (parsed.app === 'mermaid-studio' && Array.isArray(parsed.docs)) {
            isProject = true;
          }
        } catch (e) { }

        if (isProject) {
          importModal(t('import_project_msg', store.settings.language),
            () => { // Append
              const n = store.importBackup(text);
              renderDocList();
              toast(t('t_proj_import_app', store.settings.language).replace('{n}', n), 'success');
            },
            () => { // Replace
              store.state.docs = [];
              const n = store.importBackup(text);
              store.switchDoc(store.docs[0].id);
              renderDocList();
              toast(t('t_proj_import_rep', store.settings.language).replace('{n}', n), 'success');
            },
            t('import_append', store.settings.language),
            t('import_replace', store.settings.language)
          );
        } else {
          // Fallback if not standard project
          const n = store.importBackup(text);
          renderDocList();
          toast(t('t_import_ok', store.settings.language).replace('{n}', n), 'success');
        }
      } else {
        // Handle raw mermaid / text / md files, or .krs
        let code = /\.md$/i.test(file.name) ? (text.match(/```mermaid\s*\n([\s\S]*?)```/)?.[1] ?? text) : text;
        let name = file.name.replace(/\.[^.]+$/, '');
        let style = {};
        if (/\.krs$/i.test(file.name)) {
          try {
            const parsed = JSON.parse(text);
            if (parsed.code) {
              // it's a valid .krs JSON single doc
              name = parsed.name || name;
              code = parsed.code;
              style = parsed.style || {};
            }
          } catch (e) { }
        }

        importModal(t('import_doc_msg', store.settings.language).replace('{name}', name),
          () => {
            // New Doc (Append equivalent)
            store.addDoc({ name, code, style }, { activate: true });
            renderDocList();
            const addedMsg = t('t_file_added', store.settings.language) || `"${file.name}" berhasil ditambahkan`;
            toast(addedMsg.replace('{name}', file.name), 'success');
          },
          () => {
            // Replace active doc (Replace equivalent)
            store.active.name = name;
            store.active.code = code;
            store.active.style = { ...store.active.style, ...style };
            store.persist();
            mermaidEditor.setCode(code);
            $('#doc-title').value = name;
            document.title = `${name || 'Diagram'} - Karsa Studio`;
            renderDocList();
            applyStylePanel();
            scheduleRender();
            const loadedMsg = t('t_file_loaded', store.settings.language) || `"${file.name}" dimuat ke editor`;
            toast(loadedMsg.replace('{name}', file.name), 'success');
          },
          t('doc_append', store.settings.language),
          t('doc_replace', store.settings.language)
        );
      }
    } catch (err) {
      toast(t('t_import_fail', store.settings.language).replace('{name}', file.name).replace('{err}', err.message), 'error');
    }
  }
}
on($('#btn-import'), 'click', () => $('#file-import').click());
on($('#file-import'), 'change', async (e) => { await importFiles([...e.target.files]); e.target.value = ''; });


let dragDepth = 0;
on(window, 'dragenter', (e) => { if (e.dataTransfer?.types?.includes('Files')) { dragDepth++; document.body.classList.add('dragging-file'); } });
on(window, 'dragleave', () => { if (--dragDepth <= 0) { dragDepth = 0; document.body.classList.remove('dragging-file'); } });
on(window, 'dragover', (e) => e.preventDefault());
on(window, 'drop', (e) => {
  e.preventDefault();
  dragDepth = 0;
  document.body.classList.remove('dragging-file');
  if (e.dataTransfer?.files?.length) importFiles([...e.dataTransfer.files]);
});

/* ━━━━━━━━━━━━━ Boot ━━━━━━━━━━━━━ */

window.addEventListener('offline', () => toast(t('t_offline', store.settings.language), 'warning'));
window.addEventListener('online', () => toast(t('t_online', store.settings.language), 'success'));

initUI();
translateDocument(document, settings.language || 'en');
if ($('#lang-text')) $('#lang-text').textContent = (LANGUAGES[settings.language || 'en'] || 'EN').split(' ')[0].toUpperCase();
populateStylePanel();
applyStylePanel();
applyEditorSettings();
renderTemplates();
renderDocList();
renderHistory();
applySplit();
setCanvasBg(settings.canvasBg);
setOrientation(settings.orientation);
setLayout(settings.layoutMode);
$('#sidebar').classList.toggle('collapsed', !settings.sidebarOpen);
$('#btn-open-sidebar').classList.toggle('active', settings.sidebarOpen);
$('#doc-title').value = store.active.name || '';
document.title = `${store.active.name || 'Diagram'} - Karsa Studio`;

const shared = readHash();
if (shared) {
  store.addDoc({ name: shared.state.name || 'Shared diagram', code: shared.state.code || '' });
  if (shared.mode === 'view') setLayout('preview');
  history.replaceState(null, '', location.pathname);
  toast(t('t_link_loaded', store.settings.language), 'success');
} else {
  doRender();
}

// OS-specific UI adjustments for shortcuts
if (!isMac) {
  document.querySelectorAll('[title]').forEach(el => {
    el.title = el.title.replace(/⌘/g, 'Ctrl+').replace(/⇧/g, 'Shift+').replace(/⌥/g, 'Alt+');
  });
  document.querySelectorAll('.dd-shortcut').forEach(el => {
    el.textContent = el.textContent.replace(/⌘/g, 'Ctrl+').replace(/⇧/g, 'Shift+').replace(/⌥/g, 'Alt+');
  });
}

setInterval(renderDocList, 60_000); // refresh
