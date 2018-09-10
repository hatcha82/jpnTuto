<template>
     <v-text-field
      :append-icon-cb="() => {}"
      placeholder="Search..."
      single-line
      append-icon="search"
      color="white"
      hide-details
      label="Search by song title, artist, album, or genre"
      v-model="search"
    ></v-text-field>
    

</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      search: ''
    }
  },
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: 'songs'
      }
      if (this.search !== '') {
        route.query = {
          search: this.search
        }
      }
      this.$router.push(route)
    }, 700),
    '$route.query.search': {
      immediate: true,
      handler (value) {
        this.search = value
      }
    }
  }
}
</script>

<style>

</style>
