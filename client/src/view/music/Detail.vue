<template>
<div id="top">
<v-container fluid grid-list-md >
    <v-layout row wrap>
      <v-flex d-flex xs12 sm12 md12 >
      <v-card>
        <v-img
          class="white--text"
          height="200px"
          :src="song.albumImageUrl ? song.albumImageUrl : require('../../assets/noImage.png')"
        >
        
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-start flexbox>
                  <img 
                :src="song.albumImageUrl ? song.albumImageUrl : require('../../assets/noImage.png')"
                height="150px;"
                style="float:right;border:1px solid #eee"
                :title="song.albumImageUrl"  
                contain
              />
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>
        <v-card-title>
          <div v-if="(!edit)" >
            <span class="headline primary--text">{{song.title}}</span><br>
            <span >Aritst : {{song.artist}}</span><br>
            <span >Album : {{song.album}}</span><br>
            <span >Genre : {{song.genre}}</span><br>
            <br>
            <a target="_blank" :href="('https://www.google.co.kr/search?q='+ song.title + ' ' + song.artist)" v-if="!song.albumImageUrl">{{song.title}} {{song.artist}}<br></a>
            <span class="grey--text">Image 출처: <a  class="grey--text" :href="song.albumImageUrl">{{song.albumImageUrl}}</a></span>
          </div>
          <div style="float:right">
          </div>
        </v-card-title>
        <v-card-actions>
          <div>
            <Synthesis :text="song.lyrics" class=""/>
          </div>
          <div class="ml-2">
            <BookmarkBtn :bookmarkObject="song"/>
          </div>
          <div>
            <v-btn v-if="(isUserLoggedIn)" @click="newMusic" flat color="info">New</v-btn>
            <v-btn v-if="(edit)" @click="saveMusic" flat color="info">Save</v-btn>
          </div>          
          
          <div v-if="(isUserLoggedIn && user.id === song.createdUserId ) || (isUserLoggedIn && user.adminFlag === 'Y')" >
          <v-btn v-if="(!edit)" @click="editMusic" flat color="info">Edit</v-btn>
          <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-btn slot="activator" flat color="info" dark>Delete</v-btn>
            <v-card>
              <v-card-title class="warning">Delete</v-card-title>
              <v-card-text>삭제하시겠습니까?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning darken-1" flat @click = "remove">Yes</v-btn>
                <v-btn color="warning darken-1" flat @click.native="deleteDialog = false">No</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          </div>
        </v-card-actions>
        <div class="pa-3" v-if="(edit)" >
          <v-layout >
             <v-flex xs12 sm12 md12 lg12>
            <v-text-field
              label="artist"
              v-model="song.artist"
            ></v-text-field>
            <v-text-field
              label="title"
              v-model="song.title"
            ></v-text-field>
            <v-text-field
              label="Album"
              v-model="song.album"
            ></v-text-field>
            <v-text-field
              label="Genre"
              v-model="song.genre"
            ></v-text-field>
            <v-text-field
              label="Album URL"
              v-model="song.albumImageUrl"
            ></v-text-field>           
            <v-text-field
              label="Youtube ID"
              v-model="song.youtubeId"
            ></v-text-field>
            <v-textarea
                auto-grow
                v-if="(edit)" 
                label="Lyrics"
                v-model="song.lyrics"
                hint="Hint text"
              ></v-textarea>              
            </v-flex>
            <v-flex column xs12 sm12 md12 lg12>
              <v-card class="pa-2" v-if="song.youtubeId">
                <div style="position: relative; padding-bottom: 56.25%;">
                  <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" :src="'https://www.youtube.com/embed/'+ song.youtubeId" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
                </div>
              </v-card>
              <v-card>                
                <v-container grid-list-sm fluid v-if="images">
                  <v-layout row wrap>
                    <v-flex
                      v-for="(item, index) in images.items"
                      :key="index"
                      xs2
                      d-flex
                    >
                      <v-card flat tile class="d-flex">
                        <v-img
                          :src="item.link"
                          :lazy-src="item.link"
                          aspect-ratio="1"
                          class="grey lighten-2"
                          @click="setImage(item)"
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
              </v-card>
            </v-flex>
          </v-layout>            
        </div> 
      </v-card>      
    </v-flex>
    
    <v-flex d-flex xs12 sm12 md6 child-flex v-if="(!edit)">
      <v-card>
      <v-tabs
        v-model="activeTab"
        color="primary"
        slider-color="yellow"
        >
        <v-tab          
          ripple
          key="1"
        class="white--text" >
        함께 보기
        </v-tab>
        <v-tab          
          ripple
          key="1"
        class="white--text" >
        후리가나
        </v-tab>
        <v-tab          
          ripple
          key="2"
        class="white--text">
        원본
        </v-tab>
        <v-tab          
          ripple
          key="3"
        class="white--text">
        번역
        </v-tab>
        <v-tab-item  >
          <v-card flat>
            <v-card-text>
              <div v-html="$options.filters.withTranslate(song.tab, song.lyricsKor)" class="furigana">
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item  >
          <v-card flat>
            <v-card-text>
              <div v-html="song.tab" class="furigana">
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <div  v-html="song.lyrics" class="furigana">
              </div>
            </v-card-text>  
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>              
              <div  v-html="song.lyricsKor" class="furigana">
              </div>
            </v-card-text>  
          </v-card>
        </v-tab-item>
      </v-tabs>
      </v-card>
    </v-flex>
    <v-flex d-flex xs12 sm12 md6>
      <div>
      <v-card class="pa-2" v-if="song.youtubeId">
        <a target="_blank" :href="'https://www.youtube.com/watch?v='+ song.youtubeId" > 
        <img height="20px" src="data:image/png;base64,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"/>
        </a>
        <div style="position: relative; padding-bottom: 56.25%;">
          <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" :src="'https://www.youtube.com/embed/'+ song.youtubeId" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
        </div>
      <br>
      저작권에 의한 플레이 불가능 할 경우 Youtube 이동 
            <a target="_blank" :href="'https://www.youtube.com/watch?v='+ song.youtubeId" > {{song.title}} - {{song.artist}}</a>
      </v-card>
      <v-card  class="mt-3">
         <v-card-title class="primary">
            <span class="white--text">{{song.artist}}의 다른노래</span>
          </v-card-title>
          <v-container>
          
        <ArtistMusicList ref="artistMusicList" :songs="artistSongs"/>
          </v-container>
      </v-card>
      
      <v-card  class="mt-3">
         <v-card-title class="primary">
            <span class="white--text">이 노래는 어떤가요?</span>
          </v-card-title>
          <v-container>
        <RandomMusicList ref="randomMusic"/>
          </v-container>
      </v-card>
      </div>
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
</v-container>   
</div> 
</template>
<script>
import {mapState} from 'vuex'
import RandomMusicList from '@/components/music/RandomMusicList'
import ArtistMusicList from '@/components/music/ArtistMusicList'
import SongsService from '@/services/SongsService'
import FuriganaService from '@/services/FuriganaService'
import Synthesis from '@/components/common/Synthesis'
import BookmarkBtn from '@/components/common/BookmarkBtn'

