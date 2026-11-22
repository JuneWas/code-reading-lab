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
