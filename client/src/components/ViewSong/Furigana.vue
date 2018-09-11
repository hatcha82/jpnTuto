<template>
  <panel title="Furigana">
    <p class="furigana" v-html="song.tab">
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

<style>
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
rt {
  font-size: 12px;  
}
</style>
