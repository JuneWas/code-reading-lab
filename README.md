# Code Reading Lab

Java・JavaScript のコードを読み、修正し、自分で書く力を養う学習サイトです。実務で Java、JavaScript、Spring Boot、Vue.js を使う Web システムを自力で扱えるようになることを目指します。

現在は Java と JavaScript のコードリーディング演習を利用できます。今後の学習機能は [要件](docs/requirements.md) に記載しています。

## 使用技術

- Vue 3、JavaScript、Vite、CSS、Highlight.js
- npm による依存関係管理、GitHub によるバージョン管理

## セットアップと起動

Node.js 20.19 以上の 20 系、または 22.12 以上と npm が必要です。リポジトリ直下で実行します。

```sh
npm ci
npm run dev
```

開発サーバーが表示する URL をブラウザで開きます。

```sh
npm run build
npm run preview
```

ビルド成果物は `dist/` に生成されます。`npm run preview` でビルド済み画面をローカルで確認できます。

## 演習の操作方法

1. 問題一覧で「すべて」「Java」「JavaScript」を選び、問題を開きます。
2. 色分けされたソースコードを読み、選択肢を一つ選んで「回答する」を押します。
3. 正誤、正解、解説を確認し、「問題一覧へ戻る」または「別の問題を解く」から一覧に戻ります。

## ディレクトリ構成

| パス | 内容 |
| --- | --- |
| `index.html` | Vite の HTML エントリーポイント |
| `src/` | Vue のエントリーポイントと CSS、`components/` の画面、`data/` の問題、`lib/` の回答判定 |
| `public/` | ファビコンなどの静的ファイル |
| `docs/` | 要件、アーキテクチャ、進捗、設計判断 |
| `package.json`、`package-lock.json`、`vite.config.js` | 依存関係、npm スクリプト、Vite の設定 |

開発を再開するときは [AGENTS.md](AGENTS.md) と [進捗](docs/progress.md) から読み進めてください。
