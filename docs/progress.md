# 開発進捗

## 現在のフェーズ

Phase 1 Step 2（学習問題の静的データ実装）が完了。Phase 0 の初期画面は実装・検証済み。GitHub Pages の自動デプロイ設定を実装した。

## 完了した作業

- リポジトリ直下に Vue 3、JavaScript、Vite、CSS の構成を作成し、「Code Reading Lab」のトップ画面を実装した。
- npm の起動・ビルド用スクリプト、ロックファイル、Git の除外設定を用意した。
- README、開発ルール、要件、アーキテクチャ、進捗、設計判断を日本語で整備した。
- Phase 1 Step 1 で、問題の共通項目と読解専用項目、静的データの管理方式、ライティング・複数ファイルへの拡張方針を定義した。Java と JavaScript の読解例を各 1 問記載した。

- Phase 1 Step 2 で、Java と JavaScript の読解問題を各 1 問 `src/data/problems.js` に登録し、`problems` を名前付きでエクスポートした。

- 公開用の Vite ベースパスと GitHub Actions ワークフローを追加した。

## 未完了の作業・未解決事項

- 問題一覧へのデータの組み込み、コード表示、回答判定など、MVP の学習画面は未実装。[要件](requirements.md) にロードマップを記載している。
- ライティング問題の判定方式と専用項目は Phase 3 で決定する。複数ファイルの画面対応は将来の拡張とする。

## 動作確認結果

### Phase 0

2026-11-22 に Node.js 24.22.3、npm 11.19.1 で確認した。

- `npm install` と `npm ci` が成功した。
- `npm run build` が成功し、`dist/` にビルド成果物が生成された。
- `npm run dev` と `npm run preview` を起動し、Chromium の幅 390px と 1440px でページタイトルと見出しを確認した。検証時に横スクロール、ページエラー、コンソールエラーは発生しなかった。

### Phase 1 Step 1

- 要件・アーキテクチャ・設計判断で、必須項目と型、ID の参照方法、拡張方針の整合性を確認した。
- Markdown 内のサンプルを読み込み、共通項目と読解専用項目、問題 ID と選択肢 ID の一意性、正解 ID の参照先を確認した。Java と JavaScript のソースをローカルで実行し、出力が各正解の表示文（`3`、`[2,4,6]`）に一致した。
- `git diff --check` が成功し、変更が設計文書 4 件に限定されていることを確認した。アプリのビルドと画面テストは今回未実施。

### Phase 1 Step 2

- Node.js 24.22.3 で `problems` を名前付きインポートできた。設計例と一致し、Java と JavaScript の読解問題が各 1 問あること、必須項目・許容値・`files` の構造、問題 ID と問題内の選択肢 ID の一意性、`correctChoiceId` の参照先を確認した。
- `npm ci`、`npm run build`、`git diff --check` が成功した。トップ画面のソースに差分がないことを確認した。画面テストは今回未実施。

### GitHub Pages

- Node.js 24.22.3 で `npm ci` と `npm run build` が成功した。`dist/index.html` の JavaScript、CSS、ファビコンが `/code-reading-lab/` 配下を参照し、各ファイルが存在することを確認した。
- ワークフロー YAML を読み込み、トリガー、ジョブ依存、デプロイ権限、並行実行設定を確認した。
- 読解画面ブランチ `feature/reading-practice` に同じベースパス設定を一時適用し、Chromium の幅 1440px と 390px で一覧・詳細のハッシュ遷移、詳細の再読み込み、回答まで確認した。
- GitHub API へのアクセスが拒否されたため、リポジトリの Pages 設定、GitHub Actions の実行結果、公開サイトは未確認。

## 次のステップ

Pages のソースを **GitHub Actions** に設定し、デプロイ設定を `main` に取り込んだ後、Actions の結果と公開 URL の表示を確認する。

## 再開用プロンプト

> JuneWas/code-reading-lab の開発を再開してください。まず `AGENTS.md` と `docs/progress.md` を読み、続けて `docs/` の要件・設計・設計判断を確認してください。進捗に記載された「次のステップ」一つだけを作業ブランチで実施してください。変更を検証して進捗を更新し、作業結果、テスト結果、未解決事項、次のステップ一つを報告してください。
