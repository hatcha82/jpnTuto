<template>
<!-- <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="-37"> -->
<div>
  <v-btn 
        v-if="isUserLoggedIn"
        class="mb-5 mr-2"
        absolute
        bottom
        right
        fixed
        fab
        @click="createNewSong()"
        color="primary">
        <v-icon>add</v-icon>
      </v-btn>
   <v-layout row>   
     <v-flex pa-3 pb-0>
      <v-text-field
      fixed
      placeholder="Search...Twitter"
      single-line
      class="searchBox "
      append-icon="search"
      color="white"
      hint="Search by song title, artist, album, or genre"
      v-model="searchKeyword"
    ></v-text-field>
     </v-flex>
   </v-layout>
  <v-layout row>
      <v-flex xs12 sm12 lg12 md12>
        <template v-for="(item, index) in songs">
      <v-card class="mb-3 ml-1 mr-1">
        <v-img
          :src="item.user.profile_banner_url"
          height="60px"
        >
          

          
          
        </v-img>

        <v-card-title primary-title>
          <div>
          
            <v-layout fill-height>
              <v-flex>
                <v-avatar size="40px" class="mr-2">
                  <img
                      :src="item.user.profile_image_url"
                    >
                </v-avatar>
              </v-flex>
              <v-flex xs12 align-end flexbox>
                <span class="headline">{{item.user.screen_name}}@{{item.user.name}}</span>
              </v-flex>
            </v-layout>
            <span class="grey--text">1,000 miles of wonder</span>
          </div>
        </v-card-title>

        
        <v-slide-y-transition>
          <v-card-text>
            <p class="furigana" v-html="item.furigana"></p>
            <v-container grid-list-sm fluid>
              <v-layout row wrap>
                <v-flex
                  v-for="(ent,index) in item.entities.media"
                  :key="index"
                  xs12
                  d-flex
                >
                  <v-card flat tile class="d-flex">
                    <v-img
                      :src="ent.media_url"
                      :lazy-src="ent.media_url"
                      aspect-ratio="1"
                      class="grey lighten-2"
                    >
                      <v-layout
                        slot="placeholder"
                        fill-height
                        align-center
                        justify-center
                        ma-0
                      >
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-layout>
                    </v-img>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
            <v-btn flat>Share</v-btn>
            <v-btn flat color="purple">Explore</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>

          </v-card-text>
          
        </v-slide-y-transition>
      </v-card>
        </template>
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
import SongsService from '@/services/SongsService'
import TwitterService from '@/services/TwitterService'
import _ from 'lodash'

export default {
  components: {
  },
  data () {
    return {
      searchKeyword : '',
      songs: null,
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
  watch: {
    searchKeyword: _.debounce(async function (value) {
      var serach = null 
      if (this.searchKeyword === '') {
        serach = null
        this.offset = 0
      }else{
        serach = this.searchKeyword
      }

      try {
        var dataSet = (await SongsService.index(serach, this.offset)).data;
        this.songs = dataSet.data;
        this.count = dataSet.count.count
        this.offset = this.songs.length
      } catch (error) {
        alert(error)
      }
      
    }, 700)
  },
  async mounted () {
    try {
      var dataSet = (await TwitterService.index(null, this.offset)).data;
      this.songs = dataSet;
      console.log(dataSet)
      //this.count = dataSet.count.count
      //this.offset = this.songs.length
    } catch (error) {
      alert(error)
    }
  },
  methods: {
    createNewSong () {
      this.$router.push({
        name: 'music-detail',
        params: {  newSong : true}
      })
    },
    async loadMore() {
      this.busy = true
      try {
        if(!this.songs){
          this.busy = false
          return;
        } 
        if(this.offset >= this.count){
          this.busy = false
          return;
        } 
        
        var dataSet = (await SongsService.index(null, this.offset)).data;
        var data = dataSet.data;
        this.songs = this.songs.concat(data) 
        this.offset = this.songs.length
        
        //this.songs.push(data)
      } catch (error) {
        alert(error)
      }
      this.busy = false
      
    }
  }
}
</script>
<style>
p.furigana{
  white-space: pre-wrap;
  font-size:1.5em
}
</style>