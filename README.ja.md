# Karsa Studio

<p align="center">
  <img src="public/favicon.svg" width="96" height="96" alt="Karsa Studio ロゴ" />
</p>

<p align="center">
  <strong>モダンで超高速、100% クライアントサイド動作の Text-to-Diagram スタジオ</strong>
</p>

<p align="center">
  <a href="README.md">English</a> •
  <a href="README.id.md">Bahasa Indonesia</a> •
  <a href="README.zh.md">中文 (Mandarin)</a> •
  <a href="README.ja.md">日本語 (Japanese)</a> •
  <a href="README.ru.md">Русский (Russian)</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ライセンス-CC%20BY--NC%204.0-blue.svg" alt="ライセンス: CC BY-NC 4.0" />
  <img src="https://img.shields.io/badge/アーキテクチャ-100%25%20クライアントサイド-brightgreen.svg" alt="100% クライアントサイド" />
  <img src="https://img.shields.io/badge/PWA-オフラインファースト-orange.svg" alt="PWA オフラインファースト" />
  <img src="https://img.shields.io/badge/Mermaid.js-v12+-blueviolet.svg" alt="Mermaid.js v12+" />
  <img src="https://img.shields.io/badge/エディター-CodeMirror%206-informational.svg" alt="CodeMirror 6" />
</p>

---

**Karsa Studio** は、**オープンソース (非商用)** として公開されている、多機能でプロフェッショナルな *テキストから図へ (Text-to-Diagram)* 変換するエディターです。すべてのレンダリングと構文解析はお使いのブラウザー内（100％ クライアントサイド）で完結し、図のデータが外部サーバーへ送信されることは一切ありません。コードによる作図の柔軟性と、Figma のような直感的なキャンバス操作を融合し、ソフトウェアエンジニア、システムアーキテクト、プロダクトマネージャー、テクニカルライターが数秒でアイデアやシステム構成を視覚化できるように設計されています。

