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
          label="Twitter ID"
          append-icon="search"
          placeholder="Search"
          v-model="searchKeyword"
          hint="트위터 계정을 입력하세요"
        ></v-text-field>
     </v-flex>
     
   </v-layout>
   <v-layout  align-center justify-center column fill-height>
     <v-flex pb-2>
     <v-progress-circular
        :size="50"
        v-if="busy"
        color="primary"
        indeterminate
        class="mb-3"
      ></v-progress-circular >
     </v-flex>
   </v-layout>
   
  <v-layout column v-if="twitters">
      <v-flex xs12 sm12 lg12 md12 v-if="!twitters && searchKeyword !== '' ">
        트윗이 없습니다.
      </v-flex>
      <v-flex xs12 sm12 lg12 md12>
        <template v-for="(item, index) in twitters">
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
            <span class="grey--text">{{item.user.description}}</span>
          </div>
        </v-card-title>
        <v-slide-y-transition>
          <v-card-text>
            <p class="furigana" v-html="$options.filters.twiterLink(item.furigana, item)"></p>
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
             <v-layout>
               <v-flex class="text-xs-right grey--text">
                 {{item.created_at |moment("dddd, MMMM Do YYYY, h:mm:ss a")  }}
               </v-flex>
             </v-layout>
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
      twitters: null,
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
      } else{
        serach = this.searchKeyword
      }
      this.search()
    }, 700)
  },
  async mounted () {
     const search = this.$route.params.search
     this.searchKeyword = search;
     this.search()
  },
  filters: {
    twiterLink (value, item) {
      var html = value

      if(item.entities.media){
        item.entities.media.forEach(mediaEle => {
          html = html.replace(mediaEle.url, '<a target="_blank" href="'+ mediaEle.url +'">Twitter</a>')
        })
      }
      if(item.entities.urls){
        item.entities.urls.forEach(urlEle => {
          html = html.replace(urlEle.url, '' )
        })
      }
     return html
    }
  },
  methods: {
    createNewSong () {
      this.$router.push({
        name: 'music-detail',
        params: {  newSong : true}
      })
    },
    async search(){
      var serach = null 
      this.busy = true
      if (this.searchKeyword === '') {
        serach = null
        this.offset = 0
      } else{
        serach = this.searchKeyword
      }
      try {
        var dataSet = []
        if(!serach){
          dataSet = (await TwitterService.homeTimeLine(serach, this.offset)).data;
        }else{
          dataSet = (await TwitterService.index(serach, this.offset)).data;  
        }
        this.twitters = dataSet.length === 0 ? null : dataSet
        //this.count = dataSet.count.count
        //this.offset = this.twitters.length
      } catch (error) {
        alert(error)
      }
      this.busy = false
    },
    async loadMore() {
      this.busy = true
      try {
        if(!this.twitters){
          this.busy = false
          return;
        } 
        if(this.offset >= this.count){
          this.busy = false
          return;
        } 
        
        var dataSet = (await SongsService.index(null, this.offset)).data;
        var data = dataSet.data;
        this.twitters = this.twitters.concat(data) 
        this.offset = this.twitters.length
        
        //this.twitters.push(data)
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