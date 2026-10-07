// Snippet & keyword definitions per diagram type.
// Snippets use CodeMirror snippet syntax: ${1:placeholder}, ${2}, ...

export const DIAGRAM_KEYWORDS = [
  { word: 'flowchart', type: 'flowchart', detail: 'Flowchart' },
  { word: 'graph', type: 'flowchart', detail: 'Flowchart (legacy)' },
  { word: 'sequenceDiagram', type: 'sequence', detail: 'Sequence diagram' },
  { word: 'classDiagram', type: 'class', detail: 'Class diagram' },
  { word: 'classDiagram-v2', type: 'class', detail: 'Class diagram v2' },
  { word: 'stateDiagram-v2', type: 'state', detail: 'State diagram' },
  { word: 'stateDiagram', type: 'state', detail: 'State diagram (legacy)' },
  { word: 'erDiagram', type: 'er', detail: 'Entity Relationship' },
  { word: 'gantt', type: 'gantt', detail: 'Gantt chart' },
  { word: 'pie', type: 'pie', detail: 'Pie chart' },
  { word: 'journey', type: 'journey', detail: 'User journey' },
  { word: 'gitGraph', type: 'git', detail: 'Git graph' },
  { word: 'mindmap', type: 'mindmap', detail: 'Mindmap' },
  { word: 'timeline', type: 'timeline', detail: 'Timeline' },
  { word: 'quadrantChart', type: 'quadrant', detail: 'Quadrant chart' },
  { word: 'requirementDiagram', type: 'requirement', detail: 'Requirement diagram' },
  { word: 'C4Context', type: 'c4', detail: 'C4 Context' },
  { word: 'C4Container', type: 'c4', detail: 'C4 Container' },
  { word: 'C4Component', type: 'c4', detail: 'C4 Component' },
  { word: 'C4Dynamic', type: 'c4', detail: 'C4 Dynamic' },
  { word: 'C4Deployment', type: 'c4', detail: 'C4 Deployment' },
  { word: 'sankey-beta', type: 'sankey', detail: 'Sankey' },
  { word: 'xychart-beta', type: 'xychart', detail: 'XY chart' },
  { word: 'block-beta', type: 'block', detail: 'Block diagram' },
  { word: 'packet-beta', type: 'packet', detail: 'Packet diagram' },
  { word: 'architecture-beta', type: 'architecture', detail: 'Architecture' },
  { word: 'kanban', type: 'kanban', detail: 'Kanban' },
  { word: 'radar-beta', type: 'radar', detail: 'Radar chart' },
  { word: 'treemap-beta', type: 'treemap', detail: 'Treemap' },
  { word: 'ishikawa-beta', type: 'ishikawa', detail: 'Ishikawa / Fishbone' },
  { word: 'venn-beta', type: 'venn', detail: 'Venn diagram' },
  { word: 'treeView-beta', type: 'treeView', detail: 'Tree view' },
  { word: 'usecase-beta', type: 'usecase', detail: 'Use case' },
  { word: 'wardley-beta', type: 'wardley', detail: 'Wardley map' },
  { word: 'cynefin-beta', type: 'cynefin', detail: 'Cynefin' },
  { word: 'eventmodeling', type: 'eventmodeling', detail: 'Event modeling' },
  { word: 'railroad-beta', type: 'railroad', detail: 'Railroad' },
  { word: 'railroad-ebnf-beta', type: 'railroad', detail: 'Railroad (EBNF)' },
  { word: 'railroad-abnf-beta', type: 'railroad', detail: 'Railroad (ABNF)' },
  { word: 'railroad-peg-beta', type: 'railroad', detail: 'Railroad (PEG)' },
  { word: 'swimlane-beta', type: 'swimlane', detail: 'Swimlane' },
];

