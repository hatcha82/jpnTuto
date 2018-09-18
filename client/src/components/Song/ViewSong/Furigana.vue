<template>
  <div>
    
    <p class="furigana" v-html="song.tab">
    </p>
  </div>
</template>

<script>
import YouTube from './YouTube'
export default {
  props: [
    'song'
  ],
  components: {
    YouTube
  }
}
</script>

<style scope>
p {
  width: 100%;  
  text-align: left;
  text-justify: auto;
  white-space:pre-line;
  padding: 40px;
  line-height:2em;
  font-size: 2em;
  font-family: sans-serif;
}
rt {
  font-size: 0.5em;  
  color:#4caf50
}
</style>
