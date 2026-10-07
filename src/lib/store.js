// Persistent workspace store (localStorage) for documents, version history and settings.
import { DEFAULT_CODE } from './templates.js';
import { DEFAULT_STYLE } from './renderer.js';

const KEY = 'mermaid-studio:v1';
const MAX_HISTORY = 60;

export const DEFAULT_SETTINGS = {
  language: 'en',
  uiTheme: 'dark',
  fontSize: 14,
  wordWrap: false,
  lineNumbers: true,
  autoRender: true,
  renderDelay: 350,
  layoutMode: 'split', // split | editor | preview
  orientation: 'horizontal', // horizontal | vertical
  sidebarOpen: true,
  splitRatio: 0.42,
  canvasBg: 'dots', // dots | grid | plain | transparent
  autoSnapshotMinutes: 3,
};

export const DEFAULT_CONFIG_JSON = `{
  "flowchart": {
    "nodeSpacing": 50,
    "rankSpacing": 50,
    "padding": 15
  },
  "sequence": {
    "showSequenceNumbers": false,
    "mirrorActors": true
  },
  "er": {
    "layoutDirection": "TB"
  },
  "gantt": {
    "barHeight": 24
  }
}
`;

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function createDoc({ name = 'Diagram tanpa judul', code = DEFAULT_CODE, style, config } = {}) {
  const now = Date.now();
  return {
    id: uid(),
    name,
    code,
    config: config ?? DEFAULT_CONFIG_JSON,
    style: { ...DEFAULT_STYLE, ...(style || {}) },
    starred: false,
    createdAt: now,
    updatedAt: now,
    history: [],
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.docs) && data.docs.length) {
        data.settings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
        data.docs = data.docs.map((d) => ({ ...createDoc(), ...d, style: { ...DEFAULT_STYLE, ...(d.style || {}) } }));
        return data;
      }
    }
  } catch (e) {
    console.warn('Gagal memuat workspace', e);
  }
  const first = createDoc({ name: 'Proses Checkout' });
  return { docs: [first], activeId: first.id, settings: { ...DEFAULT_SETTINGS } };
}

class Store extends EventTarget {
  constructor() {
    super();
    this.state = load();
    this._saveTimer = null;
    this.lastSavedAt = Date.now();
  }

  get docs() {
    return this.state.docs;
  }
  get settings() {
    return this.state.settings;
  }
  get active() {
    return this.state.docs.find((d) => d.id === this.state.activeId) || this.state.docs[0];
  }

  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  persist(immediate = false) {
    clearTimeout(this._saveTimer);
    const write = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(this.state));
        this.lastSavedAt = Date.now();
        this.emit('saved');
      } catch (e) {
        // Quota exceeded: trim history and retry once.
        this.state.docs.forEach((d) => (d.history = d.history.slice(0, 10)));
        try {
          localStorage.setItem(KEY, JSON.stringify(this.state));
        } catch (err) {
          this.emit('error', { message: 'Penyimpanan lokal penuh. Ekspor backup lalu hapus beberapa dokumen.' });
        }
      }
    };
    if (immediate) write();
    else this._saveTimer = setTimeout(write, 400);
  }

  setActive(id) {
    if (!this.docs.some((d) => d.id === id)) return;
    this.state.activeId = id;
    this.persist();
    this.emit('active', this.active);
  }

  updateActive(patch, { silent = false } = {}) {
    const doc = this.active;
    Object.assign(doc, patch, { updatedAt: Date.now() });
    this.persist();
    if (!silent) this.emit('doc-updated', doc);
  }

  updateDoc(id, patch) {
    const doc = this.docs.find((d) => d.id === id);
    if (!doc) return;
    Object.assign(doc, patch, { updatedAt: Date.now() });
    this.persist();
    this.emit('docs-changed');
  }

  addDoc(opts, { activate = true } = {}) {
    const doc = createDoc(opts);
    this.state.docs.unshift(doc);
    if (activate) this.state.activeId = doc.id;
    this.persist();
    this.emit('docs-changed');
    if (activate) this.emit('active', doc);
    return doc;
  }

  duplicateDoc(id) {
    const src = this.docs.find((d) => d.id === id);
    if (!src) return;
    return this.addDoc({ name: `${src.name} (salinan)`, code: src.code, style: { ...src.style }, config: src.config });
  }

  deleteDoc(id) {
    const idx = this.docs.findIndex((d) => d.id === id);
    if (idx < 0) return;
    this.state.docs.splice(idx, 1);
    if (!this.state.docs.length) this.state.docs.push(createDoc());
    if (this.state.activeId === id) {
      this.state.activeId = this.state.docs[Math.min(idx, this.state.docs.length - 1)].id;
      this.emit('active', this.active);
    }
    this.persist();
    this.emit('docs-changed');
  }

  // ---- Version history ----
  snapshot(label = 'Auto-save', { force = false } = {}) {
    const doc = this.active;
    const last = doc.history[0];
    if (!force && last && last.code === doc.code) return false;
    doc.history.unshift({ id: uid(), ts: Date.now(), label, code: doc.code });
    doc.history = doc.history.slice(0, MAX_HISTORY);
    this.persist();
    this.emit('history-changed', doc);
    return true;
  }

  maybeAutoSnapshot() {
    const doc = this.active;
    const mins = this.settings.autoSnapshotMinutes || 3;
    const last = doc.history[0];
    if (!last || Date.now() - last.ts > mins * 60_000) this.snapshot('Auto-save');
  }

  deleteSnapshot(snapId) {
    const doc = this.active;
    doc.history = doc.history.filter((h) => h.id !== snapId);
    this.persist();
    this.emit('history-changed', doc);
  }

  // ---- Settings ----
  setSetting(key, value) {
    this.state.settings[key] = value;
    this.persist();
    this.emit('settings', { key, value });
  }

  // ---- Backup ----
  exportBackup() {
    return JSON.stringify({ app: 'karsa-studio', version: 1, exportedAt: new Date().toISOString(), docs: this.docs }, null, 2);
  }

  importBackup(json) {
    const data = JSON.parse(json);
    const docs = Array.isArray(data) ? data : data.docs;
    if (!Array.isArray(docs)) throw new Error('Format backup tidak dikenali');
    let n = 0;
    for (const d of docs.reverse()) {
      if (typeof d.code !== 'string') continue;
      const doc = { ...createDoc(), ...d, id: uid(), style: { ...DEFAULT_STYLE, ...(d.style || {}) } };
      this.state.docs.unshift(doc);
      n++;
    }
    this.persist(true);
    this.emit('docs-changed');
    return n;
  }
}

export const store = new Store();
