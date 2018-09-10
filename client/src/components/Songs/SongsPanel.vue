<template>
  <panel title="노래">
    <v-btn
      slot="action"
      :to="{
        name: 'songs-create'
      }"
      class="white"
      light
      small
      absolute
      right
      middle      
      fab>
      Add
    </v-btn>

    <div 
      v-for="song in songs"
      class="song"
      :key="song.id">

      <v-layout>
        <v-flex xs2>
          <img class="album-image"
         
           :src="song.albumImageUrl" />           
        </v-flex>
        <v-flex xs10>
          <div class="song-title">
            {{song.title}} {{song.artist}} {{song.genre}}
          </div>
          <div class="song-artist">
           
          </div>
          <div class="song-genre">
            
          </div>
          <div class="song-genre">
          Created At : {{song.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a")}}<br>
          Updated At : {{song.updatedAt | moment("dddd, MMMM Do YYYY, h:mm:ss a")}}
        </div>
          <v-btn
            dark
            class="cyan"
            :to="{
              name: 'song', 
              params: {
                songId: song.id
              }
            }">
            보기
          </v-btn>
        </v-flex>

       
      </v-layout>
    </div>
  </panel>
</template>

<script>
import SongsService from '@/services/SongsService'

export default {
  data () {
    return {
      songs: null
    }
  },
  watch: {
    '$route.query.search': {
      immediate: true,
      async handler (value) {
        this.songs = (await SongsService.index(value)).data
      }
    }
  }
}
</script>

<style scoped>
.song {
  padding: 20px;
  height: 180px;
  overflow: hidden;
}

.song-title {
  font-size: 30px;
  text-align:left;
  padding-left:25px;
}

.song-artist {
  font-size: 24px;
}

.song-genre {
  font-size: 18px;
}

.album-image {
  width: 150px;
  margin: 0 auto;
}
</style>
