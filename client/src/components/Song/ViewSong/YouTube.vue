<template>
<div>
  <!-- <youtube :video-id="youtubeId" :player-vars="playerVars" :player-width="playerWidth" :player-height="playerHeight">
  </youtube> -->  
  <div style="position: relative; padding-bottom: 56.25%;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" :src="'https://www.youtube.com/embed/'+ youtubeId" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
  </div>
</div>
</template>

<script>
export default {
  props: [
    'youtubeId'
  ],
  data () {
    return {
      playerVars: {
        autoplay: 0
      },
      playerWidth: '100%',
      playerHeight: '100%'
    }
  },
  computed: {
    player () {
      return this.$refs.youtube.player
    }
  },
  method: {
  },
  mounted () {
  }
}
</script>

<style scoped>
</style>
