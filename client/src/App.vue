<template>
  <div id="app">
    <v-app id="inspire">
      <page-header />
      <v-content>
        <v-container fluid fill-height style="padding:0;padding-top:68px" >
          <router-view></router-view>
        </v-container>
      </v-content>
      <v-footer color="indigo" app inset>
        <span class="white--text">&copy; 2017</span>
      </v-footer>
    </v-app>
  </div>
  <!-- <div id="app">
    <v-app>
      <page-header />
      <main>
        <v-parallax :title=" '이미지 출처 [Image Source] : \n' + 'https://www.jrailpass.com/blog/wp-content/uploads/2016/06/fukuoka-tower-1024x682.jpg'" class="" dark src="https://www.jrailpass.com/blog/wp-content/uploads/2016/06/fukuoka-tower-1024x682.jpg"   height="300">
          <v-layout align-center justify-end>
            <h1 class="display-2">Hatcha'S</h1>
            <h4 class="subheading">Lifelong Learning</h4>       
          </v-layout>
        </v-parallax>  
      <v-container fluid>
          <router-view></router-view>
      </v-container>
        <v-parallax class="" :title=" '이미지 출처 [Image Source] : \n' + 'https://wallpaperstudio10.com/static/wpdb/wallpapers/1920x1080/172268.jpg'"  src="https://wallpaperstudio10.com/static/wpdb/wallpapers/1920x1080/172268.jpg"   height="300">
         <v-layout align-end justify-end>
            <h1 class="display-2 font-weight-thin">Hatcha'S</h1>
            <h4 class="subheading">Lifelong Learning</h4>          
          </v-layout>
        </v-parallax>  
      </main>
    </v-app>
  </div> -->
</template>

<script>
import PageHeader from '@/components/Header.vue'

export default {
  name: 'app',
  components: {
    PageHeader
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.danger-alert {
  color: red;
}
</style>
