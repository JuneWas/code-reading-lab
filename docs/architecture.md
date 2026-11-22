# アーキテクチャ

## 現在の構成

ブラウザで動く静的フロントエンドに、問題一覧、コードリーディング演習、コードライティング演習、学習進捗を実装済み。Vite が `index.html` を起点に `src/main.js` を読み込み、Vue が `src/App.vue` をマウントする。開発時は Vite の開発サーバーを使い、配布用ビルドは `dist/` に出力する。

## 技術選定

| 技術 | 採用理由 |
| --- | --- |
| Vue 3 | 画面をコンポーネントに分け、問題一覧や問題画面を段階的に追加できる。 |
| JavaScript | 学習対象の言語を使い、初期構築の設定を少なくできる。 |
| Vite | 開発サーバーと静的ビルドを共通の設定で利用できる。 |
| CSS | 画面のレスポンシブレイアウトと配色を標準機能で実装できる。 |
| Highlight.js | Java と JavaScript のソースを表示用に色分けできる。 |
| CodeMirror 6 | ライティング用に Java・JavaScript の色分け、行番号、編集履歴を提供する。 |
| Lezer | 実行せずに Java・JavaScript の構文を解析する。 |
| npm、GitHub | 依存関係をロックファイルで再現でき、Pull Request でコードと文書を一緒にレビューできる。 |

## ディレクトリ設計

- リポジトリ直下に HTML のエントリーポイント、npm・Vite の設定、開発ルールを置く。
- `src/` に Vue の起動処理、画面、スタイルを置く。
- `public/` にファビコンなどの静的ファイルを置く。
- `docs/` に仕様、設計、進捗、判断の経緯を置く。
- `dist/` はビルド成果物の出力先で、Git 管理対象から除外する。

## コンポーネントと処理の分担

| ファイル | 役割 |
| --- | --- |
| `src/App.vue` | URL ハッシュで一覧と問題タイプに応じた詳細を切り替える。言語と問題タイプのフィルターを保持し、学習履歴を読み込んで提出イベントを処理する。 |
| `src/components/ProblemList.vue` | 言語・問題タイプのフィルターと問題一覧を表示する。 |
| `src/components/ProgressSummary.vue` | 全問題の集計、進捗バー、履歴の削除操作を表示する。 |
| `src/components/ReadingExercise.vue` | 問題文・選択肢・結果を表示し、選択と送信の状態を持つ。問題 ID をキーとして詳細を再生成する。 |
| `src/components/WritingExercise.vue` | 問題文、編集内容、判定結果を管理する。リセットで初期コードを復元する。 |
| `src/components/CodeEditor.vue` | 1 ファイルを編集する CodeMirror インスタンスを管理し、変更を親に通知する。ライティング画面で遅延読み込みする。 |
| `src/lib/gradeWritingAnswer.js` | 問題データと提出ファイル配列を受け取り、構文照合の結果を返す。Vue や DOM に依存しない。 |
| `src/components/ProblemMetadata.vue` | 言語・難易度・カテゴリー・問題タイプを表示する。 |
| `src/components/CodeBlock.vue` | 受け取った 1 ファイルを表示し、Highlight.js で色分けする。 |
| `src/lib/gradeReadingAnswer.js` | 選択肢 ID から正誤と正解を返す。DOM や Vue に依存しない。 |

一覧の URL は `#/`、詳細は `#/problems/<id>` とする。ブラウザの履歴操作と詳細への直接アクセスに対応する。選択と回答結果は詳細画面を開いている間だけ保持する。Highlight.js には Java と JavaScript の文法を登録し、ソースをエスケープしたハイライト結果を描画する。学習用コードの実行処理は持たない。

## 公開構成

- Vite の `base` を `/code-reading-lab/` に設定し、公開先のサブパスから JavaScript、CSS、ファビコンを読み込む。
- `.github/workflows/deploy.yml` は `main` への push または `main` の手動実行を受け、Node.js 24 で `npm ci` と `npm run build` を実行する。`dist/` を Pages 用アーティファクトとして渡し、`github-pages` 環境にデプロイする。ビルドは読み取り権限、デプロイは Pages 書き込みと OIDC トークンの発行権限を持つ。
- リポジトリの Pages ソースには **GitHub Actions** を指定する。公開先は <https://junewas.github.io/code-reading-lab/>。
- 演習画面のハッシュルート（`#/`、`#/problems/<id>`）は、ブラウザが同じ `/code-reading-lab/` の HTML を取得した後に処理する。静的配信側で URL の書き換えは不要。

## 問題データの構造と管理方式

