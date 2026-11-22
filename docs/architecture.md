# アーキテクチャ

## 現在の構成

ブラウザで動く静的フロントエンドに、問題一覧とコードリーディング演習を実装済み。Vite が `index.html` を起点に `src/main.js` を読み込み、Vue が `src/App.vue` をマウントする。開発時は Vite の開発サーバーを使い、配布用ビルドは `dist/` に出力する。

## 技術選定

| 技術 | 採用理由 |
| --- | --- |
| Vue 3 | 画面をコンポーネントに分け、問題一覧や問題画面を段階的に追加できる。 |
| JavaScript | 学習対象の言語を使い、初期構築の設定を少なくできる。 |
| Vite | 開発サーバーと静的ビルドを共通の設定で利用できる。 |
| CSS | 画面のレスポンシブレイアウトと配色を標準機能で実装できる。 |
| Highlight.js | Java と JavaScript のソースを表示用に色分けできる。 |
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
| `src/App.vue` | 静的データから読解問題を取得し、URL ハッシュで一覧と詳細を切り替える。一覧の言語フィルターも保持する。 |
| `src/components/ProblemList.vue` | 言語フィルターと問題一覧を表示する。 |
| `src/components/ReadingExercise.vue` | 問題文・選択肢・結果を表示し、選択と送信の状態を持つ。問題 ID をキーとして詳細を再生成する。 |
| `src/components/ProblemMetadata.vue` | 言語・難易度・カテゴリー・問題タイプを表示する。 |
| `src/components/CodeBlock.vue` | 受け取った 1 ファイルを表示し、Highlight.js で色分けする。 |
| `src/lib/gradeReadingAnswer.js` | 選択肢 ID から正誤と正解を返す。DOM や Vue に依存しない。 |

一覧の URL は `#/`、詳細は `#/problems/<id>` とする。ブラウザの履歴操作と詳細への直接アクセスに対応する。選択と回答結果は詳細画面を開いている間だけ保持する。Highlight.js には Java と JavaScript の文法を登録し、ソースをエスケープしたハイライト結果を描画する。学習用コードの実行処理は持たない。

## 問題データの構造と管理方式

- `src/data/problems.js` に JavaScript の問題オブジェクトの配列を実装し、`problems` として名前付きでエクスポートしている。`App.vue` で読み込み、一覧と詳細にデータを渡す。問題の追加・修正は GitHub の Pull Request でレビューする。データベースや API は導入しない。
- 項目の型と必須条件は [データ要件](requirements.md#学習問題のデータ要件) に従う。一覧は `id`、`language`、`category`、`difficulty`、`type`、`title` を使い、詳細表示は `prompt` と `files` を使う。問題 ID は一覧のキーとして使い、将来の進捗保存でも同じ ID を参照する。
- `type` が `reading` の場合は、選択された ID と `correctChoiceId` を比較して正誤を判定する。`choices` の並び順は表示に使い、ID は翻訳や並べ替えで変わらない値にする。
- `type` が `writing` の場合は、`files` の修正前コード、`prompt` の達成条件、`explanation` を共通項目として使う。判定方式と専用項目は Phase 3 で決める。読解問題のデータ形式はそのまま使える。
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

## 将来の拡張方針（予定）

- ライティング画面に必要な依存ライブラリは、その機能の実装時に選定する。
- 学習進捗はブラウザ内に保存する。保存形式は進捗機能の実装時に決定する。
