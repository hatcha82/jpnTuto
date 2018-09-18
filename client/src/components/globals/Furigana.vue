<template>
  <div>
    <p class="furigana" v-html="contents.furigana">
    </p>
  </div>
</template>

<script>
// import YouTube from './YouTube'
export default {
  props: [
    'contents'
  ],
  components: {
   // YouTube
  }
}
</script>

<style>
p {
  width: 100%;  
  background: bbe6cc47;
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
