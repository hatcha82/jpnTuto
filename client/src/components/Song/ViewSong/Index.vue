<template>
  <div>
      <song-metadata :song="song" />
      <v-layout class="mt-2">  
         <v-flex xs6 >  
           <Furigana :song="song" />
         </v-flex>
          <v-flex xs6 >  
          <div class="youTubeArea">  
          <you-tube :youtubeId="song.youtubeId" />
          저작권에 의한 플레이 불가능 할 경우 Youtube 이동<br>
          <a target="_blank" :href="'https://www.youtube.com/watch?v='+ song.youtubeId" > {{song.title}} - {{song.artist}}</a>
          </div>
          <Synthesis :text="song.lyrics" class="ml-2"/>                  
          <recently-viewed-songs class="ml-2 mt-3" />
          <songs-bookmarks v-if="isUserLoggedIn"  class="ml-2 mt-3"/>
         </v-flex>
      </v-layout>          
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Lyrics from './Lyrics'
import Furigana from './Furigana'
import YouTube from './YouTube'
import SongMetadata from './SongMetadata'
import SongsBookmarks from '../List/SongsBookmarks'
import SongsService from '@/services/SongsService'
import SongHistoryService from '@/services/SongHistoryService'
import RecentlyViewedSongs from '../List/RecentlyViewedSongs'
import Synthesis from '../../globals/Synthesis'

export default {
  data () {
    return {
      song: {}
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user',
      'route'
    ])
  },
  methods: {
    async search () {
      const songId = this.route.params.songId
      this.song = (await SongsService.show(songId)).data
      if (this.isUserLoggedIn) {
        SongHistoryService.post({
          songId: songId
        })
      }
    }
  },
  async mounted () {
    this.search()
  },
  watch: {
    '$route' (to, from) {
      this.search()
    }
  },
  components: {
    SongMetadata,
    SongsBookmarks,
    Lyrics,
    Furigana,
    YouTube,
    RecentlyViewedSongs,
    Synthesis
  }
}
</script>

<style scoped>
.youTubeArea{
  padding-left:8px;
}
.rencetView{
  margin-top:10px;
}
</style>
