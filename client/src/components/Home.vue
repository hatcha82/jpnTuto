<template>
  <div>
  </div>
</template>
<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  data () {
    return {
      base: {}
    }
  },
  watch: {
  },
  method: {
    linkToDetail (id) {
      this.$router.push({
        name: 'song',
        params: {
          songId: id
        }
      })
    }
  }
}
</script>

<style>

</style>
