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
    @click="createNewSong()"
    color="primary">
    <v-icon>add</v-icon>
  </v-btn>
   <v-layout row>   
     <v-flex pa-3 pb-0>
       <v-text-field
          fixed
          label="음악 검색"
          append-icon="search"
          placeholder="Search"
          v-model="searchKeyword"
         hint="검색어: 제목, 아티스트"
        ></v-text-field>
     </v-flex>
   </v-layout>
  <v-layout row>
      <v-flex xs12 sm12 lg12 md12>
        <v-card>          
          <v-list two-line>
            <template  v-for="(item, index) in songs">
              <router-link  v-bind:key="item.id" :to="{ name: 'music-detail', params: {  songId: item.id}}" tag="div">
              <v-subheader
                v-if="item.header"
                :key="item.header"
              >
                {{ item.header }}
              </v-subheader>
              <v-list-tile
                v-else
                :key="item.title"
                avatar            
              >
                <v-list-tile-avatar>
                  
                  <v-img
                   :lazy-src="item.albumImageUrl ? item.albumImageUrl : require('../../assets/noImage.png')"  
                    :src="item.albumImageUrl ? item.albumImageUrl : require('../../assets/noImage.png')"/>                   
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title">
                  </v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.artist"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              </router-link>
              <v-divider :key="`${index}`"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout> 
</div>    
</template>
<script>
import {mapState} from 'vuex'
import SongsService from '@/services/SongsService'
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
    searchKeyword: _.debounce(async function () {
      var search = null 
      if (this.searchKeyword === '') {
        search = null
        this.offset = 0
      }else{
        search = this.searchKeyword
        this.offset = 0
      }

      try {
        var dataSet = (await SongsService.index(search, this.offset)).data;
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
      var dataSet = (await SongsService.index(null, this.offset)).data;
      this.songs = dataSet.data;
      this.count = dataSet.count.count
      this.offset = this.songs.length
    } catch (error) {
      alert(error)
    }
  },
  filters: {
    imageInfo(item){
      return `
Title: ${item.title}
Artist: ${item.artist}
Album: ${item.album}
Album Image Source:
${item.albumImageUrl}
      `
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
        var search
        if (this.searchKeyword === '') {
          search = null
        }else{
          search = this.searchKeyword
        }

        var dataSet = (await SongsService.index(search, this.offset)).data;
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