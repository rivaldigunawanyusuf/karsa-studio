// Built-in Mermaid themes and curated custom presets (based on the `base` theme).

export const MERMAID_THEMES = [
  { id: 'auto', name: 'Auto (Ikuti UI)' },
  { id: 'default', name: 'Default (Terang)' },
  { id: 'neutral', name: 'Neutral (Terang)' },
  { id: 'dark', name: 'Dark (Gelap)' },
  { id: 'forest', name: 'Forest (Hijau)' },
  { id: 'base', name: 'Base (Kustom)' },
];

export const PRESETS = [
  {
    id: 'indigo-night',
    name: 'Indigo Night',
    dark: true,
    swatch: ['#1e1b4b', '#6366f1', '#a5b4fc'],
    vars: {
      darkMode: true,
      background: '#0f0f1a',
      primaryColor: '#312e81',
      primaryTextColor: '#e0e7ff',
      primaryBorderColor: '#818cf8',
      secondaryColor: '#1e293b',
      tertiaryColor: '#172036',
      lineColor: '#a5b4fc',
      textColor: '#e0e7ff',
      mainBkg: '#312e81',
      clusterBkg: '#16163a',
      clusterBorder: '#6366f1',
      noteBkgColor: '#3730a3',
      noteTextColor: '#e0e7ff',
      edgeLabelBackground: '#1e1b4b',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    swatch: ['#e0f2fe', '#0ea5e9', '#0369a1'],
    vars: {
      primaryColor: '#e0f2fe',
      primaryTextColor: '#0c4a6e',
      primaryBorderColor: '#0ea5e9',
      secondaryColor: '#ccfbf1',
      tertiaryColor: '#f0f9ff',
      lineColor: '#0369a1',
      clusterBkg: '#f0f9ff',
      clusterBorder: '#7dd3fc',
      noteBkgColor: '#fef9c3',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    swatch: ['#fff1e6', '#fb7185', '#f97316'],
    vars: {
      primaryColor: '#ffe4e6',
      primaryTextColor: '#881337',
      primaryBorderColor: '#fb7185',
      secondaryColor: '#ffedd5',
      tertiaryColor: '#fff7ed',
      lineColor: '#ea580c',
      clusterBkg: '#fff7ed',
      clusterBorder: '#fdba74',
    },
  },
  {
    id: 'mint',
    name: 'Fresh Mint',
    swatch: ['#ecfdf5', '#10b981', '#047857'],
    vars: {
      primaryColor: '#d1fae5',
      primaryTextColor: '#064e3b',
      primaryBorderColor: '#10b981',
      secondaryColor: '#e0f2fe',
      tertiaryColor: '#f0fdf4',
      lineColor: '#047857',
      clusterBkg: '#f0fdf4',
      clusterBorder: '#6ee7b7',
    },
  },
  {
    id: 'mono',
    name: 'Monochrome',
    swatch: ['#ffffff', '#71717a', '#18181b'],
    vars: {
      primaryColor: '#fafafa',
      primaryTextColor: '#18181b',
      primaryBorderColor: '#3f3f46',
      secondaryColor: '#f4f4f5',
      tertiaryColor: '#ffffff',
      lineColor: '#3f3f46',
      clusterBkg: '#f4f4f5',
      clusterBorder: '#a1a1aa',
    },
  },
  {
    id: 'pastel',
    name: 'Pastel Dream',
    swatch: ['#f5f3ff', '#c4b5fd', '#f9a8d4'],
    vars: {
      primaryColor: '#ede9fe',
      primaryTextColor: '#4c1d95',
      primaryBorderColor: '#c4b5fd',
      secondaryColor: '#fce7f3',
      tertiaryColor: '#ecfeff',
      lineColor: '#a78bfa',
      clusterBkg: '#faf5ff',
      clusterBorder: '#ddd6fe',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    swatch: ['#eff6ff', '#2563eb', '#1e3a8a'],
    vars: {
      primaryColor: '#dbeafe',
      primaryTextColor: '#1e3a8a',
      primaryBorderColor: '#2563eb',
      secondaryColor: '#f1f5f9',
      tertiaryColor: '#f8fafc',
      lineColor: '#334155',
      clusterBkg: '#f8fafc',
      clusterBorder: '#94a3b8',
      fontFamily: 'Inter, Segoe UI, Helvetica, Arial, sans-serif',
    },
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    dark: true,
    swatch: ['#0a0a0a', '#22d3ee', '#e879f9'],
    vars: {
      darkMode: true,
      background: '#09090b',
      primaryColor: '#0b1120',
      primaryTextColor: '#67e8f9',
      primaryBorderColor: '#22d3ee',
      secondaryColor: '#1a0b20',
      tertiaryColor: '#111827',
      lineColor: '#e879f9',
      textColor: '#e4e4e7',
      mainBkg: '#0b1120',
      clusterBkg: '#0c0a14',
      clusterBorder: '#a21caf',
      edgeLabelBackground: '#18181b',
      noteBkgColor: '#3b0764',
      noteTextColor: '#f5d0fe',
    },
  },
];

export const CURVES = ['basis', 'linear', 'cardinal', 'catmullRom', 'monotoneX', 'monotoneY', 'natural', 'step', 'stepBefore', 'stepAfter', 'bumpX', 'bumpY'];

export const FONTS = [
  { id: '', name: 'Default (Trebuchet)' },
  { id: 'Inter, system-ui, sans-serif', name: 'Inter' },
  { id: 'system-ui, -apple-system, Segoe UI, sans-serif', name: 'System UI' },
  { id: 'Georgia, Times New Roman, serif', name: 'Serif (Georgia)' },
  { id: "'JetBrains Mono', Menlo, monospace", name: 'Monospace' },
  { id: "'Comic Sans MS', 'Comic Neue', cursive", name: 'Handwritten' },
];

export const COLOR_VARS = [
  { key: 'primaryColor', label: 'Primary (node)' },
  { key: 'primaryTextColor', label: 'Teks node' },
  { key: 'primaryBorderColor', label: 'Border node' },
  { key: 'lineColor', label: 'Garis / panah' },
  { key: 'secondaryColor', label: 'Secondary' },
  { key: 'tertiaryColor', label: 'Tertiary' },
  { key: 'clusterBkg', label: 'Background subgraph' },
  { key: 'noteBkgColor', label: 'Background note' },
];

export function getPreset(id) {
  return PRESETS.find((p) => p.id === id);
}
