<template>
<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="00">
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
          :hint="twitterMsg"
        ></v-text-field>
     </v-flex>
     
   </v-layout>
   <v-progress-linear  :indeterminate="busy"></v-progress-linear>    
   <!-- <v-layout  align-center justify-center column fill-height>
     <v-flex pb-2>
      
     <v-progress-circular
        :size="50"
        v-if="busy"
        color="primary"
        indeterminate
        class="mb-3"
      ></v-progress-circular >
     </v-flex>
   </v-layout> -->
   
  <v-layout column v-if="twitters">
      <v-flex xs12 sm12 lg12 md12 v-if="!twitters && searchKeyword !== '' ">
        트윗이 없습니다.
      </v-flex>
      <v-flex xs12 sm12 lg12 md12>
        <template v-for="(item, index) in twitters">
      <v-card class="mb-3 ml-1 mr-1" v-if="item.user">
        <v-img
          :src="item.user.profile_banner_url"
          height="100px"
        >
        </v-img>

        <v-card-title primary-title class="">
          <div>
          
            <v-layout fill-height class="">
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
            <p class="furigana pl-3 pr-0" v-html="$options.filters.twiterOnlyText(item.furigana, item)"></p>
            <!-- <p class="furigana pl-3 pr-0" v-html="item.furigana"></p> -->
            <!-- <pre v-text="$options.filters.twiterOnlyText(item.full_text, item)"></pre> -->
            <Synthesis :text="item.full_text" class="mt-3"/>
            <v-container grid-list-sm fluid v-if="item.extended_entities">
              <v-layout row wrap>
                  <v-flex
                    v-for="(ent,index) in item.extended_entities.media"
                    :key="index"
                    xs12
                    v-if="(ent.type === 'video' || ent.type === 'animated_gif')"
                  >
                <video-player  class="video-player-box"
                 ref="videoPlayer"
                 :options="videoParam(ent)"
                 :playsinline="true">
                  </video-player>
                  <!-- <my-video :sources="videoParam (ent).sources" :options="videoParam (ent).options"></my-video> -->
                </v-flex>
              </v-layout>
            </v-container>
             
            <v-container grid-list-sm fluid >
              <v-layout row wrap>
                <v-flex
                  v-for="(ent,index) in item.entities.media"
                  :key="index"
                  xs12
                  d-flex
                > 
                  <v-card flat tile class="d-flex" v-if="ent.type == 'photo'">
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
                        <v-progress-circular indeterminate color=""></v-progress-circular>
                      </v-layout>
                    </v-img>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
             <v-layout>
               <v-flex class="text-xs-right grey--text">
                 {{item.id}}
                 <br>
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
  <v-progress-linear  :indeterminate="busy"></v-progress-linear>    
</div>    
</template>
<script>
import {mapState} from 'vuex'
import SongsService from '@/services/SongsService'
import TwitterService from '@/services/TwitterService'
import _ from 'lodash'
import myVideo from 'vue-video'
import 'video.js/dist/video-js.css'
import Synthesis from '@/components/common/Synthesis'

import { videoPlayer } from 'vue-video-player'

export default {
  components: {
    myVideo,
    videoPlayer,
    Synthesis
  },
  data () {
    return {
      searchKeyword : null,
      twitters: null,
      busy : false,
      count: 0,
      isLast : false,
      offset: null,
      twitterMsg: '트위터 계정을 입력하세요',
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
      if(this.busy) return;
      var serach = null       
      this.isLast = false
      this.offset = null
      if (!this.searchKeyword || this.searchKeyword === '') {
        serach = null
      } else{
        serach = this.searchKeyword
      }
      this.search()
    }, 1000)
  },
  async mounted () {
     const search = this.$route.params.search
     this.searchKeyword = search;
     this.search()
  },
  
  filters: {
    async twiterLink (value, item) {
      var html = value
      if(html){
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
      }
     return html
    },
  twiterOnlyText (value, item) {
      var html = value
      if(html){
        if(item.entities.media){
          item.entities.media.forEach(mediaEle => {
            html = html.replace(mediaEle.url, '')
          })
        }
        if(item.entities.urls){
          item.entities.urls.forEach(urlEle => {
            html = html.replace(urlEle.url, '' )
          })
        }
      }
     return html
    }
  },
  methods: {
    isVideoContains(media){

    },
    videoParam (media) {
      var sources = []
      media.video_info.variants.forEach(variant => {
        var source = {
            src: variant.url,
            type: variant.url.content_type
        }
        sources.push(source)
      });


      return  {
          // videojs options
          fluid:true,
          //aspectRatio: media.aspect_ratio[0] + ':' + media.aspect_ratio[1],
          muted: false,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: sources,
          poster: media.media_url
        }
      // return {
      //           sources: sources,
      //           options: {
      //               autoplay: false,
      //               volume: 0.6,
      //               poster: media.media_url
      //           }
      //         }
    },
    createNewSong () {
      this.$router.push({
        name: 'music-detail',
        params: {  newSong : true}
      })
    },
    async search(isAppend){
      var serach = null 
      this.busy = true
      this.twitterMsg = '트위터 계정을 입력하세요'
      if (this.searchKeyword === '') {
        serach = null
      } else{
        serach = this.searchKeyword
      }   
      try {
        var dataSet = []
        console.log('offset request', this.offset)
        if(!serach){
          dataSet = (await TwitterService.homeTimeLine(serach, this.offset)).data;
        }else{
          dataSet = (await TwitterService.userTimeLine(serach, this.offset)).data;  
        }

        
       
        
        if(!dataSet.code){
          if( isAppend){
            var lastOffset = this.offset
            
            //dataSet =  this.$_.without(dataSet,{id_str : this.offset})
            var appendDataSet = []
            for(var i = 0 ;  i < dataSet.length; i++){
              
              if(dataSet[i].id_str != this.offset){
                appendDataSet.push(dataSet[i])
                console.log(dataSet[i].id_str)
              }
            }
            
            console.log('afeter: ' ,dataSet.length)
            if(appendDataSet.length == 1){
              this.isLast = true;
              this.twitters = appendDataSet
            }else{
              this.twitters = this.twitters.concat(appendDataSet)
            }
            this.offset = appendDataSet.reverse()[0].id_str; 
           
            

          }else{
            this.twitters = dataSet.length === 0 ? null : dataSet
            this.offset = appendDataSet.reverse()[0].id_str;
            if(this.twitters.length == 1){
              this.isLast = true;
            }
          }

          
           //this.offset = twit.id_str
           console.log('offset sett', this.offset)
        }else{
          this.twitterMsg = dataSet.message
          this.twitters =null
          this.offset = null
          this.isLast = true
        }
       
      } catch (error) {
        console.log(error)
        console.log(this.twitters)
      }
      this.busy = false
    },
    async loadMore() {
      this.busy = true
      if(!this.isLast){
        this.search(true)
      }else{
        this.busy = false
      }
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