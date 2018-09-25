<template>
<div>
  <v-navigation-drawer
          v-model="drawer"
          app
          fixed
        >
    <!-- <v-list class="pa-1">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <img src="../assets/logo.png">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>Hatcha'S</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>     -->
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

<style>
#logoImag{height:35px}
</style>
