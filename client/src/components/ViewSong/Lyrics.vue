<template>
  <panel title="Lyrics">
    <p
      readonly
      v-html="song.lyrics"
    ></p>
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
