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
  line-height: 30px;
  font-size: 20px;
  font-family: sans-serif;
}
rt {
  font-size: 12px;  
  color:#c72929
}
</style>
