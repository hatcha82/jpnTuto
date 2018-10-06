<template>
<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="-37">
  <v-btn 
        v-if="isUserLoggedIn"
        class="mb-5 mr-2"
        absolute
        bottom
        right
        fixed
        fab
        @click="createNewArticle()"
        color="primary">
        <v-icon>add</v-icon>
      </v-btn>
  <v-layout row spacer >
      <v-flex xs12 sm12 lg12 md12>
        <v-card>          
          <v-list two-line>
            <template v-for="(item, index) in articles">
              <router-link  :to="{ name: 'article-detail', params: {  articleId: item.id}}" tag="div">
              <v-list-tile
                :key="item.id"
                avatar            
              >
                <v-list-tile-avatar tile size=60 >
                <v-img  :lazy-src="item.newsImageUr ? item.newsImageUrl : require('../../assets/noImage.png')"
                        :src="item.newsImageUrl ? item.newsImageUrl : require('../../assets/noImage.png')"
                        aspect-ratio="1"
                        class="mr-3"
                        />
                </v-list-tile-avatar>
                <v-list-tile-content class="pl-2">
                  <v-list-tile-title style="height:40px">
                    {{item.title}}
                  </v-list-tile-title>
                   <v-list-tile-sub-title >
                     <img  :lazy-src="item.newsPubllisherImageUrl ? item.newsPubllisherImageUrl : require('../../assets/noImage.png')"
                        :src="item.newsPubllisherImageUrl ? item.newsPubllisherImageUrl : require('../../assets/noImage.png')"
                        style="postion:absolute;width:45px" 
                        />
                        {{item.newsPublisher}}
                    <br>
                    <span class="caption">
                    {{ item.newsPublishedDate | moment("dddd, MMMM Do YYYY, h:mm:ss a")}}
                    </span>
                   </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              </router-link>
              <v-divider :key="`${index}`"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <back-to-top>
     <v-btn 
          class="mb-5 mr-2"    
          absolute
          bottom
          right
          fixed
          fab
          color="primary">
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn>
  </back-to-top>  
</div>    
</template>
<script>
import {mapState} from 'vuex'
import ArticlesService from '@/services/ArticlesService'

export default {
  data () {
    return {
      articles: null,
      busy : false,
      count: 0,
      offset: 0
    }
  },
    computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  
  async mounted () {
    try {
      
      var dataSet = (await ArticlesService.index(null, this.offset)).data;
      this.articles = dataSet.data;
      this.count = dataSet.count.count
      this.offset = this.articles.length
    } catch (error) {
      alert(error)
    }
  },
  methods: {
    createNewArticle () {
      this.$router.push({
        name: 'article-detail',
        params: {  newarticle : true}
      })
    },
    async loadMore() {
      this.busy = true
      try {
        if(!this.articles){
          this.busy = false
          return;
        } 
        if(this.offset >= this.count){
          this.busy = false
          return;
        } 
        var dataSet = (await ArticlesService.index(null, this.offset)).data;
        var data = dataSet.data;
        this.articles = this.articles.concat(data) 
        this.offset = this.articles.length
        
        //this.articles.push(data)
      } catch (error) {
        alert(error)
      }
      this.busy = false
      
    }
  }
}
</script>