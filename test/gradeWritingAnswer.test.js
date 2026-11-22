import assert from 'node:assert/strict'
import { test } from 'node:test'
import { problems } from '../src/data/problems.js'
import { gradeWritingAnswer } from '../src/lib/gradeWritingAnswer.js'

for (const problem of problems.filter(({ type }) => type === 'writing')) {
  const [starter] = problem.files
  const { before, after } = problem.referenceEdit
  const expected = starter.content.replace(before, after)
  const grade = content => gradeWritingAnswer(problem, [{ ...starter, content }]).isCorrect

  test(problem.id + '：指定された修正と整形差分を受理する', () => {
    assert.notEqual(expected, starter.content)
    assert.equal(grade(expected), true)
    const operator = problem.language === 'java' ? '||' : '!=='
    const reformatted = starter.content
      .replace(before, () => after.replace(operator, '\n\t' + operator + '  '))
      .replaceAll('\n', '\r\n')
    assert.equal(grade('\r\n' + reformatted + '\r\n'), true)
  })

  test(problem.id + '：初期コード、仕様外の変更、構文エラーを拒否する', () => {
    assert.equal(grade(starter.content), false)
    const wrong = problem.language === 'java'
      ? expected.replace('daysSinceStart < 30', 'daysSinceStart < 29')
      : expected.replace('matches.push(customer);', 'matches.pop();')
    assert.equal(grade(wrong), false)
    assert.equal(grade(expected.slice(0, -1)), false)
    assert.equal(grade(expected.replace('return ', 'return\n')), problem.language === 'java')
    assert.equal(gradeWritingAnswer(problem, []).isCorrect, false)
    assert.equal(gradeWritingAnswer(problem, [{ path: 'wrong.txt', content: expected }]).isCorrect, false)
  })
}

test('Java の文字列リテラル内の空白は維持する', () => {
  const problem = problems.find(({ id }) => id === 'java-policy-cancellation')
  const [starter] = problem.files
  const { before, after } = problem.referenceEdit
  const content = starter.content.replace(before, after).replace('"UNDER_REVIEW"', '"UNDER_REVIEW "')
  assert.equal(gradeWritingAnswer(problem, [{ ...starter, content }]).isCorrect, false)
})
