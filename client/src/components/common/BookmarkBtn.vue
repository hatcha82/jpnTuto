<template>
  <div>
    <v-btn
      v-if="isUserLoggedIn && !bookmark"
      dark
      class="primary"
      @click="setAsBookmark">      
      <v-icon >far fa-bookmark</v-icon>
    </v-btn>

    <v-btn
      v-if="isUserLoggedIn && bookmark"
      dark
      class="primary"
      @click="unsetAsBookmark">
      <v-icon >fas fa-bookmark</v-icon>
    </v-btn>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import BookmarksService from '@/services/BookmarksService'
export default {
  props: [
    'bookmarkObject'
  ],
  data () {
    return {
      bookmark:null
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  async mounted () {
    this.reloadBookmark()
  },
  watch:{
      // '$route' () {
      //   alert(this.bookmark)
      //   this.reloadBookmark()
      // },
      bookmarkObject: {
        async handler(){          
          this.reloadBookmark()
        },
        deep:true
    }
  },
  methods: {
    async reloadBookmark(){
      if (!this.isUserLoggedIn) {
        return
      }
      try {
        const bookmarks = (await BookmarksService.index({
          songId: this.bookmarkObject.id
        })).data
        if (bookmarks.length) {
          this.bookmark = bookmarks[0]
        }else{
          this.bookmark =null
        }
      } catch (err) {
        //alert(err)
      }
    },
    async setAsBookmark () {
      try {
        this.bookmark = (await BookmarksService.post({
          songId: this.bookmarkObject.id
        })).data
      } catch (err) {console.log(err)}
    },
    async unsetAsBookmark () {
        try {
          await BookmarksService.delete(this.bookmark.id)
          this.bookmark = null
        } catch (err) {console.log(err)}
      }
  }
}
</script>

<style>
</style>