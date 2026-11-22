export function gradeReadingAnswer(problem, selectedChoiceId) {
  if (!problem.choices.some(({ id }) => id === selectedChoiceId)) return null

  return {
    isCorrect: selectedChoiceId === problem.correctChoiceId,
    correctChoice: problem.choices.find(({ id }) => id === problem.correctChoiceId),
  }
}
