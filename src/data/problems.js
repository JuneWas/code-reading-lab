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
  {
    id: 'java-policy-cancellation',
    language: 'java',
    category: '業務ルール',
    difficulty: 'intermediate',
    type: 'writing',
    title: '保険契約の解約可否を修正する',
    files: [
      {
        path: 'CancellationPolicy.java',
        content: `import java.util.List;

class CancellationPolicy {
    static boolean canCancel(
            boolean active, int daysSinceStart, List<String> claimStatuses) {
        if (!active || daysSinceStart < 30) {
            return false;
        }

        for (String status : claimStatuses) {
            if (isOpenClaim(status)) {
                return false;
            }
        }

        return true;
    }

    private static boolean isOpenClaim(String status) {
        return "PENDING".equals(status) && "UNDER_REVIEW".equals(status);
    }
}`,
      },
    ],
    prompt: '有効な契約で開始から30日以上経過していても、審査待ち（PENDING）または審査中（UNDER_REVIEW）の請求が1件でもあれば解約できません。未処理の請求がなければ解約できます。isOpenClaim の論理演算子1か所だけを修正してください。',
    referenceEdit: { before: '"PENDING".equals(status) &&', after: '"PENDING".equals(status) ||' },
    explanation: '請求ステータスが PENDING と UNDER_REVIEW の両方になることはありません。論理和（||）でどちらか一方を検出すれば、ループが未処理の請求を見つけた時点で解約を止められます。',
  },
  {
    id: 'javascript-active-customer-search',
    language: 'javascript',
    category: '顧客検索',
    difficulty: 'intermediate',
    type: 'writing',
    title: '有効な顧客だけを検索対象にする',
    files: [
      {
        path: 'customerSearch.js',
        content: `function searchCustomers(customers, query) {
  const keyword = query.trim().toLowerCase();
  const matches = [];

  if (keyword === '') {
    return matches;
  }

  for (const customer of customers) {
    if (customer.active === true) {
      continue;
    }

    const name = customer.name.toLowerCase();
    const email = customer.email.toLowerCase();
    if (name.includes(keyword) || email.includes(keyword)) {
      matches.push(customer);
    }
  }

  return matches;
}`,
      },
    ],
    prompt: 'active が true の顧客だけを対象とし、名前かメールアドレスに検索語が含まれる顧客を入力順で返します。大小文字は区別せず、空の検索語では結果を返しません。ループの最初の if にある比較演算子1か所だけを修正してください。',
    referenceEdit: { before: 'customer.active === true', after: 'customer.active !== true' },
    explanation: 'continue は現在の顧客を飛ばします。厳密不等価（!==）を使い、active が true 以外の場合にだけ飛ばせば、有効な顧客を名前とメールアドレスで検索できます。',
  },
]
