<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'

const props = defineProps({
  file: { type: Object, required: true },
  language: { type: String, required: true },
})
const emit = defineEmits(['edit'])
const host = ref(null)
let editor

onMounted(() => {
  editor = new EditorView({
    parent: host.value,
    doc: props.file.content,
    extensions: [
      props.language === 'java' ? java() : javascript(),
      oneDark,
      lineNumbers(),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorState.tabSize.of(4),
      EditorView.contentAttributes.of({
        'aria-label': props.file.path + ' のコードを編集',
        spellcheck: 'false',
        autocapitalize: 'off',
        autocorrect: 'off',
      }),
      EditorView.updateListener.of(update => {
        if (update.docChanged) emit('edit', update.state.doc.toString())
      }),
    ],
  })
})

onUnmounted(() => editor?.destroy())
</script>

<template>
  <figure class="code-panel editor-panel">
    <figcaption>{{ file.path }}</figcaption>
    <div ref="host"></div>
  </figure>
</template>

<style scoped>
.editor-panel :deep(.cm-editor) {
  min-height: 24rem;
  max-height: 34rem;
}

.editor-panel :deep(.cm-scroller) {
  font: .875rem/1.65 var(--mono);
}

.editor-panel :deep(.cm-focused) {
  outline: 2px solid #8ee5b4;
  outline-offset: -3px;
}
</style>
