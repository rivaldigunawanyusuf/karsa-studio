// CodeMirror 6 language support for Mermaid: highlighting, folding, autocomplete.
import { StreamLanguage, foldService, HighlightStyle, syntaxHighlighting, LanguageSupport } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { snippetCompletion } from '@codemirror/autocomplete';
import {
  DIAGRAM_KEYWORDS,
  KEYWORDS_BY_TYPE,
  COMMON_KEYWORDS,
  SNIPPETS_BY_TYPE,
  detectDiagramType,
} from './snippets.js';

const DIAGRAM_WORDS = new Set(DIAGRAM_KEYWORDS.map((d) => d.word));
const WORD_TO_TYPE = Object.fromEntries(DIAGRAM_KEYWORDS.map((d) => [d.word, d.type]));
const onlyWords = (arr) => arr.filter((k) => /^[\w-]+$/.test(k));
const ALL_KEYWORDS = new Set(
  onlyWords([
    ...Object.values(KEYWORDS_BY_TYPE).flat(),
    ...COMMON_KEYWORDS,
    'end', 'subgraph', 'direction', 'TB', 'TD', 'BT', 'RL', 'LR',
  ])
);
const KEYWORD_SETS = Object.fromEntries(
  Object.entries(KEYWORDS_BY_TYPE).map(([type, list]) => [
    type,
    new Set(onlyWords([...list, ...COMMON_KEYWORDS, 'end', 'direction', 'title'])),
  ])
);
const keywordsFor = (type) => KEYWORD_SETS[type] || new Set(COMMON_KEYWORDS);
const ATOMS = new Set(['PK', 'FK', 'UK', 'true', 'false', 'done', 'active', 'crit', 'milestone']);
const EARLY_ARROWS = [/^[|}][|o](?:--|\.\.)[|o][|{]/, /^<\|(?:--|\.\.)/];

const ARROW_PATTERNS = [
  /^[|}][|o](?:--|\.\.)[|o][|{]/, // ER: ||--o{
  /^<\|(?:--|\.\.)|^(?:--|\.\.)\|>/, // class inheritance
  /^[*o](?=--)--|^--[*o](?![\w])/, // composition/aggregation
  /^--?>>|^--?[x)]|^-->>|^->>/, // sequence
  /^<?-\.+->?/, // dotted
  /^<?={2,}>?/, // thick
  /^<?-{2,}[>ox]?(?![\w-])/, // normal
  /^<?-{2,}>/,
  /^~{3}/,
  /^\.\.>?/,
];

const LABEL_RE =
  /^(\[\[|\[\(|\[\/|\[\\|\(\(\(|\(\(|\(\[|\{\{|\[|\(|\{|>)(.*?)(\]\]|\)\]|\/\]|\\\]|\)\)\)|\)\)|\]\)|\}\}|\]|\)|\})/;

