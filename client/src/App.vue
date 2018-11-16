<template>
  <v-app
    id="inspire"
  >
    <Header/>
    <v-content>
        
      <!-- <v-container fill-height> -->
         <router-view class=""></router-view>
         
        <!-- <v-layout>
          <v-flex shrink>
            <router-view></router-view>
          </v-flex>
        </v-layout> -->
      <!-- </v-container> -->
    </v-content>
    <v-btn class="" style="bottom:20px;left:20px" fixed absolute bottom  @click="back()" fab  color="primary">
    &nbsp;&nbsp;<v-icon>arrow_back_ios</v-icon>
    </v-btn>
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
    <Footer/>
  </v-app>
</template>
<script>
import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    Footer
  },
  head: {
    // To use "this" in the component, it is necessary to return the object through a function
    title: function() {
      return {
        inner: this.title,
        separator: "-",
        complement: "Learning Japanese"
      };
    },
    meta: []
  },
  data: () => ({
    title: "FuriganaHub"
  }),
  props: {
    source: String
  },
  methods: {
    back() {
      this.$router.back();
    }
  }
};
</script>
