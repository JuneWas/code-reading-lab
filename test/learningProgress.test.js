import assert from 'node:assert/strict'
import { test } from 'node:test'
import { problems } from '../src/data/problems.js'
import { gradeReadingAnswer } from '../src/lib/gradeReadingAnswer.js'
import { gradeWritingAnswer } from '../src/lib/gradeWritingAnswer.js'
import { getProblemStatus, recordAttempt, summarizeProgress } from '../src/lib/learningProgress.js'

const first = '2026-11-22T04:00:00.000Z'
const second = '2026-11-22T04:01:00.000Z'
const third = '2026-11-22T04:02:00.000Z'
const ids = ['a', 'b', 'c']

test('初回回答で当該問題の履歴だけを作成する', () => {
  const empty = {}
  const history = recordAttempt(empty, ids, 'a', false, first)
  assert.deepEqual(empty, {})
  assert.deepEqual(history, {
    a: { attemptCount: 1, correctCount: 0, lastAnsweredAt: first, lastAnswerCorrect: false, everCorrect: false },
  })
  assert.equal(getProblemStatus(history, 'a'), 'attempted')
  assert.equal(getProblemStatus(history, 'b'), 'unattempted')
  assert.equal(recordAttempt(history, ids, 'removed', true, first), history)
})

test('再回答で回数と最終情報を更新し、一度正解した状態を維持する', () => {
  let history = recordAttempt({}, ids, 'a', false, first)
  history = recordAttempt(history, ids, 'a', true, second)
  assert.deepEqual(history.a, {
    attemptCount: 2, correctCount: 1, lastAnsweredAt: second, lastAnswerCorrect: true, everCorrect: true,
  })
  history = recordAttempt(history, ids, 'a', false, third)
  assert.deepEqual(history.a, {
    attemptCount: 3, correctCount: 1, lastAnsweredAt: third, lastAnswerCorrect: false, everCorrect: true,
  })
  assert.equal(getProblemStatus(history, 'a'), 'solved')
})

test('現在の問題 ID だけを対象に、全回答の正答率と問題の進捗率を別に計算する', () => {
  let history = recordAttempt({}, ids, 'a', true, first)
  history = recordAttempt(history, ids, 'a', false, second)
  history = recordAttempt(history, ids, 'b', false, first)
  history = recordAttempt(history, ids, 'c', true, first)
  assert.deepEqual(summarizeProgress(history, ['a', 'b', 'new', 'another']), {
    total: 4, attempted: 2, solved: 1, accuracy: 1 / 3, completion: 1 / 4,
  })
  assert.deepEqual(summarizeProgress({}, ids), { total: 3, attempted: 0, solved: 0, accuracy: null, completion: 0 })
  assert.deepEqual(summarizeProgress(history, []), { total: 0, attempted: 0, solved: 0, accuracy: null, completion: 0 })
})

for (const problem of problems) {
  test(problem.id + '：既存の正誤判定を進捗に記録する', () => {
    let incorrect
    let correct
    if (problem.type === 'reading') {
      const wrongChoice = problem.choices.find(choice => choice.id !== problem.correctChoiceId)
      incorrect = gradeReadingAnswer(problem, wrongChoice.id)
      correct = gradeReadingAnswer(problem, problem.correctChoiceId)
    } else {
      const { before, after } = problem.referenceEdit
      incorrect = gradeWritingAnswer(problem, problem.files)
      const [file] = problem.files
      correct = gradeWritingAnswer(problem, [{ ...file, content: file.content.replace(before, () => after) }])
    }
    assert.equal(incorrect.isCorrect, false)
    assert.equal(correct.isCorrect, true)
    let history = recordAttempt({}, [problem.id], problem.id, incorrect.isCorrect, first)
    history = recordAttempt(history, [problem.id], problem.id, correct.isCorrect, second)
    assert.equal(history[problem.id].attemptCount, 2)
    assert.equal(history[problem.id].correctCount, 1)
    assert.equal(getProblemStatus(history, problem.id), 'solved')
  })
}
