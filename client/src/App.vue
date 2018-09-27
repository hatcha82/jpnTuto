<template>
  <v-app id="ap">
  <page-header />
      <router-view></router-view>
  <!-- <v-content>
    <v-container fluid fill-height style="padding:0;padding-top:68px" > 
  
    </v-container>      
  </v-content> -->
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
  <v-footer app inset>
    <span class="white--text">&copy; 2017</span>
  </v-footer>
</v-app>
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
