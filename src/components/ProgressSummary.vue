<script setup>
defineProps({ summary: { type: Object, required: true } })
defineEmits(['reset'])

const percent = new Intl.NumberFormat('ja', { style: 'percent', maximumFractionDigits: 1 })
</script>

<template>
  <section class="progress-panel" aria-labelledby="progress-heading">
    <div class="progress-heading">
      <h2 id="progress-heading">学習進捗</h2>
      <button class="progress-reset" type="button" @click="$emit('reset')">学習履歴を削除</button>
    </div>
    <dl class="progress-stats">
      <div><dt>全問題</dt><dd>{{ summary.total }} 問</dd></div>
      <div><dt>挑戦済み</dt><dd>{{ summary.attempted }} 問</dd></div>
      <div><dt>正解済み</dt><dd>{{ summary.solved }} 問</dd></div>
      <div>
        <dt>正答率</dt>
        <dd>{{ summary.accuracy === null ? '回答なし' : percent.format(summary.accuracy) }}</dd>
      </div>
    </dl>
    <label class="progress-label" for="learning-completion">
      <span>進捗率（正解済み / 全問題）</span>
      <strong>{{ percent.format(summary.completion) }}</strong>
    </label>
    <progress id="learning-completion" :value="summary.completion" max="1"></progress>
  </section>
</template>

<style scoped>
.progress-panel {
  margin-top: 1.5rem;
  padding: 1rem clamp(1rem, 3vw, 1.5rem);
  border: 1px solid var(--border);
  border-radius: .85rem;
  background: var(--surface);
}

.progress-heading, .progress-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: .35rem .75rem;
}

.progress-heading h2 { font-size: 1.15rem; }

.progress-reset {
  min-height: 2.75rem;
  padding: .3rem 0;
  border: 0;
  background: transparent;
  color: var(--accent);
  font-size: .85rem;
  text-decoration: underline;
  text-underline-offset: .2em;
  cursor: pointer;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .65rem;
  margin: .35rem 0 .85rem;
}

.progress-stats dt, .progress-label { color: var(--muted); font-size: .85rem; }
.progress-stats dd { margin: 0; font-size: 1.1rem; font-weight: 750; }
.progress-label strong { color: var(--ink); }

progress {
  display: block;
  width: 100%;
  height: .7rem;
  margin-top: .3rem;
  accent-color: var(--accent);
}

@media (max-width: 30rem) {
  .progress-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
