<template>
<div>  
  <v-layout wrap>
    <template v-if="songs" v-for="(item) in songs">
      <v-flex x6 sm6 lg6 md6 :key="'artist' + '_' + item.id">
        <v-card >           
          <v-list>
              <router-link  :to="{ name: 'music-detail', params: {  songId: item.id}}" tag="div">
              <v-subheader
                v-if="item.header"
                :key="item.header"
              >
                {{ item.header }}
              </v-subheader>
              <v-list-tile
                v-else
                :key="item.title"
                avatar            
              >
                <v-list-tile-avatar>
                  <v-img
                   :lazy-src="item.albumImageUrl ? item.albumImageUrl : require('../../assets/noImage.png')"  
                    :src="item.albumImageUrl ? item.albumImageUrl : require('../../assets/noImage.png')"/> 
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title">
                  </v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.artist"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              </router-link>
          </v-list>
        </v-card>
      </v-flex>
      </template>
    </v-layout>
  </div>     
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["songs", "currentSong"],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["isUserLoggedIn", "user"])
  },
  watch: {},

  async mounted() {},
  filters: {
    imageInfo(item) {
      return `
Title: ${item.title}
Artist: ${item.artist}
Album: ${item.album}
Album Image Source:
${item.albumImageUrl}
      `;
    }
  },
  methods: {}
};
</script>
