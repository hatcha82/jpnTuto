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
          </div>
          <div class="rencetView">
           <recently-viewed-songs class="ml-2" />
           </div>
         </v-flex>
      </v-layout>    
      
       
        
      
      
      
    
    
    <!-- <v-layout class="mt-2">
      <v-flex xs6>
        <lyrics :song="song" />
      </v-flex>

      <v-flex xs6 class="ml-2">
        
      </v-flex>
    </v-layout> -->
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Lyrics from './Lyrics'
import Furigana from './Furigana'
import YouTube from './YouTube'
import SongMetadata from './SongMetadata'
import SongsService from '@/services/SongsService'
import SongHistoryService from '@/services/SongHistoryService'
import RecentlyViewedSongs from '../Songs/RecentlyViewedSongs'

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
  async mounted () {
    const songId = this.route.params.songId
    this.song = (await SongsService.show(songId)).data

    if (this.isUserLoggedIn) {
      SongHistoryService.post({
        songId: songId
      })
    }
  },
  components: {
    SongMetadata,
    Lyrics,
    Furigana,
    YouTube,
    RecentlyViewedSongs
  }
}
</script>

<style scoped>
.rencetView{
  margin-top:10px;
}
</style>
