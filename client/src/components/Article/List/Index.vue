<template>
  <v-layout>     
    <v-flex xs12>
      <!-- <songs-search-panel /> -->
      <Articles-panel/>    
      <!-- <v-layout class="mt-2">  
         <v-flex xs6 >  
           <songs-bookmarks />
         </v-flex>
          <v-flex xs6 >  

           <recently-viewed-songs class="ml-2" />

         </v-flex>
      </v-layout>       -->
                  
    </v-flex>
    <!-- <v-flex :class="{
        xs12: !isUserLoggedIn,
        xs12: isUserLoggedIn
      }" class="ml-2">     
      
    </v-flex> -->
  </v-layout>
</template>

<script>
import ArticlesPanel from './ArticlesPanel'
// import SongsBookmarks from './SongsBookmarks'
// import RecentlyViewedSongs from './RecentlyViewedSongs'
// import SongsSearchPanel from './SongsSearchPanel'
import ArticlesService from '@/services/SongsService'
import {mapState} from 'vuex'

export default {
  components: {
    ArticlesPanel
    // SongsSearchPanel,
    // SongsBookmarks,
    // RecentlyViewedSongs
  },
  computed: {
    ...mapState([
      'isUserLoggedIn'
    ])
  },
  data () {
    return {
      articles: null
    }
  },
  async mounted () {
    this.articles = (await ArticlesService.index()).data
  }
}
</script>

<style scoped>
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
