<template>
  <panel title="YouTube Video">
    <youtube
      :video-id="youtubeId"
      
      :player-vars="playerVars"
      >
    </youtube>
  </panel>
</template>

<script>
export default {
  props: [
    'youtubeId'
  ],
  data () {
    return {
      playerVars: {
        autoplay: 1
      }
    }
  }
}
</script>

<style scoped>
</style>
