import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createProgressStorage, PROGRESS_STORAGE_KEY } from '../src/lib/progressStorage.js'

const entry = {
  attemptCount: 2,
  correctCount: 1,
  lastAnsweredAt: '2026-11-22T04:00:00.000Z',
  lastAnswerCorrect: false,
  everCorrect: true,
}

function memoryStorage() {
  const entries = new Map()
  return {
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
    removeItem: key => entries.delete(key),
  }
}

test('保存した履歴を復元し、現行 ID と許可された項目だけを扱う', () => {
  const raw = memoryStorage()
  const store = createProgressStorage(['a', 'b'], () => raw)
  assert.equal(store.save({ a: { ...entry, source: 'draft' }, b: entry, unknown: entry }), null)
  assert.deepEqual(JSON.parse(raw.getItem(PROGRESS_STORAGE_KEY)), { version: 1, history: { a: entry, b: entry } })
  assert.deepEqual(createProgressStorage(['a', 'new'], () => raw).load(), { history: { a: entry }, issue: null })
})

test('不正な JSON と想定外のデータを無視し、正常な行は復元する', () => {
  const raw = memoryStorage()
  const store = createProgressStorage(['a', 'b'], () => raw)
  for (const value of ['{', '[]', 'null', '"unexpected"', '{"version":1,"history":[]}']) {
    raw.setItem(PROGRESS_STORAGE_KEY, value)
    assert.deepEqual(store.load(), { history: {}, issue: null })
  }
  for (const invalid of [
    null, { ...entry, attemptCount: 0 }, { ...entry, correctCount: 3 }, { ...entry, lastAnsweredAt: 'bad' },
    { ...entry, lastAnsweredAt: '2026-11-22' }, { ...entry, everCorrect: false }, { ...entry, correctCount: 2, lastAnswerCorrect: false },
  ]) {
    raw.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ version: 1, history: { a: entry, b: invalid } }))
    assert.deepEqual(store.load(), { history: { a: entry }, issue: null })
  }
})

test('未対応バージョンは復元も上書きもせず、明示的に削除できる', () => {
  const raw = memoryStorage()
  const store = createProgressStorage(['a'], () => raw)
  const newer = JSON.stringify({ version: 2, history: { a: entry } })
  raw.setItem(PROGRESS_STORAGE_KEY, newer)
  assert.deepEqual(store.load(), { history: {}, issue: 'version' })
  assert.equal(store.save({ a: entry }), 'version')
  assert.equal(raw.getItem(PROGRESS_STORAGE_KEY), newer)
  assert.equal(store.clear(), null)
  assert.equal(store.save({ a: entry }), null)
})

test('ストレージアクセス・書き込み・削除の失敗を呼び出し側に返す', () => {
  const unavailable = createProgressStorage(['a'], () => { throw new Error('blocked') })
  assert.deepEqual(unavailable.load(), { history: {}, issue: 'access' })
  assert.equal(unavailable.save({ a: entry }), 'write')
  assert.equal(unavailable.clear(), 'clear')

  const raw = memoryStorage()
  const store = createProgressStorage(['a'], () => raw)
  assert.equal(store.save({ a: entry }), null)
  raw.setItem = () => { throw new Error('quota') }
  raw.removeItem = () => { throw new Error('blocked') }
  assert.equal(store.save({}), 'write')
  assert.equal(store.clear(), 'clear')
  assert.deepEqual(store.load(), { history: { a: entry }, issue: null })
})

test('履歴を初期化しても同じオリジンの他データは残る', () => {
  const raw = memoryStorage()
  const store = createProgressStorage(['a'], () => raw)
  raw.setItem('other', 'keep')
  assert.equal(store.save({ a: entry }), null)
  assert.equal(store.clear(), null)
  assert.deepEqual(store.load(), { history: {}, issue: null })
  assert.equal(raw.getItem('other'), 'keep')
})
