<template>
  <v-layout row  >
    <v-flex xs12 sm12 lg12 md12>
      <template v-for="(item, index) in articles">
      <v-card>          
        <v-list>
            <router-link v-bind:key="item.id" :to="{ name: 'article-detail', params: {  articleId: item.id}}" tag="div">
            <v-list-tile
              :key="item.id"
              avatar            
            >
              <v-list-tile-avatar tile size=60 >
              <v-img  :lazy-src="item.newsImageUr ? item.newsImageUrl : require('../../assets/noImage.png')"
                      :src="item.newsImageUrl ? item.newsImageUrl : require('../../assets/noImage.png')"
                      aspect-ratio="1"
                      class="mr-3"
                      contain
                      />
              </v-list-tile-avatar>
              <v-list-tile-content class="pl-2">
                <v-list-tile-title >
                  {{item.title}}
                </v-list-tile-title>
                  <v-list-tile-sub-title >
                    <img  :lazy-src="item.newsPubllisherImageUrl ? item.newsPubllisherImageUrl : require('../../assets/noImage.png')"
                      :src="item.newsPubllisherImageUrl ? item.newsPubllisherImageUrl : require('../../assets/noImage.png')"
                      style="postion:absolute;width:30px" 
                      />
                      {{item.newsPublisher}}
                  <span class="caption">
                  {{ item.newsPublishedDate | moment("dddd, MMMM Do YYYY, h:mm:ss a")}}
                  </span>
                  </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            </router-link>
        </v-list>
      </v-card>
      </template>
    </v-flex>
  </v-layout>
</template>
<script>
import {mapState} from 'vuex'
import ArticlesService from '@/services/ArticlesService'

export default {
  data () {
    return {
      articles: null,
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
      var dataSet = (await ArticlesService.rencentNews()).data;
      this.articles = dataSet.data;
    } catch (error) {
      alert(error)
    }
  },
  methods: {
  }
}
</script>