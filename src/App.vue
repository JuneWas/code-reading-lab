<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ProblemList from './components/ProblemList.vue'
import ReadingExercise from './components/ReadingExercise.vue'
import { problems } from './data/problems.js'

const readingProblems = problems.filter(({ type }) => type === 'reading')
const route = ref(window.location.hash)
const language = ref('all')
const main = ref(null)
const activeProblem = computed(() => readingProblems.find(
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
    <ReadingExercise v-if="activeProblem" :key="activeProblem.id" :problem="activeProblem" />
    <ProblemList v-else-if="isList" v-model="language" :problems="readingProblems" />
    <section v-else class="intro">
      <h1 tabindex="-1">問題が見つかりません</h1>
      <a class="back-link" href="#/">問題一覧へ戻る</a>
    </section>
  </main>
</template>
