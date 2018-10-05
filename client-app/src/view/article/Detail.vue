<template>
<div id="top">
<v-container fluid grid-list-md >
    <v-layout row wrap>
      <v-flex d-flex xs12 sm12 md12 >
      <v-card>
        <v-btn class="mt-3 ml-2" absolute @click="back()" fab  color="primary">
        &nbsp;&nbsp;<v-icon>arrow_back_ios</v-icon>
        </v-btn>
        <v-img
          class="white--text ml-5 mt-3"
          height="50px"
          :src="article.newsImageUrl" 
          contain
        >
        
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 align-start flexbox>
              </v-flex>
            </v-layout>
            
          </v-container>
          
        </v-img>
        
        <v-card-title>
          <div v-if="(!edit)" >
            <span  class="grey--text">{{article.artist}}</span><br>
            <span >Title : {{article.title}}</span><br>
            <span >Created : {{ article.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a")}} </span><br>
          </div>
          <div style="float:right">
          </div>
        </v-card-title>
        <v-card-actions>
          
          <div>
            <v-btn v-if="(isUserLoggedIn)" @click="newArticle" flat color="info">New</v-btn>
            <v-btn v-if="(edit)" @click="saveArticle" flat color="info">Save</v-btn>
          </div>          
          <div v-if="(isUserLoggedIn && user.id === article.createdUserId)" >
          
          <v-btn v-if="(!edit)" @click="editArticle" flat color="info">Edit</v-btn>
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
            <v-text-field
              label="Type"
              v-model="article.type"
            ></v-text-field>
            <v-text-field
              label="title"
              v-model="article.title"
            ></v-text-field>
            <v-text-field
              label="News Image URL"
              v-model="article.newsImageUrl"
            ></v-text-field>
            <v-text-field
              label="News Url"
              v-model="article.newsUrl"
            ></v-text-field>
            <v-textarea
                auto-grow
                v-if="(edit)" 
                label="News Article"
                v-model="article.article"
                hint="Hint text"
              ></v-textarea>
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
          key="0"
        class="white--text" >
        후리가나
        </v-tab>
        <v-tab          
          ripple
          key="1"
        class="white--text">
        원본
        </v-tab>
        <v-tab-item  >
          <v-card flat>
            <v-card-text>
              <div v-html="article.furigana" class="furigana">
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <div  v-html="article.article" class="furigana">
              </div>
            </v-card-text>  
          </v-card>
        </v-tab-item>
      </v-tabs>
      </v-card>
    </v-flex>
    <v-flex d-flex xs12 sm12 md6>
        <div>
        <v-card class="pa-2">
        <Synthesis :text="article.article" class="mt-3"/>
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
import ArticlesService from '@/services/ArticlesService'
import FuriganaService from '@/services/FuriganaService'
import Synthesis from '@/components/common/Synthesis'

export default {
  components: {
    Synthesis
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
      article: null,
      edit: false,
      activeTab: 0
    }
  }, 
  methods: {
    toTop () {
      $('#app').scrollTop(200);
    },
    back() {
      this.$router.back()
    },
    newArticle () {
      this.article = {}
      this.article.type = 'NEWS'
      this.article.newsImageUrl = 'https://s.yimg.jp/c/logo/f/2.0/news_r_34_2x.png'
      this.edit = true 
    },
    editArticle () {
       this.edit = true 
    },
    saveArticle () {
      
      if(this.article.id){
        this.save()  
      } else {
        this.create()
      }
     
      this.edit = false 
    },
    async remove () {
      try {
        await ArticlesService.delete(this.article)
        this.$router.push({
          name: 'article-list'
        })
      } catch (err) {
        alert(err)
      }
    },
    async create () {
      this.error = null
      const areAllFieldsFilledIn = Object
        .keys(this.article)
        .every(key => {
          // if (key !== 'tab') {
          return this.article[key]
          // }
        })
      if (!areAllFieldsFilledIn) {
        this.error = 'Please fill in all the required fields.'
        return
      }
      try {
        this.article.createdUserId = this.user.id
        this.article.updatedUserId = this.user.id
        await ArticlesService.post(this.article)
        this.$router.push({
          name: 'article-list'
        })
      } catch (err) {
        alert(err)
      }
    },
    async save () {
      this.error = null
      // const areAllFieldsFilledIn = Object
      //   .keys(this.article)
      //   .every(key => !!this.article[key])
      // if (!areAllFieldsFilledIn) {
      //   this.error = areAllFieldsFilledIn + 'Please fill in all the required fields..'
      //   return
      // }
      const articleId = this.article.id
      //
      try {
        const text = this.article.lyrics
        this.article.tab = (await FuriganaService.post(text)).data.result.furigana

        this.article.createdUserId = this.article.createdUserId ? this.article.createdUserId : this.user.id
        this.article.updatedUserId = this.user.id
        await ArticlesService.put(this.article)
        this.$router.push({
          name: 'music-detail',
          params: {
            articleId: articleId
          }
        })
      } catch (err) {
        alert(err)
      }
    },
    async convert () {
      try {
        const text = this.article.article
        this.article.furigana = (await FuriganaService.post(text)).data.result.furigana
      } catch (err) {
        alert(err)
      }
    },
    async search () {
      
      const articleId = this.$route.params.articleId
      this.article = (await ArticlesService.show(articleId)).data
      
      // if (this.isUserLoggedIn) {
      //   articleHistoryService.post({
      //     articleId: articleId
      //   })
      // }
    }
  },
  async mounted () {
    const newarticle = this.$route.params.newarticle
    if(newarticle){
      this.newArticle()
    } else{
      this.search()  
    }
    
  },
  watch: {
    '$route' (to, from) {
      this.search()
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