export default {
  components: {
    Synthesis,
    ArtistMusicList,
    RandomMusicList,
    BookmarkBtn
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  data () {
    return {
      deleteDialog: false,
      song: null,
      artistSongs: null,
      images:null,
      edit: false,
      activeTab: 0,
      imgNotFound: require('../../assets/noImage.png')
    }
  }, 
  filters:{
    imageCheck(value){
      if(value){
        return value
      }else{
        return this.imgNotFound
      }
    },
    withTranslate(furigana, traslate){
      var html = ''; 
      var furiganaArray = furigana.split('\n')
      var traslateArray = traslate.split('\n')
      for(let [index,line] of furiganaArray.entries()){
        var trans =  traslateArray[index] ? traslateArray[index] : ''
        var furiganaText = line ? line : ''
        html += furiganaText;
        html += '\n'
        html +=  `<span style='color:#aaa;font-size:0.9em'>${trans}</span>`;
        html += '\n'
      }
      return html;
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    setImage(imageItem){
      this.song.albumImageUrl = imageItem.link
    },
    newMusic () {
      this.song = {},
      this.images = {},
      this.song.genre = 'J-pop'
      this.edit = true 
    },
    editMusic () {
       this.edit = true 
    },
    saveMusic () {      
      if(this.song.id){
        this.save()  
      } else {
        this.create()
      }
     
      this.edit = false 
    },
    async remove () {
      try {
        await SongsService.delete(this.song)
        this.$router.push({
          name: 'music-list'
        })
      } catch (err) {
        alert(err)
      }
    },
    async create () {
      this.error = null
      const areAllFieldsFilledIn = Object
        .keys(this.song)
        .every(key => {
          // if (key !== 'tab') {
          return this.song[key]
          // }
        })
      if (!areAllFieldsFilledIn) {
        this.error = 'Please fill in all the required fields.'
        return
      }
      try {
        this.song.createdUserId = this.user.id
        this.song.updatedUserId = this.user.id
        await SongsService.post(this.song)
        this.$router.push({
          name: 'music-list'
        })
      } catch (err) {
        alert(err)
      }
    },
    async save () {
      this.error = null
      // const areAllFieldsFilledIn = Object
      //   .keys(this.song)
      //   .every(key => !!this.song[key])
      // if (!areAllFieldsFilledIn) {
      //   this.error = areAllFieldsFilledIn + 'Please fill in all the required fields..'
      //   return
      // }
      const songId = this.song.id
      //
      try {
        const text = this.song.lyrics
        this.song.tab = (await FuriganaService.post(text)).data.result.furigana

        this.song.createdUserId = this.song.createdUserId ? this.song.createdUserId : this.user.id
        this.song.updatedUserId = this.user.id
        await SongsService.put(this.song)
        this.$router.push({
          name: 'music-detail',
          params: {
            songId: songId
          }
        })
      } catch (err) {
        alert(err)
      }
    },
    async convert () {
      try {
        const text = this.song.lyrics
        this.song.tab = (await FuriganaService.post(text)).data.result.furigana
      } catch (err) {
        alert(err)
      }
    },
    async search () {
      const songId = this.$route.params.songId
      this.song = (await SongsService.show(songId)).data
      this.artistSongs = (await SongsService.songByArtist(this.song.artist, 10,0)).data;        
      this.images = (await SongsService.searchImage(`${this.song.artist} ${this.song.title}`)).data;        
      if (this.isUserLoggedIn) {
        // SongHistoryService.post({
        //   songId: songId
        // })
      }
    }
  },
  async mounted () {
    const newSong = this.$route.params.newSong
    if(newSong){
      this.newMusic()
    } else{
      this.search()  
    }
    
  },
  watch: {
    '$route' () {
      this.search()
      this.$refs.randomMusic.search();
    }
  },
}
</script>
<style>
.furigana{
  line-height:2em;
  font-size:1.2em;
  white-space: pre-line;
}
.furigana rt{
  color:red;
  font-size:0.6em;
}
</style>