🌐 **オンラインデモ:** [karsa-studio.rivaldigunawanyusuf.com](https://karsa-studio.rivaldigunawanyusuf.com)

---

## 🚀 主な機能と特徴

### 🔒 100% クライアントサイド & オフラインファースト (PWA)
- **サーバー遅延ゼロ:** 構文解析と図の描画はローカル Web Worker とブラウザー JavaScript 上で即座に実行されます。
- **プライバシー保護:** 機密性の高いアーキテクチャ図やデータベース設計、ビジネスロジックがお使いの端末から漏洩することはありません。
- **PWA (Progressive Web App):** デスクトップやモバイル端末にネイティブアプリ感覚でインストール可能。初回起動後は完全なオフライン環境でも動作します。

### 🎨 Figma スタイルのインタラクティブキャンバス
- **Space + ドラッグで自由移動:** `Space` キーを押しながらマウスやポインターをドラッグするだけで、Figma や Miro と同様に無限キャンバスを滑らかにパン移動できます。
- **直感的なズーム操作:** `Ctrl/Cmd + ホイール`、トラックパッドのピンチ操作、または画面上のズームコントロールでスムーズに拡大・縮小。
- **クイック視点切り替え:** 1:1 実寸ビュー (`Cmd/Ctrl + 1`) や画面全体へのフィット (`Cmd/Ctrl + 0`、またはキャンバスのダブルクリック)。
- **多彩なキャンバス背景:** ドット (Dots)、グリッド (Grid)、無地 (Plain)、透明 (Transparent) をテーマの明暗に合わせて選択可能。

### 💻 高機能 CodeMirror 6 エディター
- **モダンな構文ハイライト & リアルタイム検証:** Mermaid の構文エラーを行インジケーターと即時エラーツールチップで分かりやすく表示。
- **デスクトップ & モバイルのスムーズなスクロール:** 適切な高さ境界とスクロールコンテナ設計により、マウスホイール、トラックパッド、モバイルのスワイプ慣性スクロールに対応。
- **クイック挿入ツールバー:** ノード、判断菱形、サブグラフ、データベース、円、破線リンク、太矢印をワンクリックで挿入。
- **プロ仕様の編集機能:** マルチカーソル (`Alt + クリック`)、コード折りたたみ、括弧自動補完、コメント切り替え (`Cmd/Ctrl + /`)、検索・置換 (`Cmd/Ctrl + F`)。
- **柔軟なスプリットレイアウト:** ドラッグ可能な仕切り、縦横の分割切り替え、エディター/プレビューの全画面切り替えに対応。

### 📚 24 種類の業界標準図面テンプレート
実用的なテンプレートを用途別に 6 つのカテゴリーで体系化：
1. **フローチャート & プロセス:** 標準フローチャート、アーキテクチャフロー (LR)、ステートマシン図。
2. **データベース & プログラミング:** リレーショナル DB ER図 (PK/FK)、OOP クラス図、要件トレーサビリティ、ネットワークパケット構造。
3. **インタラクション & システム:** シーケンス図 (認証フロー)、クラウドアーキテクチャ、C4 コンテキスト図、ブロックダイアグラム。
4. **計画 & ロードマップ:** ガントチャート工程表、製品沿革タイムライン、カスタマージャーニーマップ、カンバンタスクボード、Git ブランチグラフ。
5. **分析 & データ可視化:** 円グラフ分布、XY 折れ線/棒グラフ、2x2 優先順位マトリクス、サンキーリソースフロー、レーダーチャート、ツリーマップ。
6. **アイデア構想:** マインドマップ、空のスターターキャンバス。

### 🎭 ビジュアルテーマ & スタイルエンジン
- **ダーク & ライトモード:** スタイリッシュなダークグラスモフィズムとハイコントラストなライトモードをスムーズに切り替え。
- **Mermaid 公式テーマ:** Default、Neutral、Forest、Dark、Base に対応。
- **デザインスタイルプリセット:** 手描き風スケッチ (Sketch)、ミニマル、モダン、ニューモーフィズム、サイバーパンク、レトロ、パステル、ハイコントラスト。
- **高度な自動レイアウト:** 従来の Dagre アルゴリズムに加え、複雑なグラフに適した ELK (Eclipse Layout Kernel) をサポート。
- **カスタムカラーパレット:** プライマリ、セカンダリ、ターシャリ、テキスト、境界線、ライン、サブグラフ、ノートの色をリアルタイムに微調整。

### 📤 多彩なエクスポート & サーバー不要の共有機能
- **ベクター & 超高解像度出力:** ベクター SVG、最大 4x Retina 解像度の超美麗 PNG、PDF 出力に対応。
- **ワンクリッククリップボード:** Mermaid コード、Markdown 埋め込みブロック (Notion、GitHub、Obsidian に直接貼り付け可能)、SVG コード、PNG 画像を即座にコピー。
- **データベース不要のリンク共有:** URL ハッシュと `pako` zlib 圧縮により、サーバーを介さず URL だけで図面データとテーマ設定を完全共有。
- **プロジェクト保存と復元:** 単一ファイルの `.krs` / `.mmd` 保存、複数ドキュメントをまとめた `.karsa` / `.json` の一括バックアップ。

### 🌐 5 言語の多言語対応 (i18n)
画面 UI および全テンプレート説明をリロード不要で瞬時に切り替え可能：
- 🇯🇵 **日本語 (Japanese)**
- 🇬🇧 **English**
- 🇮🇩 **Bahasa Indonesia**
- 🇨🇳 **中文 (Mandarin)**
- 🇷🇺 **Русский (Russian)**

---

## ⌨️ キーボードショートカット一覧

修飾キーはお使いの OS に応じて自動的に切り替わります（macOS: **⌘ Cmd**、Windows / Linux: **Ctrl**）：

| カテゴリー | アクション | Mac ショートカット | Windows / Linux ショートカット |
| :--- | :--- | :--- | :--- |
| **キャンバス** | **キャンバスのパン / 移動** | `Space + ドラッグ` | `Space + ドラッグ` |
| **キャンバス** | **拡大 / 縮小** | `Cmd + =` / `Cmd + -` | `Ctrl + =` / `Ctrl + -` |
| **キャンバス** | **画面にフィット** | `Cmd + 0` *(またはダブルクリック)* | `Ctrl + 0` *(またはダブルクリック)* |
| **キャンバス** | **等倍表示 (1:1)** | 画面上の `1:1` ボタン | 画面上の `1:1` ボタン |
| **エディター** | **スナップショット保存 & 描画** | `Cmd + S` | `Ctrl + S` |
| **エディター** | **強制再描画** | `Cmd + Enter` | `Ctrl + Enter` |
| **エディター** | **検索 & 置換** | `Cmd + F` | `Ctrl + F` |
| **エディター** | **コメントの切り替え** | `Cmd + /` | `Ctrl + /` |
| **エディター** | **元に戻す / やり直し** | `Cmd + Z` / `Cmd + Shift + Z` | `Ctrl + Z` / `Ctrl + Y` |
| **エディター** | **インデント増 / 減** | `Tab` / `Shift + Tab` | `Tab` / `Shift + Tab` |
| **エディター** | **マルチカーソル** | `Alt + クリック` | `Alt + クリック` |
| **エディター** | **コードブロックの折りたたみ** | `Cmd + Alt + [` | `Ctrl + Alt + [` |
| **エディター** | **コード自動補完** | `Ctrl + Space` | `Ctrl + Space` |
| **アプリ** | **新規ドキュメント** | `Alt + N` | `Alt + N` |
| **アプリ** | **サイドバー開閉** | `Cmd + B` | `Ctrl + B` |
| **アプリ** | **SVG エクスポート** | `Cmd + Shift + E` | `Ctrl + Shift + E` |
| **アプリ** | **ショートカットガイド** | `?` | `?` |

---

## 🛠️ ローカル環境での実行 & 開発手順

バックエンドやデータベースのセットアップが不要なため、すぐに起動できます。

### 前提環境
- [Node.js](https://nodejs.org/) (バージョン 18 以上推奨)
- パッケージマネージャー `npm`、`pnpm`、または `yarn`

### 1. 自動スタートスクリプトの利用

**macOS / Linux:**
```bash
# スクリプトに実行権限を付与 (初回のみ)
chmod +x start.sh

# スクリプトの実行
./start.sh
```

**Windows:**
エクスプローラーで `start.bat` をダブルクリックするか、コマンドプロンプトで実行します：
```cmd
start.bat
```

### 2. 手動でのセットアップ
```bash
# リポジトリのクローン
git clone https://github.com/rivaldigunawanyusuf/karsa-studio.git
cd karsa-studio

# 依存パッケージのインストール
npm install

# Vite 開発サーバーの起動
npm run dev
```

ブラウザーで `http://localhost:5173/` にアクセスします。

---

## 📂 プロジェクト構成

```
mermaid-studio/
├── index.html              # メインの Single Page Application (SPA) UI
├── docs.html               # インタラクティブな Mermaid 構文ガイド
├── nginx-security.conf     # Nginx リバースプロキシ & 本番用セキュリティヘッダー設定
├── package.json            # 依存関係 & npm スクリプト
├── vite.config.js          # Vite ビルド設定 & PWA Workbox キャッシュ設定
├── start.sh                # macOS / Linux 用自動起動スクリプト
├── start.bat               # Windows 用自動起動スクリプト
├── public/                 # 静的アセット、アイコン、PWA マニフェスト
└── src/
    ├── main.js             # アプリケーションのメインコントローラー & イベント制御
    ├── styles/
    │   └── index.css       # デザインシステムトークン、グラスモフィズム & レスポンシブ
    └── lib/
        ├── editor.js       # CodeMirror 6 初期化、構文検証 & 拡張機能
        ├── exporter.js     # ベクター SVG、4x PNG、PDF レンダリングモジュール
        ├── i18n.js         # 5 言語の完全な辞書 & リアルタイム翻訳エンジン
        ├── mermaid-lang.js # Lezer ベースの Mermaid 言語構文解析定義
        ├── renderer.js     # Mermaid.js & ELK レイアウトコントローラー
        ├── share.js        # pako zlib 圧縮による URL 共有エンコード処理
        ├── store.js        # LocalStorage & EventTarget によるリアクティブな状態管理
        ├── templates.js    # 24 種類の厳選された業界標準テンプレート集
        ├── themes.js       # カラーパレット、スタイルプリセット、レイアウト設定
        └── ui.js           # トースト通知、ダイアログモーダル、UI ヘルパー
```

---

## 🚀 本番環境へのデプロイ

Karsa Studio は最適化された純粋な**静的シングルページアプリケーション (SPA)** としてビルドされます：

```bash
# プロダクション用バンドルのビルド
npm run build
```

ビルドが完了すると `dist/` フォルダに出力されます。お好みの静的ホスティングサービスへそのままデプロイ可能です：
- **Cloudflare Pages**
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **Nginx / Apache / Caddy** (`nginx-security.conf` を使用して CSP、HSTS 等のセキュリティヘッダーを設定可能)

---

## 📄 ライセンス & 利用規約

本プロジェクトは **クリエイティブ・コモンズ 表示 - 非営利 4.0 国際 (CC BY-NC 4.0)** の下でライセンスされています。

- **利用可能な範囲:** 個人利用、非営利組織内の業務支援、学術研究、オープンソースコミュニティへの貢献目的で、複製・改変・再配布が可能です。
- **遵守条件:** 原作者のクレジット表記が必要です。**営利目的での利用、有料製品としての再販、いかなる形式のマネタイズも固く禁じられています。** 商業的権利は原作者が独占的に保持します。

---

## 👤 開発者 & 謝辞

Developed with care by **Rivaldi Gunawan Yusuf**. [Mermaid.js](https://mermaid.js.org/) および [CodeMirror](https://codemirror.net/) の素晴らしいオープンソース成果に深く感謝いたします。

フィードバックや機能改善のご提案は、GitHub Issues からお気軽にお寄せください！
