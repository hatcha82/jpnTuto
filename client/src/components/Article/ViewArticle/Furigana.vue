<template>
  <div>
    <p class="furigana" v-html="article.furigana">
    </p>
    <p>
      Refernce Link: <a target="_blank" :href="article.newsUrl"><span>{{article.newsUrl}}</span></a>
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
