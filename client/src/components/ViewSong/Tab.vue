<template>
  <panel title="Furigana">
    <p v-html="song.tab">
    </p>
  </panel>
</template>

<script>
export default {
  props: [
    'song'
  ]
}
</script>

<style scoped>
p {
  width: 100%;
  font-family: monospace;
  text-align: left;
  text-justify: auto;
  white-space:pre-line;
  padding: 40px;
}
</style>