- `src/data/problems.js` に JavaScript の問題オブジェクトの配列を実装し、`problems` として名前付きでエクスポートしている。`App.vue` で読み込み、一覧と詳細にデータを渡す。問題の追加・修正は GitHub の Pull Request でレビューする。データベースや API は導入しない。
- 項目の型と必須条件は [データ要件](requirements.md#学習問題のデータ要件) に従う。一覧は `id`、`language`、`category`、`difficulty`、`type`、`title` を使い、詳細表示は `prompt` と `files` を使う。問題 ID は一覧のキーとして使い、進捗保存でも同じ ID を参照する。
- `type` が `reading` の場合は、選択された ID と `correctChoiceId` を比較して正誤を判定する。`choices` の並び順は表示に使い、ID は翻訳や並べ替えで変わらない値にする。
- `type` が `writing` の場合は、`files` の修正前コード、`prompt` の達成条件、`explanation` を共通項目として使う。`referenceEdit` を初期コードに適用して参照解答を組み立てる。読解問題のデータ形式は従来どおり。
- ソースは MVP でも `files` 配列として持ち、先頭の 1 件を表示する。複数ファイル対応時は、配列順に問題内パスを並べて切り替える。同じファイル名でもディレクトリが異なれば区別できる。

## 読解問題のサンプル

以下は [実装済みの静的データ](../src/data/problems.js) に登録した Java と JavaScript の読解問題各 1 問。

```js
export const problems = [
  {
    id: 'java-integer-division',
    language: 'java',
    category: '演算',
    difficulty: 'beginner',
    type: 'reading',
    title: '整数同士の割り算',
    files: [
      {
        path: 'Main.java',
        content: `class Main {
    public static void main(String[] args) {
        System.out.println(7 / 2);
    }
}`,
      },
    ],
    prompt: 'このプログラムは何を出力しますか？',
    choices: [
      { id: 'integer-result', label: '3' },
      { id: 'decimal-result', label: '3.5' },
    ],
    correctChoiceId: 'integer-result',
    explanation: 'Java では両方のオペランドが整数の場合、整数除算となり、小数部分は切り捨てられます。',
  },
  {
    id: 'javascript-array-map',
    language: 'javascript',
    category: '配列',
    difficulty: 'beginner',
    type: 'reading',
    title: 'map で配列の要素を変換する',
    files: [
      {
        path: 'main.js',
        content: `const values = [1, 2, 3];
console.log(JSON.stringify(values.map((value) => value * 2)));`,
      },
    ],
    prompt: 'このプログラムは何を出力しますか？',
    choices: [
      { id: 'original-values', label: '[1,2,3]' },
      { id: 'doubled-values', label: '[2,4,6]' },
    ],
    correctChoiceId: 'doubled-values',
    explanation: 'map は各要素にコールバックを適用した新しい配列を返します。各要素を 2 倍にした結果が JSON 文字列として出力されます。',
  },
]
```

## 学習進捗の保存と集計

`localStorage` のキーは `code-reading-lab:learning-progress`。値は `{ version: 1, history: { [problemId]: entry } }` 形式の JSON とする。各 `entry` は `attemptCount`、`correctCount`、UTC の ISO 8601 形式の `lastAnsweredAt`、真偽値の `lastAnswerCorrect` と `everCorrect` を持つ。未回答問題に行は作成しない。

- 読解・ライティング画面は提出時だけ問題 ID と正誤を `App.vue` に通知する。既存の判定処理が返した正誤を使い、回答コードは保存処理へ渡さない。
- `src/lib/learningProgress.js` は履歴更新、ステータス判定、集計を副作用のない関数として提供する。集計は現在の問題 ID に限定する。
- `src/lib/progressStorage.js` は保存、復元、削除を担当する。不正 JSON は空の履歴として扱い、不正な行や削除済み問題を除外する。未対応バージョンは明示的に削除するまで保持する。アクセス失敗時はメモリ内で進捗を更新し、画面に通知する。確認後の削除でストレージ操作に失敗した場合は画面上の履歴を消し、保存済み履歴が残る可能性を通知する。
- 将来バックエンドへ移行する場合は、`App.vue` が呼ぶ保存境界を非同期 API に差し替え、同期や競合解決を移行時に定める。問題 ID と集計処理は再利用できる。

## 将来の拡張方針（予定）

- ライティング判定は Lezer の構文木とトークンを参照解答と比較する。構文エラー、対象ファイルの相違、指定以外の変更は不合格とする。実行に基づく評価を将来追加する場合は、隔離した実行環境と自動テストを別途用意し、提出ファイル配列を受け取る判定処理を差し替える。複数ファイル対応時はエディタのファイル切り替えと判定対象を拡張する。
- Phase 5 では、複数ファイルの切り替えと、ファイルをまたぐ処理の読解問題を扱う。