const mermaidStream = {
  name: 'mermaid',
  startState: () => ({ fm: 'none', seenType: false, seenContent: false, lastIdent: false, type: null }),
  copyState: (s) => ({ ...s }),
  token(stream, state) {
    // --- YAML frontmatter ---
    if (state.fm === 'in') {
      if (stream.sol() && stream.match(/^---\s*$/)) {
        state.fm = 'done';
        return 'meta';
      }
      if (stream.eatSpace()) return null;
      if (stream.match(/^#.*/)) return 'comment';
      if (stream.match(/^[\w-]+(?=\s*:)/)) return 'propertyName';
      if (stream.match(/^"[^"]*"?|^'[^']*'?/)) return 'string';
      if (stream.match(/^-?\d+(\.\d+)?\b/)) return 'number';
      if (stream.match(/^(true|false|null)\b/)) return 'bool';
      if (stream.match(/^#[0-9a-fA-F]{3,8}\b/)) return 'color';
      stream.next();
      return null;
    }
    if (state.fm === 'none' && !state.seenContent && stream.sol() && stream.match(/^---\s*$/)) {
      state.fm = 'in';
      state.seenContent = true;
      return 'meta';
    }

    if (stream.eatSpace()) return null;
    state.seenContent = true;

    if (stream.match(/^%%\{.*?\}%%/)) return 'meta';
    if (stream.match(/^%%.*/)) return 'comment';

    if (!state.seenType) {
      const m = stream.match(/^[A-Za-z][\w-]*/);
      if (m) {
        state.seenType = true;
        state.type = WORD_TO_TYPE[m[0]] || (/^C4/.test(m[0]) ? 'c4' : m[0].replace(/-beta$/, ''));
        return 'heading';
      }
    }

    for (const re of EARLY_ARROWS) {
      if (stream.match(re)) {
        state.lastIdent = false;
        return 'operator';
      }
    }

    if (stream.match(/^"(?:[^"\\]|\\.)*"?/)) {
      state.lastIdent = false;
      return 'string';
    }
    if (stream.match(/^`[^`]*`?/)) return 'string';
    if (stream.match(/^\|[^|\n]*\|/)) return 'labelName';
    if (stream.match(/^:::[\w-]+/)) return 'className';
    if (stream.match(/^@\{[^}]*\}?/)) return 'attributeName';
    if (stream.match(/^<<[\w ]+>>/)) return 'typeName';
    if (stream.match(/^\[\*\]/)) return 'atom';
    if (stream.match(/^#[0-9a-fA-F]{3,8}\b/)) return 'color';

    for (const re of ARROW_PATTERNS) {
      if (stream.match(re)) {
        state.lastIdent = false;
        return 'operator';
      }
    }

    if (state.lastIdent) {
      const m = stream.match(LABEL_RE);
      if (m) {
        state.lastIdent = false;
        return 'string';
      }
    }

    if (stream.match(/^-?\d+(\.\d+)?(%|px|d|h|w|ms|s)?\b/)) {
      state.lastIdent = false;
      return 'number';
    }

    const word = stream.match(/^[\w$\u00C0-\uFFFF]+(?:-[\w\u00C0-\uFFFF]+)*/);
    if (word) {
      const w = word[0];
      state.lastIdent = true;
      if (ATOMS.has(w)) return 'atom';
      if (keywordsFor(state.type).has(w) || (state.type === 'flowchart' && w === 'subgraph')) {
        // `subgraph id[Label]` - allow label highlighting after the subgraph id, not the keyword itself
        state.lastIdent = false;
        return 'keyword';
      }
      return 'variableName';
    }

    const ch = stream.next();
    state.lastIdent = false;
    if ('[](){}'.includes(ch)) return 'bracket';
    if (':;,&'.includes(ch)) return 'punctuation';
    return null;
  },
  blankLine(state) {
    state.lastIdent = false;
  },
  languageData: {
    commentTokens: { line: '%%' },
    closeBrackets: { brackets: ['(', '[', '{', '"'] },
  },
};

export const mermaidLanguage = StreamLanguage.define(mermaidStream);

const indentOf = (text) => {
  let n = 0;
  for (const c of text) {
    if (c === ' ') n++;
    else if (c === '\t') n += 4;
    else break;
  }
  return n;
};

const indentFold = foldService.of((state, lineStart) => {
  const line = state.doc.lineAt(lineStart);
  if (!line.text.trim()) return null;
  const ind = indentOf(line.text);
  let last = line.number;
  for (let n = line.number + 1; n <= state.doc.lines; n++) {
    const l = state.doc.line(n);
    if (!l.text.trim()) continue;
    if (indentOf(l.text) > ind) last = n;
    else {
      // include closing `end` / `}` at same indent
      if (last > line.number && /^\s*(end\b|\})/.test(l.text) && indentOf(l.text) === ind) last = n;
      break;
    }
  }
  if (last === line.number) return null;
  return { from: line.to, to: state.doc.line(last).to };
});

export const mermaidHighlight = HighlightStyle.define([
  { tag: t.heading, color: 'var(--syn-heading)', fontWeight: '700' },
  { tag: t.keyword, color: 'var(--syn-keyword)', fontWeight: '600' },
  { tag: t.operator, color: 'var(--syn-operator)', fontWeight: '600' },
  { tag: t.string, color: 'var(--syn-string)' },
  { tag: t.labelName, color: 'var(--syn-label)' },
  { tag: t.comment, color: 'var(--syn-comment)', fontStyle: 'italic' },
  { tag: t.meta, color: 'var(--syn-meta)' },
  { tag: t.number, color: 'var(--syn-number)' },
  { tag: t.bool, color: 'var(--syn-number)' },
  { tag: t.atom, color: 'var(--syn-atom)', fontWeight: '600' },
  { tag: t.variableName, color: 'var(--syn-variable)' },
  { tag: t.propertyName, color: 'var(--syn-property)' },
  { tag: t.className, color: 'var(--syn-class)' },
  { tag: t.typeName, color: 'var(--syn-class)' },
  { tag: t.attributeName, color: 'var(--syn-property)' },
  { tag: t.color, color: 'var(--syn-number)' },
  { tag: t.bracket, color: 'var(--syn-bracket)' },
  { tag: t.punctuation, color: 'var(--syn-bracket)' },
]);

// ---------- Autocomplete ----------
function collectIdentifiers(doc, max = 400) {
  const ids = new Map();
  const re = /(?:^|[\s;&>|-])([A-Za-z_][\w]*)(?=\s*(?:\[|\(|\{|>|-|=|\.|:|&|$|\s))/gm;
  let m;
  let count = 0;
  while ((m = re.exec(doc)) && count < max) {
    const id = m[1];
    if (ALL_KEYWORDS.has(id) || DIAGRAM_WORDS.has(id) || id.length < 2) continue;
    ids.set(id, (ids.get(id) || 0) + 1);
    count++;
  }
  return [...ids.keys()];
}

export function mermaidCompletions(context) {
  const word = context.matchBefore(/[\w-]*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;
  const doc = context.state.doc.toString();
  const type = detectDiagramType(doc);
  const options = [];

  if (!type) {
    for (const d of DIAGRAM_KEYWORDS) {
      options.push({ label: d.word, type: 'class', detail: d.detail, boost: 5 });
    }
  } else {
    for (const k of KEYWORDS_BY_TYPE[type] || []) {
      options.push({ label: k, type: 'keyword', boost: 2 });
    }
    for (const s of SNIPPETS_BY_TYPE[type] || []) {
      options.push(
        snippetCompletion(s.snippet, {
          label: s.label.toLowerCase().replace(/\s+/g, '-'),
          detail: s.detail,
          type: 'text',
          boost: 1,
        })
      );
    }
  }
  for (const k of COMMON_KEYWORDS) options.push({ label: k, type: 'keyword' });
  for (const id of collectIdentifiers(doc)) {
    if (id !== word.text) options.push({ label: id, type: 'variable', boost: -1 });
  }
  return { from: word.from, options, validFor: /^[\w-]*$/ };
}

export function mermaid() {
  return new LanguageSupport(mermaidLanguage, [
    indentFold,
    syntaxHighlighting(mermaidHighlight),
    mermaidLanguage.data.of({ autocomplete: mermaidCompletions }),
  ]);
}
