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
    <Footer/>
  </v-app>
</template>
<script>
  import Header from '@/components/common/Header.vue'
  import Footer from '@/components/common/Footer.vue'
  export default {
    name: 'app',
    components: {
      Header,
      Footer
    },
    head: {
      // To use "this" in the component, it is necessary to return the object through a function
      title: function () {
        return {
          inner: this.title,
          separator: '-',
          complement: 'Leaning Japanese'
        }
      },
      meta: [      
      ]
    },
    data: () => ({
      title: 'Furigana'
    }),
    props: {
      source: String
    }
    
  }
</script>