export const TYPE_LABELS = {
  flowchart: 'Flowchart',
  sequence: 'Sequence',
  class: 'Class',
  state: 'State',
  er: 'ER Diagram',
  gantt: 'Gantt',
  pie: 'Pie',
  journey: 'Journey',
  git: 'Git Graph',
  mindmap: 'Mindmap',
  timeline: 'Timeline',
  quadrant: 'Quadrant',
  requirement: 'Requirement',
  c4: 'C4',
  sankey: 'Sankey',
  xychart: 'XY Chart',
  block: 'Block',
  packet: 'Packet',
  architecture: 'Architecture',
  kanban: 'Kanban',
  radar: 'Radar',
  treemap: 'Treemap',
  ishikawa: 'Ishikawa',
  venn: 'Venn',
  treeView: 'Tree View',
  usecase: 'Use Case',
  wardley: 'Wardley',
  cynefin: 'Cynefin',
  eventmodeling: 'Event Modeling',
  railroad: 'Railroad',
  swimlane: 'Swimlane',
};

export const KEYWORDS_BY_TYPE = {
  flowchart: ['subgraph', 'end', 'direction', 'classDef', 'class', 'style', 'linkStyle', 'click', 'call', 'href', 'TB', 'TD', 'BT', 'RL', 'LR', 'default'],
  sequence: ['participant', 'actor', 'as', 'autonumber', 'activate', 'deactivate', 'Note', 'over', 'left of', 'right of', 'loop', 'alt', 'else', 'opt', 'par', 'and', 'critical', 'option', 'break', 'rect', 'end', 'box', 'create', 'destroy', 'link', 'links'],
  class: ['class', 'namespace', 'note', 'for', 'direction', 'classDef', 'style', 'cssClass', 'callback', 'link', '<<interface>>', '<<abstract>>', '<<enumeration>>', '<<service>>'],
  state: ['state', 'note', 'end note', 'left of', 'right of', 'direction', 'classDef', 'class', 'as', '<<fork>>', '<<join>>', '<<choice>>', '[*]'],
  er: ['PK', 'FK', 'UK', 'direction', 'style', 'classDef', 'class'],
  gantt: ['title', 'dateFormat', 'axisFormat', 'tickInterval', 'excludes', 'includes', 'todayMarker', 'section', 'done', 'active', 'crit', 'milestone', 'after', 'until', 'weekday'],
  pie: ['title', 'showData'],
  journey: ['title', 'section'],
  git: ['commit', 'branch', 'checkout', 'switch', 'merge', 'cherry-pick', 'id:', 'tag:', 'type:', 'NORMAL', 'REVERSE', 'HIGHLIGHT', 'order:'],
  mindmap: ['root', '::icon()'],
  timeline: ['title', 'section'],
  quadrant: ['title', 'x-axis', 'y-axis', 'quadrant-1', 'quadrant-2', 'quadrant-3', 'quadrant-4'],
  requirement: ['requirement', 'functionalRequirement', 'interfaceRequirement', 'performanceRequirement', 'physicalRequirement', 'designConstraint', 'element', 'id:', 'text:', 'risk:', 'verifymethod:', 'type:', 'docref:', 'contains', 'copies', 'derives', 'satisfies', 'verifies', 'refines', 'traces'],
  c4: ['title', 'Person', 'Person_Ext', 'System', 'System_Ext', 'SystemDb', 'SystemQueue', 'Container', 'ContainerDb', 'Component', 'Boundary', 'Enterprise_Boundary', 'System_Boundary', 'Container_Boundary', 'Rel', 'BiRel', 'Rel_U', 'Rel_D', 'Rel_L', 'Rel_R', 'UpdateLayoutConfig', 'UpdateRelStyle', 'UpdateElementStyle'],
  xychart: ['title', 'x-axis', 'y-axis', 'bar', 'line', 'horizontal'],
  block: ['columns', 'space', 'block', 'end', 'style', 'classDef', 'class'],
  architecture: ['group', 'service', 'junction', 'in', 'cloud', 'database', 'disk', 'internet', 'server'],
  kanban: ['assigned', 'priority', 'ticket'],
  radar: ['title', 'axis', 'curve', 'max', 'min', 'graticule', 'ticks', 'showLegend'],
  packet: ['title'],
  venn: ['title', 'set', 'union'],
  wardley: ['title', 'size', 'anchor', 'component', 'evolve', 'label', 'note', 'pipeline'],
  cynefin: ['title', 'complex', 'complicated', 'clear', 'chaotic', 'confusion'],
  usecase: ['actor'],
  eventmodeling: ['tf', 'ui', 'cmd', 'evt', 'rmo'],
  railroad: ['title', 'sequence', 'choice', 'optional', 'zeroOrMore', 'oneOrMore', 'terminal', 'nonterminal'],
};

