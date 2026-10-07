// CodeMirror editor factory for the Mermaid code editor and the JSON config editor.
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightSpecialChars } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab, toggleComment } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches, openSearchPanel } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { foldGutter, foldKeymap, indentOnInput, bracketMatching, indentUnit, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { linter, lintGutter, setDiagnostics } from '@codemirror/lint';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { tags as t } from '@lezer/highlight';
import { mermaid } from './mermaid-lang.js';

const baseTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: 'var(--editor-font-size, 14px)',
    backgroundColor: 'transparent',
    color: 'var(--text)',
  },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    lineHeight: '1.65',
  },
  '.cm-content': { caretColor: 'var(--accent)', padding: '12px 0' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--accent)', borderLeftWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: 'var(--selection) !important',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: 'var(--text-faint)',
    border: 'none',
    paddingLeft: '6px',
  },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--text)' },
  '.cm-activeLine': { backgroundColor: 'var(--active-line)' },
  '.cm-foldGutter .cm-gutterElement': { color: 'var(--text-faint)', cursor: 'pointer', padding: '0 4px' },
  '.cm-foldPlaceholder': {
    background: 'var(--accent-soft)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    borderRadius: '4px',
    padding: '0 6px',
  },
  '.cm-matchingBracket': { backgroundColor: 'var(--accent-soft)', outline: '1px solid var(--accent)' },
  '.cm-selectionMatch': { backgroundColor: 'var(--selection-match)' },
  '.cm-searchMatch': { backgroundColor: 'rgba(250, 204, 21, 0.25)', outline: '1px solid rgba(250, 204, 21, 0.6)' },
  '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: 'rgba(250, 204, 21, 0.5)' },
  '.cm-panels': { backgroundColor: 'var(--surface-2)', color: 'var(--text)', borderColor: 'var(--border)' },
  '.cm-panels.cm-panels-bottom': { borderTop: '1px solid var(--border)' },
  '.cm-panel.cm-search': { padding: '8px 10px', fontFamily: 'inherit' },
  '.cm-panel.cm-search input, .cm-panel.cm-search button': { fontFamily: 'inherit' },
  '.cm-textfield': {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: '6px',
    padding: '4px 8px',
  },
  '.cm-button': {
    backgroundImage: 'none',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    borderRadius: '6px',
    padding: '4px 10px',
  },
  '.cm-tooltip': {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
  },
  '.cm-tooltip-autocomplete > ul': { fontFamily: "'JetBrains Mono', monospace", maxHeight: '18em' },
  '.cm-tooltip-autocomplete > ul > li': { padding: '4px 10px !important' },
  '.cm-tooltip-autocomplete > ul > li[aria-selected]': { background: 'var(--accent)', color: '#fff' },
  '.cm-completionDetail': { opacity: 0.6, marginLeft: '12px', fontStyle: 'normal' },
  '.cm-diagnostic-error': { borderLeft: '3px solid var(--danger)' },
  '.cm-lintRange-error': {
    backgroundImage: 'none',
    textDecoration: 'underline wavy var(--danger)',
    textUnderlineOffset: '3px',
  },
  '.cm-lint-marker-error': { content: 'none' },
});

const jsonHighlight = HighlightStyle.define([
  { tag: t.propertyName, color: 'var(--syn-property)' },
  { tag: t.string, color: 'var(--syn-string)' },
  { tag: t.number, color: 'var(--syn-number)' },
  { tag: [t.bool, t.null], color: 'var(--syn-atom)' },
  { tag: t.punctuation, color: 'var(--syn-bracket)' },
]);

function commonExtensions() {
  return [
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    highlightSelectionMatches(),
    indentUnit.of('    '),
    baseTheme,
  ];
}

/**
 * Create the main Mermaid editor.
 * @returns {{ view: EditorView, setCode, getCode, setWrap, setLineNumbers, setErrors, focus, openSearch, toggleComment }}
 */
export function createMermaidEditor(parent, { doc = '', onChange, onCursor, onSave } = {}) {
  const wrapComp = new Compartment();
  const gutterComp = new Compartment();
  let silent = false;

  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        ...commonExtensions(),
        gutterComp.of([lineNumbers(), foldGutter({ openText: '▾', closedText: '▸' })]),
        wrapComp.of([]),
        mermaid(),
        lintGutter(),
        autocompletion({ activateOnTyping: true, icons: true }),
        keymap.of([
          { key: 'Mod-s', preventDefault: true, run: () => (onSave?.(), true) },
          { key: 'Mod-/', run: toggleComment },
          indentWithTab,
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
        ]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged && !silent) onChange?.(u.state.doc.toString());
          if (u.selectionSet || u.docChanged) {
            const pos = u.state.selection.main.head;
            const line = u.state.doc.lineAt(pos);
            onCursor?.({ line: line.number, col: pos - line.from + 1, selection: u.state.selection.main.to - u.state.selection.main.from, lines: u.state.doc.lines });
          }
        }),
      ],
    }),
  });

  return {
    view,
    getCode: () => view.state.doc.toString(),
    setCode(code, { emit = false } = {}) {
      silent = !emit;
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } });
      silent = false;
    },
    /** Replace whole doc but keep it undoable (used for template insert / format). */
    replaceAll(code) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } });
    },
    setWrap(on) {
      view.dispatch({ effects: wrapComp.reconfigure(on ? EditorView.lineWrapping : []) });
    },
    setLineNumbers(on) {
      view.dispatch({
        effects: gutterComp.reconfigure(on ? [lineNumbers(), foldGutter({ openText: '▾', closedText: '▸' })] : []),
      });
    },
    setErrors(errors) {
      const diags = errors.map((e) => {
        const lineNo = Math.min(Math.max(1, e.line || 1), view.state.doc.lines);
        const line = view.state.doc.line(lineNo);
        return { from: line.from, to: Math.max(line.to, line.from), severity: 'error', message: e.message };
      });
      view.dispatch(setDiagnostics(view.state, diags));
    },
    gotoLine(lineNo, { from, to } = {}) {
      const l = view.state.doc.line(Math.min(Math.max(1, lineNo), view.state.doc.lines));
      const anchor = from != null ? l.from + from : l.from;
      const head = to != null ? l.from + to : l.to;
      view.dispatch({ selection: { anchor, head }, scrollIntoView: true });
      view.focus();
    },
    insertAtCursor(text) {
      const { from, to } = view.state.selection.main;
      view.dispatch({ changes: { from, to, insert: text }, selection: { anchor: from + text.length } });
      view.focus();
    },
    focus: () => view.focus(),
    openSearch: () => openSearchPanel(view),
    toggleComment: () => toggleComment(view),
  };
}

/** JSON editor for the mermaid config tab. */
export function createJsonEditor(parent, { doc = '{}', onChange } = {}) {
  let silent = false;
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        ...commonExtensions(),
        lineNumbers(),
        foldGutter({ openText: '▾', closedText: '▸' }),
        json(),
        syntaxHighlighting(jsonHighlight),
        linter(jsonParseLinter()),
        lintGutter(),
        keymap.of([indentWithTab, ...closeBracketsKeymap, ...defaultKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged && !silent) onChange?.(u.state.doc.toString());
        }),
      ],
    }),
  });
  return {
    view,
    getCode: () => view.state.doc.toString(),
    setCode(code) {
      silent = true;
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } });
      silent = false;
    },
  };
}
