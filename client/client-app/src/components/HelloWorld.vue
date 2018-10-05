<template>
  <div class="primary" style="height:400px;position:relative">
    
      <img style="    height: 100px;
    bottom: 40px;
    position: absolute;
    right: 40px;
      " src="../assets/logoWhiteWide.svg"/>
    
  </div>  
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
