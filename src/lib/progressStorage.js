export const PROGRESS_STORAGE_KEY = 'code-reading-lab:learning-progress'
const VERSION = 1

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function decode(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function hasUnsupportedVersion(data) {
  return isRecord(data) && Object.hasOwn(data, 'version') && data.version !== VERSION
}

function isIsoTimestamp(value) {
  if (typeof value !== 'string') return false
  const time = Date.parse(value)
  return Number.isFinite(time) && new Date(time).toISOString() === value
}

function restoreHistory(history, problemIds) {
  if (!isRecord(history)) return {}

  const entries = []
  for (const id of problemIds) {
    if (!Object.hasOwn(history, id) || !isRecord(history[id])) continue
    const { attemptCount, correctCount, lastAnsweredAt, lastAnswerCorrect, everCorrect } = history[id]
    if (!Number.isSafeInteger(attemptCount) || attemptCount < 1
      || !Number.isSafeInteger(correctCount) || correctCount < 0 || correctCount > attemptCount
      || !isIsoTimestamp(lastAnsweredAt)
      || typeof lastAnswerCorrect !== 'boolean' || typeof everCorrect !== 'boolean'
      || everCorrect !== (correctCount > 0)
      || (lastAnswerCorrect ? correctCount === 0 : correctCount === attemptCount)) continue

    entries.push([id, { attemptCount, correctCount, lastAnsweredAt, lastAnswerCorrect, everCorrect }])
  }
  return Object.fromEntries(entries)
}

export function createProgressStorage(problemIds, getStorage = () => globalThis.localStorage) {
  return {
    load() {
      try {
        const data = decode(getStorage().getItem(PROGRESS_STORAGE_KEY))
        if (hasUnsupportedVersion(data)) return { history: {}, issue: 'version' }
        const history = data?.version === VERSION ? restoreHistory(data.history, problemIds) : {}
        return { history, issue: null }
      } catch {
        return { history: {}, issue: 'access' }
      }
    },

    save(history) {
      try {
        const storage = getStorage()
        if (hasUnsupportedVersion(decode(storage.getItem(PROGRESS_STORAGE_KEY)))) return 'version'
        storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ version: VERSION, history: restoreHistory(history, problemIds) }))
        return null
      } catch {
        return 'write'
      }
    },

    clear() {
      try {
        getStorage().removeItem(PROGRESS_STORAGE_KEY)
        return null
      } catch {
        return 'clear'
      }
    },
  }
}
