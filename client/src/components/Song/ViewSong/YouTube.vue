<template>
    <youtube :video-id="youtubeId" :player-vars="playerVars">
    </youtube>
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
      }
    }
  }
}
</script>

<style scoped>
</style>
