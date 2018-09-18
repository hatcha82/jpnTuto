<template>  
  <div id="app">
    <v-app>
      <page-header />      
      <main>
        <v-parallax class="" dark src="https://www.jrailpass.com/blog/wp-content/uploads/2016/06/fukuoka-tower-1024x682.jpg"   height="300">
          <v-layout
            align-center
            column
            justify-center>
            <h1 class="display-2 font-weight-thin">Hatcha'S</h1>
            <h4 class="subheading">Lifelong Learning</h4>          
          </v-layout>
        </v-parallax>  
      <v-container fluid>
          <router-view></router-view>
      </v-container>
        <v-parallax class="" dark src="https://wallpaperstudio10.com/static/wpdb/wallpapers/1920x1080/172268.jpg"   height="300">
          <v-layout
            align-center
            column
            justify-center>
            <h1 class="display-2 font-weight-thin">Hatcha'S</h1>
            <h4 class="subheading">Lifelong Learning</h4>          
          </v-layout>
        </v-parallax>  
      </main>
    </v-app>
  </div>
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