export const COMMON_KEYWORDS = ['title', 'accTitle', 'accDescr'];

// Snippets used by both autocomplete and the quick-insert toolbar.
export const SNIPPETS_BY_TYPE = {
  flowchart: [
    { label: 'Node', icon: '▭', detail: 'Node kotak', snippet: '${1:id}[${2:Label}]' },
    { label: 'Rounded', icon: '▢', detail: 'Node rounded', snippet: '${1:id}(${2:Label})' },
    { label: 'Decision', icon: '◇', detail: 'Keputusan', snippet: '${1:id}{${2:Kondisi?}}' },
    { label: 'Database', icon: '⛁', detail: 'Silinder database', snippet: '${1:db}[(${2:Database})]' },
    { label: 'Circle', icon: '○', detail: 'Lingkaran', snippet: '${1:id}((${2:Label}))' },
    { label: 'Link', icon: '→', detail: 'Panah dengan label', snippet: '${1:A} -->|${2:label}| ${3:B}' },
    { label: 'Dotted', icon: '⇢', detail: 'Panah putus-putus', snippet: '${1:A} -.-> ${2:B}' },
    { label: 'Thick', icon: '⇒', detail: 'Panah tebal', snippet: '${1:A} ==> ${2:B}' },
    { label: 'Subgraph', icon: '▣', detail: 'Kelompok node', snippet: 'subgraph ${1:id}[${2:Judul}]\n    direction ${3:TB}\n    ${4}\nend' },
    { label: 'Shape @{}', icon: '⬡', detail: 'Bentuk baru (v11+)', snippet: '${1:id}@{ shape: ${2:hex}, label: "${3:Label}" }' },
    { label: 'classDef', icon: '🎨', detail: 'Definisi style', snippet: 'classDef ${1:nama} fill:${2:#6366f1},stroke:${3:#4338ca},color:${4:#fff}' },
    { label: 'Click', icon: '🔗', detail: 'Link pada node', snippet: 'click ${1:id} href "${2:https://}" _blank' },
  ],
  sequence: [
    { label: 'Participant', icon: '▭', detail: 'Partisipan', snippet: 'participant ${1:A} as ${2:Alias}' },
    { label: 'Actor', icon: '☺', detail: 'Aktor', snippet: 'actor ${1:U} as ${2:User}' },
    { label: 'Message', icon: '→', detail: 'Pesan sinkron', snippet: '${1:A}->>${2:B}: ${3:pesan}' },
    { label: 'Reply', icon: '⇠', detail: 'Balasan', snippet: '${1:B}-->>${2:A}: ${3:balasan}' },
    { label: 'Alt', icon: '⎇', detail: 'Alternatif', snippet: 'alt ${1:kondisi}\n    ${2}\nelse ${3:lainnya}\n    ${4}\nend' },
    { label: 'Loop', icon: '↻', detail: 'Perulangan', snippet: 'loop ${1:Setiap menit}\n    ${2}\nend' },
    { label: 'Par', icon: '∥', detail: 'Paralel', snippet: 'par ${1:Aksi 1}\n    ${2}\nand ${3:Aksi 2}\n    ${4}\nend' },
    { label: 'Note', icon: '✎', detail: 'Catatan', snippet: 'Note over ${1:A},${2:B}: ${3:catatan}' },
    { label: 'Rect', icon: '▢', detail: 'Highlight area', snippet: 'rect rgb(${1:99, 102, 241, 0.1})\n    ${2}\nend' },
  ],
  class: [
    { label: 'Class', icon: '▤', detail: 'Kelas', snippet: 'class ${1:Nama} {\n    +${2:String} ${3:atribut}\n    +${4:method}() ${5:void}\n}' },
    { label: 'Interface', icon: '◌', detail: 'Interface', snippet: 'class ${1:INama} {\n    <<interface>>\n    +${2:method}()\n}' },
    { label: 'Inheritance', icon: '◁', detail: 'Pewarisan', snippet: '${1:Parent} <|-- ${2:Child}' },
    { label: 'Composition', icon: '◆', detail: 'Komposisi', snippet: '${1:A} *-- ${2:B}' },
    { label: 'Aggregation', icon: '◇', detail: 'Agregasi', snippet: '${1:A} o-- ${2:B}' },
    { label: 'Association', icon: '→', detail: 'Asosiasi', snippet: '${1:A} "${2:1}" --> "${3:*}" ${4:B} : ${5:label}' },
    { label: 'Note', icon: '✎', detail: 'Catatan', snippet: 'note for ${1:Kelas} "${2:catatan}"' },
  ],
  state: [
    { label: 'State', icon: '▢', detail: 'State', snippet: '${1:State} : ${2:deskripsi}' },
    { label: 'Transition', icon: '→', detail: 'Transisi', snippet: '${1:A} --> ${2:B} : ${3:event}' },
    { label: 'Start', icon: '●', detail: 'Awal', snippet: '[*] --> ${1:State}' },
    { label: 'End', icon: '◉', detail: 'Akhir', snippet: '${1:State} --> [*]' },
    { label: 'Composite', icon: '▣', detail: 'State bertingkat', snippet: 'state ${1:Nama} {\n    [*] --> ${2:Sub}\n    ${3}\n}' },
    { label: 'Choice', icon: '◇', detail: 'Pilihan', snippet: 'state ${1:pilih} <<choice>>' },
    { label: 'Note', icon: '✎', detail: 'Catatan', snippet: 'note right of ${1:State}\n    ${2:catatan}\nend note' },
  ],
  er: [
    { label: 'Entity', icon: '⛁', detail: 'Tabel/entitas', snippet: '${1:TABLE} {\n    ${2:bigint} ${3:id} PK\n    ${4:varchar} ${5:name}\n    timestamp created_at\n}' },
    { label: '1 → N', icon: '⊣<', detail: 'One to many', snippet: '${1:PARENT} ||--o{ ${2:CHILD} : "${3:memiliki}"' },
    { label: '1 → 1', icon: '⊣⊢', detail: 'One to one', snippet: '${1:A} ||--|| ${2:B} : "${3:punya}"' },
    { label: 'N → M', icon: '>⊢<', detail: 'Many to many', snippet: '${1:A} }o--o{ ${2:B} : "${3:terkait}"' },
    { label: '0..1', icon: '○|', detail: 'Zero or one', snippet: '${1:A} ||--o| ${2:B} : "${3:opsional}"' },
    { label: 'Non-identifying', icon: '┄', detail: 'Relasi putus-putus', snippet: '${1:A} ||..o{ ${2:B} : "${3:refer}"' },
    { label: 'Attribute FK', icon: '🔑', detail: 'Kolom foreign key', snippet: '${1:bigint} ${2:parent_id} FK "${3:komentar}"' },
  ],
  gantt: [
    { label: 'Section', icon: '§', detail: 'Bagian', snippet: 'section ${1:Nama}' },
    { label: 'Task', icon: '▬', detail: 'Tugas', snippet: '${1:Nama tugas} :${2:id}, ${3:2026-01-01}, ${4:5d}' },
    { label: 'After', icon: '⇥', detail: 'Tugas setelah', snippet: '${1:Nama tugas} :${2:id}, after ${3:prev}, ${4:3d}' },
    { label: 'Milestone', icon: '◆', detail: 'Milestone', snippet: '${1:Rilis} :milestone, ${2:m1}, after ${3:prev}, 0d' },
    { label: 'Critical', icon: '!', detail: 'Tugas kritis', snippet: '${1:Nama} :crit, ${2:id}, after ${3:prev}, ${4:5d}' },
  ],
  pie: [{ label: 'Slice', icon: '◔', detail: 'Irisan', snippet: '"${1:Label}" : ${2:10}' }],
  journey: [
    { label: 'Section', icon: '§', detail: 'Tahap', snippet: 'section ${1:Tahap}' },
    { label: 'Task', icon: '☺', detail: 'Aktivitas', snippet: '${1:Aktivitas}: ${2:5}: ${3:Aktor}' },
  ],
  git: [
    { label: 'Commit', icon: '●', detail: 'Commit', snippet: 'commit id: "${1:pesan}"' },
    { label: 'Branch', icon: '⑂', detail: 'Branch baru', snippet: 'branch ${1:feature}\ncheckout ${1:feature}' },
    { label: 'Merge', icon: '⤵', detail: 'Merge', snippet: 'checkout ${1:main}\nmerge ${2:feature}' },
    { label: 'Tag', icon: '🏷', detail: 'Commit + tag', snippet: 'commit tag: "${1:v1.0.0}"' },
  ],
  mindmap: [
    { label: 'Child', icon: '└', detail: 'Cabang', snippet: '${1:Topik}' },
    { label: 'Circle', icon: '○', detail: 'Node lingkaran', snippet: '((${1:Topik}))' },
    { label: 'Cloud', icon: '☁', detail: 'Node awan', snippet: ')${1:Topik}(' },
    { label: 'Icon', icon: '★', detail: 'Ikon', snippet: '::icon(${1:fa fa-star})' },
  ],
  timeline: [
    { label: 'Section', icon: '§', detail: 'Bagian', snippet: 'section ${1:Periode}' },
    { label: 'Event', icon: '•', detail: 'Kejadian', snippet: '${1:2026} : ${2:Kejadian}' },
  ],
  quadrant: [{ label: 'Point', icon: '•', detail: 'Titik', snippet: '${1:Item}: [${2:0.5}, ${3:0.5}]' }],
  xychart: [
    { label: 'Bar', icon: '▆', detail: 'Bar series', snippet: 'bar [${1:10, 20, 30}]' },
    { label: 'Line', icon: '╱', detail: 'Line series', snippet: 'line [${1:10, 20, 30}]' },
  ],
  architecture: [
    { label: 'Group', icon: '▣', detail: 'Group', snippet: 'group ${1:id}(${2:cloud})[${3:Label}]' },
    { label: 'Service', icon: '▭', detail: 'Service', snippet: 'service ${1:id}(${2:server})[${3:Label}] in ${4:group}' },
    { label: 'Edge', icon: '→', detail: 'Koneksi', snippet: '${1:a}:${2:R} --> ${3:L}:${4:b}' },
    { label: 'Logo icon', icon: '◈', detail: 'Ikon logos:*', snippet: 'service ${1:id}(logos:${2:aws-lambda})[${3:Lambda}]' },
  ],
  c4: [
    { label: 'Person', icon: '☺', detail: 'Orang', snippet: 'Person(${1:id}, "${2:Nama}", "${3:Deskripsi}")' },
    { label: 'System', icon: '▭', detail: 'Sistem', snippet: 'System(${1:id}, "${2:Nama}", "${3:Deskripsi}")' },
    { label: 'Container', icon: '▣', detail: 'Container', snippet: 'Container(${1:id}, "${2:Nama}", "${3:Teknologi}", "${4:Deskripsi}")' },
    { label: 'Rel', icon: '→', detail: 'Relasi', snippet: 'Rel(${1:from}, ${2:to}, "${3:Label}", "${4:Protokol}")' },
  ],
  block: [
    { label: 'Columns', icon: '▥', detail: 'Jumlah kolom', snippet: 'columns ${1:3}' },
    { label: 'Block', icon: '▭', detail: 'Blok', snippet: '${1:id}["${2:Label}"]' },
    { label: 'Space', icon: '␣', detail: 'Spasi', snippet: 'space' },
  ],
  kanban: [
    { label: 'Column', icon: '▥', detail: 'Kolom', snippet: '${1:col}[${2:Judul}]' },
    { label: 'Card', icon: '▭', detail: 'Kartu', snippet: '    ${1:id}[${2:Tugas}]@{ assigned: \'${3:nama}\', priority: \'${4:High}\' }' },
  ],
  requirement: [
    { label: 'Requirement', icon: '☑', detail: 'Kebutuhan', snippet: 'requirement ${1:nama} {\n    id: ${2:1}\n    text: ${3:deskripsi}\n    risk: ${4:medium}\n    verifymethod: ${5:test}\n}' },
    { label: 'Element', icon: '▭', detail: 'Elemen', snippet: 'element ${1:nama} {\n    type: ${2:service}\n}' },
    { label: 'Satisfies', icon: '→', detail: 'Relasi', snippet: '${1:element} - satisfies -> ${2:requirement}' },
  ],
  sankey: [{ label: 'Flow', icon: '≋', detail: 'Aliran', snippet: '${1:Sumber},${2:Tujuan},${3:10}' }],
  packet: [{ label: 'Field', icon: '▦', detail: 'Field bit', snippet: '${1:0}-${2:15}: "${3:Field}"' }],
  radar: [
    { label: 'Axis', icon: '✶', detail: 'Sumbu', snippet: 'axis ${1:a}["${2:A}"], ${3:b}["${4:B}"], ${5:c}["${6:C}"]' },
    { label: 'Curve', icon: '◠', detail: 'Kurva', snippet: 'curve ${1:id}["${2:Nama}"]{${3:1, 2, 3}}' },
  ],
  treemap: [
    { label: 'Section', icon: '▩', detail: 'Induk', snippet: '"${1:Kategori}"' },
    { label: 'Leaf', icon: '▪', detail: 'Daun', snippet: '    "${1:Item}": ${2:10}' },
  ],
  venn: [
    { label: 'Set', icon: '○', detail: 'Himpunan', snippet: 'set ${1:Nama}' },
    { label: 'Union', icon: '◎', detail: 'Irisan', snippet: 'union ${1:A},${2:B}["${3:Label}"]' },
  ],
};

export function detectDiagramType(code) {
  if (!code) return null;
  let text = code.replace(/\r\n/g, '\n');
  // strip frontmatter
  const fm = text.match(/^\s*---\n[\s\S]*?\n---\s*\n/);
  if (fm) text = text.slice(fm[0].length);
  const lines = text.split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('%%')) continue;
    const word = line.split(/[\s:;{]/)[0];
    const hit = DIAGRAM_KEYWORDS.find((d) => d.word === word);
    if (hit) return hit.type;
    // C4* and others not in list
    if (/^C4/.test(word)) return 'c4';
    if (/^(sankey|xychart|block|packet|treemap|ishikawa|railroad)/.test(word)) {
      const k = word.replace(/-.*$/, '');
      return { sankey: 'sankey', xychart: 'xychart', block: 'block', packet: 'packet', treemap: 'treemap', ishikawa: 'ishikawa', railroad: 'railroad' }[k];
    }
    if (/^architecture/.test(word)) return 'architecture';
    if (/^requirement/.test(word)) return 'requirement';
    return null;
  }
  return null;
}
