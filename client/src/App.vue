<template>
  <div id="app">
    <v-app id="layout">
    <page-header />
        <router-view></router-view>
    <!-- <v-content>
      <v-container fluid fill-height style="padding:0;padding-top:68px" > 
    
      </v-container>      
    </v-content> -->
    <v-footer app inset>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
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
</style>
