<script setup>
defineProps({ problem: { type: Object, required: true } })

const languageNames = { java: 'Java', javascript: 'JavaScript' }
const difficultyNames = { beginner: '初級', intermediate: '中級', advanced: '上級' }
</script>

<template>
  <ul class="metadata" aria-label="問題の情報">
    <li class="language-badge" :class="problem.language">{{ languageNames[problem.language] }}</li>
    <li>{{ difficultyNames[problem.difficulty] }}</li>
    <li>{{ problem.category }}</li>
    <li>{{ problem.type === 'writing' ? 'コード修正' : 'コード読解' }}</li>
  </ul>
</template>
