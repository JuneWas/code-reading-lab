<script setup>
import { computed } from 'vue'
import ProblemMetadata from './ProblemMetadata.vue'

const props = defineProps({ problems: { type: Array, required: true } })
const language = defineModel({ type: String, required: true })
const problemType = defineModel('problemType', { type: String, required: true })
const languages = [
  { value: 'all', label: 'すべて' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
]
const types = [
  { value: 'all', label: 'すべて' },
  { value: 'reading', label: 'コード読解' },
  { value: 'writing', label: 'コード修正' },
]
const visibleProblems = computed(() => props.problems.filter(
  problem => (language.value === 'all' || problem.language === language.value)
    && (problemType.value === 'all' || problem.type === problemType.value),
))
</script>

<template>
  <section class="intro">
    <p class="eyebrow">Java・JavaScript 演習</p>
    <h1 tabindex="-1">コードを読み、<br class="mobile-break" />バグを直す。</h1>
    <p>コードの実行結果を予測したり、業務ロジックのバグを直したりしてみましょう。</p>
  </section>

  <section class="problem-section" aria-labelledby="problem-list-heading">
    <div class="list-heading">
      <h2 id="problem-list-heading">問題一覧</h2>
      <span class="count" aria-live="polite">{{ visibleProblems.length }} 問</span>
    </div>
    <div class="filter-groups">
      <fieldset class="filters">
        <legend>言語</legend>
        <label v-for="option in languages" :key="option.value">
          <input v-model="language" type="radio" name="language" :value="option.value" />
          <span>{{ option.label }}</span>
        </label>
      </fieldset>
      <fieldset class="filters">
        <legend>問題タイプ</legend>
        <label v-for="option in types" :key="option.value">
          <input v-model="problemType" type="radio" name="problem-type" :value="option.value" />
          <span>{{ option.label }}</span>
        </label>
      </fieldset>
    </div>

    <ul v-if="visibleProblems.length" class="problem-grid">
      <li v-for="problem in visibleProblems" :key="problem.id">
        <a class="problem-card" :href="'#/problems/' + encodeURIComponent(problem.id)">
          <ProblemMetadata :problem="problem" />
          <h3>{{ problem.title }}</h3>
          <span class="card-action">問題を解く <span aria-hidden="true">→</span></span>
        </a>
      </li>
    </ul>
    <p v-else>条件に一致する問題はありません。</p>
  </section>
</template>
