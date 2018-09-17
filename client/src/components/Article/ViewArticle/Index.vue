<template>
  <div>
      <article-metadata :article="article" />
      <v-layout class="mt-2">  
         <v-flex xs6 >  
           <Furigana :article="article" />

           
         </v-flex>
          <v-flex xs6 >            
          <div class="rencetView">
            <Synthesis :article="article" />
           <!-- <recently-viewed-songs class="ml-2" /> -->
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
import Synthesis from './Synthesis'
// import YouTube from './YouTube'
import ArticleMetadata from './ArticleMetadata'
import ArticlesService from '@/services/ArticlesService'
// import ArticlesHistoryService from '@/services/ArticlesHistoryService'
// import RecentlyViewedSongs from '../Articles/RecentlyViewedSongs'

export default {
  data () {
    return {
      article: {}
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
    const articleId = this.route.params.articleId
    this.article = (await ArticlesService.show(articleId)).data
    // const articleId = this.route.params.articleId
    // console.log(articleId)
    // this.article = (await ArticlesService.show(a)).data
    // if (this.isUserLoggedIn) {
    //   ArticlesHistoryService.post({
    //     articleId: articleId
    //   })
    // }
  },
  components: {
    ArticleMetadata,
    Lyrics,
    Furigana,
    Synthesis
  }
}
</script>

<style scoped>
.rencetView{
  margin-top:10px;
}
</style>
