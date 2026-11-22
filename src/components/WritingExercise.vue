<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { gradeWritingAnswer } from '../lib/gradeWritingAnswer.js'
import ProblemMetadata from './ProblemMetadata.vue'

const CodeEditor = defineAsyncComponent(() => import('./CodeEditor.vue'))

const props = defineProps({ problem: { type: Object, required: true } })
const starter = props.problem.files[0]
const source = ref(starter.content)
const result = ref(null)
const resetCount = ref(0)

function updateSource(content) {
  source.value = content
  result.value = null
}

function resetSource() {
  updateSource(starter.content)
  resetCount.value += 1
}

function submitAnswer() {
  result.value = gradeWritingAnswer(props.problem, [{ path: starter.path, content: source.value }])
}
</script>

<template>
  <div class="exercise">
    <a class="back-link" href="#/"><span aria-hidden="true">←</span> 問題一覧へ戻る</a>
    <div class="exercise-heading">
      <ProblemMetadata :problem="problem" />
      <h1 tabindex="-1">{{ problem.title }}</h1>
    </div>

    <div class="exercise-grid writing-grid">
      <section class="answer-panel writing-instructions" aria-labelledby="writing-prompt-heading">
        <h2 id="writing-prompt-heading">修正する内容</h2>
        <p>{{ problem.prompt }}</p>
      </section>

      <section class="writing-editor" aria-labelledby="editor-heading">
        <div class="editor-heading">
          <h2 id="editor-heading">ソースコード</h2>
          <button class="reset-button" type="button" @click="resetSource">初期コードに戻す</button>
        </div>
        <CodeEditor :key="resetCount" :file="starter" :language="problem.language" @edit="updateSource" />
      </section>

      <section class="answer-panel writing-grading" aria-label="回答判定">
        <p class="grading-note">
          この演習はコードを実行せず、指定された修正を構文で照合します。
          空白や改行の違いを許容する場合があります。別の書き方が正しく動くかどうかは判定できません。
        </p>
        <button class="submit-button" type="button" @click="submitAnswer">回答を判定する</button>
        <div aria-live="polite" aria-atomic="true">
          <div v-if="result" class="result" :class="{ incorrect: !result.isCorrect }">
            <h3>{{ result.isCorrect ? '正解です' : '修正が必要です' }}</h3>
            <h4>解説</h4>
            <p>{{ problem.explanation }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.writing-grid {
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  grid-template-areas: "editor instructions" "editor grading";
  grid-template-rows: auto 1fr;
}

.writing-instructions { grid-area: instructions; }
.writing-grading { grid-area: grading; }
.writing-editor { grid-area: editor; min-width: 0; }

.editor-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  margin-bottom: .65rem;
}

.editor-heading h2 { margin: 0; }

.reset-button {
  min-height: 2.75rem;
  padding: .35rem .7rem;
  border: 1px solid var(--border);
  border-radius: .5rem;
  background: var(--surface);
  color: var(--accent);
  font-size: .875rem;
  font-weight: 700;
  cursor: pointer;
}

.reset-button:hover { border-color: var(--accent); }

.grading-note {
  margin-block: 0 .55rem;
  color: var(--muted);
  font-size: .875rem;
}

@media (max-width: 44rem) {
  .writing-grid {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "instructions" "editor" "grading";
    grid-template-rows: auto;
  }
}
</style>
