<template>
<!-- <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="00"> -->
<div>
    
<v-list>
    <v-list-tile v-for="item in twitters.users" :key="item.id" avatar @click="linkTo({linkTo:'twitter-list-search', params: { search : item.screen_name }} )">
    <v-list-tile-avatar>
        <img :src="item.profile_image_url" alt="">
    </v-list-tile-avatar>
    <v-list-tile-title v-text="item.name"></v-list-tile-title>
    </v-list-tile>
</v-list>
</div>
</template>
<script>
import { mapState } from "vuex";
import SongsService from "@/services/SongsService";
import TwitterService from "@/services/TwitterService";
import _ from "lodash";
import myVideo from "vue-video";
import "video.js/dist/video-js.css";
import Synthesis from "@/components/common/Synthesis";

import { videoPlayer } from "vue-video-player";

export default {
  components: {
    myVideo,
    videoPlayer,
    Synthesis
  },
  props: ["twitterId"],
  data() {
    return {
      searchKeyword: null,
      twitters: null,
      busy: false,
      count: 0,
      isLast: false,
      offset: null,
      twitterMsg: "트위터 계정을 입력하세요"
    };
  },
  computed: {
    ...mapState(["isUserLoggedIn", "user"])
  },
  watch: {
    "$route.params.search": function(search) {
      this.searchKeyword = search;
    },
    searchKeyword: _.debounce(async function(value) {
      // if(this.busy) return;
      // var serach = null
      // this.isLast = false
      // this.offset = null
      // if (!this.searchKeyword || this.searchKeyword === '') {
      //   serach = null
      // } else{
      //   serach = this.searchKeyword
      // }
      // this.search()
    }, 1000)
  },
  async mounted() {
    const search = this.twitterId;
    this.searchKeyword = search;
    this.search();
  },

  filters: {
    descritionURL(value, item) {
      item.entities.description.urls.forEach(function(obj) {
        value = value.replace(
          obj.url,
          `<a href="${obj.url}">${obj.display_url}</a>`
        );
      });
      return value;
    },
    async twiterLink(value, item) {
      var html = value;
      if (html) {
        if (item.entities.media) {
          item.entities.media.forEach(mediaEle => {
            html = html.replace(
              mediaEle.url,
              '<a target="_blank" href="' + mediaEle.url + '">Twitter</a>'
            );
          });
        }
        if (item.entities.urls) {
          item.entities.urls.forEach(urlEle => {
            html = html.replace(urlEle.url, "");
          });
        }
      }
      return html;
    },
    twiterOnlyText(value, item) {
      var html = value;
      if (html) {
        if (item.entities.media) {
          item.entities.media.forEach(mediaEle => {
            html = html.replace(mediaEle.url, "");
          });
        }
        if (item.entities.urls) {
          item.entities.urls.forEach(urlEle => {
            html = html.replace(urlEle.url, "");
          });
        }
      }
      return html;
    }
  },
  methods: {
    linkTo(item) {
      this.$router.push({
        name: item.linkTo,
        params: item.params
      });
    },
    isVideoContains(media) {},
    videoParam(media) {
      var sources = [];
      media.video_info.variants.forEach(variant => {
        var source = {
          src: variant.url,
          type: variant.url.content_type
        };
        sources.push(source);
      });

      return {
        // videojs options
        fluid: true,
        //aspectRatio: media.aspect_ratio[0] + ':' + media.aspect_ratio[1],
        muted: false,
        language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: sources,
        poster: media.media_url
      };
      // return {
      //           sources: sources,
      //           options: {
      //               autoplay: false,
      //               volume: 0.6,
      //               poster: media.media_url
      //           }
      //         }
    },
    addNewTwitter() {
      this.$router.push({
        name: "twitter-detail",
        params: { newTwitter: true }
      });
    },
    async search(isAppend) {
      var serach = null;
      this.busy = true;
      this.twitterMsg = "트위터 계정을 입력하세요";
      if (this.searchKeyword === "") {
        serach = null;
      } else {
        serach = this.searchKeyword;
      }
      try {
        var dataSet = [];

        dataSet = (await TwitterService.twitterUserList(serach, this.offset))
          .data;

        if (dataSet) {
          if (isAppend) {
            //var lastOffset = this.offset

            //dataSet =  this.$_.without(dataSet,{id_str : this.offset})
            var appendDataSet = [];
            for (var i = 0; i < dataSet.length; i++) {
              if (dataSet[i].id_str != this.offset) {
                appendDataSet.push(dataSet[i]);
                // console.log(dataSet[i].id_str)
              }
            }
            // console.log('afeter: ' ,dataSet.length)
            if (appendDataSet.length == 1) {
              this.isLast = true;
              this.twitters = appendDataSet;
            } else {
              this.twitters = this.twitters.concat(appendDataSet);
            }
            this.offset = appendDataSet.reverse()[0].id_str;
          } else {
            this.twitters = dataSet.length === 0 ? null : dataSet;
            this.offset = dataSet[dataSet.length].id_str;
            if (this.twitters.length == 1) {
              this.isLast = true;
            }
          }
          //this.offset = twit.id_str
          //  console.log('offset sett', this.offset)
        } else {
          this.twitterMsg = dataSet.message;
          this.twitters = null;
          this.offset = null;
          this.isLast = true;
        }
      } catch (error) {
        // console.log(error)
        // console.log(this.twitters)
      }
      this.busy = false;
    },
    async loadMore() {
      this.busy = true;
      if (!this.isLast) {
        this.search(true);
      } else {
        this.busy = false;
      }
    }
  }
};
</script>
<style>
p.user_status {
  white-space: pre-wrap;
  font-size: 1em;
}
</style>
