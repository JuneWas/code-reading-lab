<script setup>
import { computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)

const props = defineProps({
  file: { type: Object, required: true },
  language: { type: String, required: true },
})

// Highlight.js escapes the source before producing markup for syntax tokens.
const highlightedCode = computed(() => hljs.highlight(props.file.content, {
  language: props.language,
}).value)
</script>

<template>
  <figure class="code-panel">
    <figcaption>{{ file.path }}</figcaption>
    <pre tabindex="0" :aria-label="file.path + ' のソースコード'"><code class="hljs" v-html="highlightedCode"></code></pre>
  </figure>
</template>
