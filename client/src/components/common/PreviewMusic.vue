<template>
   <div>
     this
    <audio id="previewPlayer"></audio>
    {{src}}
     <v-btn
      dark
      class="primary"
      @click="play">      
      <v-icon >far fa-bookmark</v-icon>
    </v-btn>
   </div>
</template>

<script>

export default {
  props: [
    'src'
  ],
  watch:{
     
  },
  methods:{
    play () {
      var previewPlayer = document.getElementById('previewPlayer')
      previewPlayer.play()
    },
  }  
}
</script>

<style>
</style>