<script setup>
import { computed } from 'vue'
import ProblemMetadata from './ProblemMetadata.vue'

const props = defineProps({ problems: { type: Array, required: true } })
const language = defineModel({ type: String, required: true })
const languages = [
  { value: 'all', label: 'すべて' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
]
const visibleProblems = computed(() => props.problems.filter(
  problem => language.value === 'all' || problem.language === language.value,
))
</script>

<template>
  <section class="intro">
    <p class="eyebrow">コードリーディング演習</p>
    <h1 tabindex="-1">コードを読み、<br class="mobile-break" />動きを予測する。</h1>
    <p>Java と JavaScript の短いコードを読み、実行結果を考えてみましょう。</p>
  </section>

  <section class="problem-section" aria-labelledby="problem-list-heading">
    <div class="list-heading">
      <h2 id="problem-list-heading">問題一覧</h2>
      <span class="count" aria-live="polite">{{ visibleProblems.length }} 問</span>
    </div>
    <fieldset class="filters">
      <legend class="sr-only">言語で絞り込む</legend>
      <label v-for="option in languages" :key="option.value">
        <input v-model="language" type="radio" name="language" :value="option.value" />
        <span>{{ option.label }}</span>
      </label>
    </fieldset>

    <ul v-if="visibleProblems.length" class="problem-grid">
      <li v-for="problem in visibleProblems" :key="problem.id">
        <a class="problem-card" :href="'#/problems/' + encodeURIComponent(problem.id)">
          <ProblemMetadata :problem="problem" />
          <h3>{{ problem.title }}</h3>
          <span class="card-action">問題を解く <span aria-hidden="true">→</span></span>
        </a>
      </li>
    </ul>
    <p v-else>この言語の問題はまだありません。</p>
  </section>
</template>
