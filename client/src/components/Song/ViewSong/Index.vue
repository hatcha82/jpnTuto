<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm12 md12>
         <song-metadata :song="song" />         
      </v-flex>
      <v-flex d-flex xs12 sm6 md8>
         <Furigana :song="song" />   
      </v-flex>
      <v-flex d-flex xs12 sm6 md4>
        <v-layout row wrap>
          <v-flex d-flex xs12 sm6 md12>
            <div>
              <you-tube :youtubeId="song.youtubeId" xs12/>
              저작권에 의한 플레이 불가능 할 경우 Youtube 이동<br>
              <a target="_blank" :href="'https://www.youtube.com/watch?v='+ song.youtubeId" > {{song.title}} - {{song.artist}}</a>
              <Synthesis :text="song.lyrics" class="mt-3"/>
              <recently-viewed-songs class="mt-3" />
              <songs-bookmarks v-if="isUserLoggedIn"  class="mt-3"/> 
            </div>             
          </v-flex>
          <v-flex d-flex xs12>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
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
      song: {},
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`
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

</style>
