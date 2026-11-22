import { parser as javaParser } from '@lezer/java'
import { parser as javascriptParser } from '@lezer/javascript'

const parsers = { java: javaParser, javascript: javascriptParser }

function syntaxSignature(source, parser) {
  const signature = []
  let end = 0
  let hasError = false

  // Use the parser's structure and preserve leaf text (including literals and
  // comments). Punctuation omitted by the parser still contributes via gaps.
  parser.parse(source).iterate({
    enter(node) {
      hasError ||= node.type.isError
      signature.push(node.type.id)
      if (node.node.firstChild) return

      signature.push(source.slice(end, node.from).replace(/\s/g, ''), source.slice(node.from, node.to))
      end = node.to
    },
    leave() {
      signature.push(null)
    },
  })

  signature.push(source.slice(end).replace(/\s/g, ''))
  return hasError ? null : JSON.stringify(signature)
}

export function gradeWritingAnswer(problem, submittedFiles) {
  const [starter] = problem.files
  const [submission] = submittedFiles
  if (problem.files.length !== 1 || submittedFiles.length !== 1 || submission.path !== starter.path) {
    return { isCorrect: false }
  }

  const { before, after } = problem.referenceEdit
  const start = starter.content.indexOf(before)
  if (start < 0 || before === after || start !== starter.content.lastIndexOf(before)) {
    return { isCorrect: false }
  }

  const expected = starter.content.replace(before, () => after)
  const parser = parsers[problem.language]
  const actualSignature = syntaxSignature(submission.content, parser)

  return { isCorrect: actualSignature !== null && actualSignature === syntaxSignature(expected, parser) }
}
