export function recordAttempt(history, problemIds, problemId, isCorrect, answeredAt) {
  if (!problemIds.includes(problemId)) return history

  const previous = Object.hasOwn(history, problemId) ? history[problemId] : null
  const correctCount = (previous?.correctCount ?? 0) + Number(isCorrect)
  return {
    ...history,
    [problemId]: {
      attemptCount: (previous?.attemptCount ?? 0) + 1,
      correctCount,
      lastAnsweredAt: answeredAt,
      lastAnswerCorrect: isCorrect,
      everCorrect: correctCount > 0,
    },
  }
}

export function getProblemStatus(history, problemId) {
  if (!Object.hasOwn(history, problemId)) return 'unattempted'
  return history[problemId].everCorrect ? 'solved' : 'attempted'
}

export function summarizeProgress(history, problemIds) {
  let attempted = 0
  let solved = 0
  let attempts = 0
  let correct = 0

  for (const id of problemIds) {
    if (!Object.hasOwn(history, id)) continue
    const entry = history[id]
    attempted += 1
    solved += Number(entry.everCorrect)
    attempts += entry.attemptCount
    correct += entry.correctCount
  }

  const total = problemIds.length
  return {
    total,
    attempted,
    solved,
    accuracy: attempts === 0 ? null : correct / attempts,
    completion: total === 0 ? 0 : solved / total,
  }
}
