<template>
 <div>
  <div class="metaArea">
      <img style="float:left;margin-bottom:5px;height:40px;" :src="song.albumImageUrl"/> 
      <h5 style="float:left;line-height:40px;margin-left:10px;">{{song.title}} - {{song.artist}}</h5>
      <div class="buttonArea">   
        <v-btn @click="back">back</v-btn>
        <v-btn v-if="isUserLoggedIn"  
        :to="{
          name: 'song-edit', 
          params () {
            return {
              songId: song.id
            }
          }
        }">
        Edit
      </v-btn>
      <v-btn v-if="isUserLoggedIn && !bookmark"
        @click="setAsBookmark">
        Bookmark
      </v-btn>

      <v-btn
        v-if="isUserLoggedIn && bookmark"
        @click="unsetAsBookmark">
        Unbook
      </v-btn>
      </div>
  </div>
  
  
  
  <div style="clear:both"></div>
</div>

</template>

<script>
import {mapState} from 'vuex'
import BookmarksService from '@/services/BookmarksService'
import YouTube from './YouTube'
export default {
  props: [
    'song'
  ],
  components: {
    YouTube
  },
  data () {
    return {
      bookmark: null
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  watch: {
    async song () {
      if (!this.isUserLoggedIn) {
        return
      }

      try {
        const bookmarks = (await BookmarksService.index({
          songId: this.song.id
        })).data
        if (bookmarks.length) {
          this.bookmark = bookmarks[0]
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    async setAsBookmark () {
      try {
        this.bookmark = (await BookmarksService.post({
          songId: this.song.id
        })).data
      } catch (err) {
        console.log(err)
      }
    },
    async unsetAsBookmark () {
      try {
        await BookmarksService.delete(this.bookmark.id)
        this.bookmark = null
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
.metaArea{
  background: #777777;
    height: 66px;
    padding: 14px;
    color: white;
    margin-bottom: 5px;
}
.buttonArea{
  float:right;
}
.youTubeArea{
  width:640px;
 
}
.song {
  padding: 20px;
  height: 330px;
  overflow: hidden;
}

.song-title {
  font-size: 30px;
}

.song-artist {
  font-size: 24px;
}

.song-genre {
  font-size: 18px;
}

.album-image {
  width: 70%;
  margin: 0 auto;
}
</style>
