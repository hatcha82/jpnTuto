<template>
  <div>
    <p class="furigana" v-html="article.furigana">
    </p>
  </div>
</template>

<script>
export default {
  props: [
    'article'
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
