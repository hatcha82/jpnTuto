<template>
  <div>
      <article-metadata :article="article" />
      <v-layout class="mt-2">  
         <v-flex xs9 >  
           <Furigana :article="article" />
         </v-flex>
          <v-flex xs3 >            
          <div class="rencetView">            
            <Synthesis :text="article.article" class="ml-2 mt-2"/>   
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
import Synthesis from '../../globals/Synthesis'
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
  methods: {
    async search () {
      const articleId = this.route.params.articleId
      this.article = (await ArticlesService.show(articleId)).data
      this.contents = this.article.article
    }
  },
  async mounted () {
    this.search()
    // const articleId = this.route.params.articleId
    // console.log(articleId)
    // this.article = (await ArticlesService.show(a)).data
    // if (this.isUserLoggedIn) {
    //   ArticlesHistoryService.post({
    //     articleId: articleId
    //   })
    // }
  },
  watch: {
    '$route' (to, from) {
      this.search()
    }
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
