<template>
  <panel :title="song.title">
    <p readonly v-html="song.lyrics"
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
  text-align: left;
  text-justify: auto;
  white-space:pre-line;
  padding: 40px;
  line-height: 30px;
  font-size: 20px;
  font-family: sans-serif;
}
</style>
