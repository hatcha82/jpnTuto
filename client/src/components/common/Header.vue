<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.text" @click="linkTo(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
            {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-subheader v-if="user && user.twitterId" class="mt-3 grey--text text--darken-1">Twitter Friends</v-subheader>
        <!-- <TwitterUsersList  twitterId="hatcha82"/> -->
        <!-- <TwitterUsersList v-if="user && user.twitterId"  :twitterId="user.twitterId"/> -->
        <v-subheader v-if="user && (user.adminFlag == 'Y')" class="mt-3 grey--text text--darken-1">Admin</v-subheader>
        <v-list-tile v-if="user && (user.adminFlag == 'Y')" v-for="item in adminItems" :key="item.text" @click="linkTo(item)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
            {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- <v-list-tile class="mt-3" @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Browse Channels</v-list-tile-title>
        </v-list-tile> -->
        <!-- <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Manage Subscriptions</v-list-tile-title>
        </v-list-tile> -->
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      dense
      flat
      fixed
      clipped-left
      dark
      app
      color="primary"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <!-- <v-toolbar-title  @click="linkTo('home')" ></v-toolbar-title> -->
      <v-toolbar-title class="mr- align-center" @click="linkTo({linkTo:'Main'})">
        <router-link to="/Main">
        <img style="height:25px;margin-top:5px" src="../../assets/logoWhiteWide.svg"/>
        </router-link>
        <!-- <span class="title white--text">FuRIGana</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title  @click="linkTo({linkTo:'music-list'})" > 
        <v-btn icon>
        <v-icon>music_note</v-icon>
        </v-btn>        
      </v-toolbar-title>
      <v-toolbar-title  @click="linkTo({linkTo:'article-list'})"> 
        <v-btn icon>
        <v-icon>description</v-icon>
        </v-btn>
      </v-toolbar-title>
      <!-- <v-toolbar-title  @click="linkTo('convertFurigana')">
        <v-btn icon>
        <v-icon>translate</v-icon>
        </v-btn>
      </v-toolbar-title>     -->
      <v-toolbar-title v-if="!isUserLoggedIn"  class="mr-4"  @click="linkTo({linkTo:'login'})">
        <v-btn icon>
        <v-icon>fas fa-sign-in-alt</v-icon>
        </v-btn>
      </v-toolbar-title>
      <!-- <v-toolbar-title v-if="!$store.state.isUserLoggedIn"  class="mr-4"  @click="linkTo('register')">
        Sign Up
      </v-toolbar-title> -->
      <v-toolbar-title v-if="isUserLoggedIn"  class="mr-4"  @click="logout">
        <v-btn icon>
        <v-icon>fas fa-sign-out-alt</v-icon>
        </v-btn>
      </v-toolbar-title>
      <!-- <v-layout row align-center style="max-width: 650px">
        <v-text-field
          placeholder="Search..."
          single-line
          append-icon="search"
          color="white"
          hide-details
        ></v-text-field>
      </v-layout> -->
    </v-toolbar>
  </div>
  
</template>
<script>
  import SiteService from '@/services/SiteService'
  import AuthenticationService from '@/services/AuthenticationService'
  import TwitterUsersList from '@/components/twitter/TwitterUsersList'
  import {mapState} from 'vuex'
  // import Ipify from 'ipify'
  export default {
    components: {
    TwitterUsersList
  },
  async mounted (){   
      // var visitorRoute = window.location.pathname
      // var userAgent = window.clientInformation.userAgent
      // var userLanguage = window.clientInformation.userLanguage
      // var ip = 'NO_ACCESS'
      // try {
      //   ip = await Ipify()
      // } catch (error) {}

      // try {
      //   var visitor = {
      //     visitorIp: ip , 
      //     visitorRoute: visitorRoute,
      //     userAgent: userAgent,
      //     userLanguage: userLanguage
      //   }
      //   SiteService.visiterIncrease(visitor)
      // } catch (error) {}
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },   
  data: () => ({
      drawer: false,
      items: [
        // { icon: 'trending_up', text: 'Most Popular' },
        // { icon: 'subscriptions', text: 'Subscriptions' },
        { icon: 'fas fa-music', text: 'Music', linkTo: 'music-list', params:{}},
        { icon: 'far fa-newspaper', text: 'News', linkTo: 'article-list', params:{} },
        { icon: 'fab fa-twitter', text: 'Twitter', linkTo: 'twitter-list' , params:{}},
        // { icon: 'fab fa-twitter', text: 'Twitter User List', linkTo: 'twitter-userList' , params:{}},
        { icon: 'translate', text: 'Kanji', linkTo: 'twitter-list-search' , params:{search : '_FURIGANA'}},
        // { icon: 'history', text: 'History', linkTo: 'history' },
        // { icon: 'featured_play_list', text: 'Playlists' },
        // { icon: 'watch_later', text: 'Watch Later' }
      ],
      adminItems: [      
        { icon: 'fas fa-music', text: 'Music Image Tracker', linkTo: 'music-image-tracker-list', params:{}},                  
      ],
      items2: [
        { picture: 28, text: 'Joseph' },
        { picture: 38, text: 'Apple' },
        { picture: 48, text: 'Xbox Ahoy' },
        { picture: 58, text: 'Nokia' },
        { picture: 78, text: 'MKBHD' }
      ]
    }),
    props: {
      source: String
    },
    methods: {
      linkTo (item) {
        this.$router.push({
          name: item.linkTo,
          params: item.params
        })
      },
      async logout () {
        try {
          const response = await AuthenticationService.logout({})
          if(response.data.logout === 'ok'){
            this.$store.dispatch('setToken', null)
            this.$store.dispatch('setUser', null)
            this.$router.push({
              name: 'Main'
            })
          }
        } catch (error) {
          // this.error = error.response.data.error
        }
      }
    }
  }
</script>
