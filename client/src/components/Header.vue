<template>
  <v-toolbar fixed>
    <v-toolbar-title class="mr-4">
      <router-link 
        class="home"
        tag="span"
        :to="{
          name: 'home'
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
    <v-toolbar-items>
      <!-- <songs-search-panel />       -->
      <v-btn 
        v-if="!$store.state.isUserLoggedIn"
        flat 
        dark
        :to="{
          name: 'login'
        }">
        Login
      </v-btn>
      
      <!-- <v-btn 
        v-if="!$store.state.isUserLoggedIn"
        flat 
        dark
        :to="{
          name: 'register'
        }">
        Sign Up
      </v-btn> -->
      
      <v-btn 
        v-if="$store.state.isUserLoggedIn"
        flat 
        dark
        @click="logout">
        Log Out
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
// import SongsSearchPanel from './Songs/SongsSearchPanel'
export default {
  // components: {
  //   SongsSearchPanel
  // },
  methods: {
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
#logoImag{height:40px}
.home {
  cursor: pointer;
}

.home:hover {
  color: #E9E;
}
.appColorThema{
  background: red;
}
</style>
