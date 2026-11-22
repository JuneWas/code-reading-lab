<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ProblemList from './components/ProblemList.vue'
import ProgressSummary from './components/ProgressSummary.vue'
import ReadingExercise from './components/ReadingExercise.vue'
import WritingExercise from './components/WritingExercise.vue'
import { problems } from './data/problems.js'
import { recordAttempt, summarizeProgress } from './lib/learningProgress.js'
import { createProgressStorage } from './lib/progressStorage.js'

const problemIds = problems.map(({ id }) => id)
const storage = createProgressStorage(problemIds)
const stored = storage.load()
const history = ref(stored.history)
const storageIssue = ref(stored.issue)
const resetNotice = ref('')
const summary = computed(() => summarizeProgress(history.value, problemIds))
const storageMessages = {
  access: '学習履歴を読み込めませんでした。演習は続けられますが、履歴が保存されない場合があります。',
  write: '学習履歴を保存できませんでした。今回の更新は再読み込み後に失われる場合があります。',
  clear: 'この画面の学習履歴は消去しましたが、ブラウザに保存された履歴は削除できませんでした。再読み込みで表示される場合があります。',
  version: '保存済みの学習履歴の形式に対応していません。保存済みデータは保持され、今回の回答はこの画面にのみ反映されます。',
}

function handleAttempt(problemId, isCorrect) {
  // Start from the latest persisted snapshot when there are no unsaved changes.
  const latest = storageIssue.value ? null : storage.load()
  const base = latest && !latest.issue ? latest.history : history.value
  history.value = recordAttempt(base, problemIds, problemId, isCorrect, new Date().toISOString())
  storageIssue.value = storage.save(history.value)
  resetNotice.value = ''
}

function resetProgress() {
  if (!window.confirm('このブラウザの学習履歴をすべて削除しますか？')) return
  storageIssue.value = storage.clear()
  history.value = {}
  resetNotice.value = storageIssue.value ? '' : '学習履歴を削除しました。'
}

const route = ref(window.location.hash)
const language = ref('all')
const problemType = ref('all')
const main = ref(null)
const activeProblem = computed(() => problems.find(
  ({ id }) => route.value === '#/problems/' + encodeURIComponent(id),
))
const isList = computed(() => ['', '#/'].includes(route.value))

async function updateRoute() {
  route.value = window.location.hash
  await nextTick()
  main.value?.querySelector('h1')?.focus({ preventScroll: true })
  window.scrollTo(0, 0)
}

onMounted(() => window.addEventListener('hashchange', updateRoute))
onUnmounted(() => window.removeEventListener('hashchange', updateRoute))
</script>

<template>
  <header class="site-header">
    <div class="shell header-content">
      <a class="brand" href="#/">
        <span class="brand-icon" aria-hidden="true">[ ]</span>
        Code Reading Lab
      </a>
    </div>
  </header>

  <main ref="main" class="shell main-content">
    <p v-if="storageIssue" class="storage-warning" role="status">{{ storageMessages[storageIssue] }}</p>
    <p v-if="resetNotice" class="storage-notice" role="status">{{ resetNotice }}</p>
    <WritingExercise v-if="activeProblem?.type === 'writing'" :key="activeProblem.id" :problem="activeProblem" @attempt="handleAttempt" />
    <ReadingExercise v-else-if="activeProblem" :key="activeProblem.id" :problem="activeProblem" @attempt="handleAttempt" />
    <ProblemList v-else-if="isList" v-model="language" v-model:problem-type="problemType" :problems="problems" :history="history">
      <ProgressSummary :summary="summary" @reset="resetProgress" />
    </ProblemList>
    <section v-else class="intro">
      <h1 tabindex="-1">問題が見つかりません</h1>
      <a class="back-link" href="#/">問題一覧へ戻る</a>
    </section>
  </main>
</template>
