<template>
<div>
  <v-navigation-drawer
          fixed
          v-model="drawer"
          app          
        >
    <v-list dense>
      <v-list-tile @click="linkTo('songs')">
        <v-list-tile-action>
          <v-icon>music_note</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>음악</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="linkTo('articles')">
        <v-list-tile-action>
          <v-icon>description</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>뉴스</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="linkTo('convertFurigana')">
        <v-list-tile-action>
          <v-icon>translate</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>변환</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar color="indigo"  fixed app>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title  @click="linkTo('songs')" ><img src="../assets/logo.png" id="logoImag"/></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-title  @click="linkTo('songs')" > 
      <v-btn icon>
      <v-icon>music_note</v-icon>
      </v-btn>
    </v-toolbar-title>
    <v-toolbar-title  @click="linkTo('articles')"> 
      <v-btn icon>
      <v-icon>description</v-icon>
      </v-btn>
      </v-toolbar-title>
    <v-toolbar-title  @click="linkTo('convertFurigana')">
      <v-btn icon>
       <v-icon>translate</v-icon>
      </v-btn>
    </v-toolbar-title>    
    <v-toolbar-title v-if="!$store.state.isUserLoggedIn"  class="mr-4"  @click="linkTo('login')">
       Login
    </v-toolbar-title>
    <v-toolbar-title v-if="$store.state.isUserLoggedIn"  class="mr-4"  @click="logout">
       Logout
    </v-toolbar-title>     
  </v-toolbar>
</div>
  <!-- <v-toolbar fixed>
    <v-toolbar-title class="mr-4">
      <router-link 
        tag="span"
        :to="{
          name: 'songs'
        }">
        <img src="../assets/logo.png" id="logoImag"/>
      </router-link>
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn 
        flat 
        dark
        :to="{
          name: 'songs'
        }">
        Music
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-items>
      <v-btn 
        flat 
        dark
        :to="{
          name: 'articles'
        }">
        Article
      </v-btn>
    </v-toolbar-items>   
    <v-toolbar-items>
      <v-btn 
        flat 
        dark
        :to="{
          name: 'convertFurigana'
        }">
        Furigana
      </v-btn>
    </v-toolbar-items>   
    <v-spacer></v-spacer>
    <v-toolbar-items> -->
      <!-- <songs-search-panel />       -->
      <!-- <v-btn 
        v-if="!$store.state.isUserLoggedIn"
        flat 
        dark
        :to="{
          name: 'login'
        }">
        Login
      </v-btn> -->
      
      <!-- <v-btn 
        v-if="!$store.state.isUserLoggedIn"
        flat 
        dark
        :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn> -->
      
      <!-- <v-btn 
        v-if="$store.state.isUserLoggedIn"
        flat 
        dark
        @click="logout">
        Log Out
      </v-btn>
    </v-toolbar-items>
  </v-toolbar> -->
</template>

<script>
// import SongsSearchPanel from './Songs/SongsSearchPanel'
export default {
  // components: {
  //   SongsSearchPanel
  // },
  data () {
    return {
      drawer: null
    }
  },
  methods: {
    linkTo (name) {
      this.$router.push({
        name: name
      })
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'songs'
      })
    }
  }
}
</script>

<style scoped>
#logoImag{height:35px}
</style>
