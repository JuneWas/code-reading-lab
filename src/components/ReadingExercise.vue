<script setup>
import { ref } from 'vue'
import { gradeReadingAnswer } from '../lib/gradeReadingAnswer.js'
import CodeBlock from './CodeBlock.vue'
import ProblemMetadata from './ProblemMetadata.vue'

const props = defineProps({ problem: { type: Object, required: true } })
const selectedChoiceId = ref('')
const result = ref(null)

function submitAnswer() {
  if (result.value) return
  result.value = gradeReadingAnswer(props.problem, selectedChoiceId.value)
}
</script>

<template>
  <div class="exercise">
    <a class="back-link" href="#/"><span aria-hidden="true">←</span> 問題一覧へ戻る</a>
    <div class="exercise-heading">
      <ProblemMetadata :problem="problem" />
      <h1 tabindex="-1">{{ problem.title }}</h1>
    </div>

    <div class="exercise-grid">
      <section aria-labelledby="code-heading">
        <h2 id="code-heading">ソースコード</h2>
        <CodeBlock :file="problem.files[0]" :language="problem.language" />
      </section>
      <section class="answer-panel" aria-labelledby="answer-heading">
        <h2 id="answer-heading">問題</h2>
        <form @submit.prevent="submitAnswer">
          <fieldset class="choices" :disabled="Boolean(result)">
            <legend>{{ problem.prompt }}</legend>
            <label v-for="choice in problem.choices" :key="choice.id">
              <input v-model="selectedChoiceId" type="radio" name="answer" :value="choice.id" />
              <span>{{ choice.label }}</span>
            </label>
          </fieldset>
          <button v-if="!result" class="submit-button" type="submit" :disabled="!selectedChoiceId">
            回答する
          </button>
        </form>
        <div aria-live="polite" aria-atomic="true">
          <div v-if="result" class="result" :class="{ incorrect: !result.isCorrect }">
            <h3>{{ result.isCorrect ? '正解です' : '不正解です' }}</h3>
            <p><strong>正解：</strong><code>{{ result.correctChoice.label }}</code></p>
            <h4>解説</h4>
            <p>{{ problem.explanation }}</p>
          </div>
        </div>
        <a v-if="result" class="back-link next-link" href="#/">別の問題を解く <span aria-hidden="true">→</span></a>
      </section>
    </div>
  </div>
</template>
