<template>
<!-- <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="00"> -->
<div>
  <v-btn 
    v-if="isUserLoggedIn"
    class="mb-5 mr-2"
    absolute
    bottom
    right
    fixed
    fab
    @click="addNewTwitter()"
    color="primary">
    <v-icon>add</v-icon>
  </v-btn>
   <v-layout row>   
     <v-flex pa-3 pb-0>
        <v-text-field
          fixed
          label="Twitter ID"
          append-icon="search"
          placeholder="Search"
          v-model="searchKeyword"
          :hint="twitterMsg"
        ></v-text-field>
     </v-flex>
     
   </v-layout>
   <v-progress-linear  :indeterminate="busy"></v-progress-linear>    
   <!-- <v-layout  align-center justify-center column fill-height>
     <v-flex pb-2>
      
     <v-progress-circular
        :size="50"
        v-if="busy"
        color="primary"
        indeterminate
        class="mb-3"
      ></v-progress-circular >
     </v-flex>
   </v-layout> -->
   
  <v-layout column v-if="twitters">
      <v-flex xs12 sm12 lg12 md12 v-if="!twitters && searchKeyword !== '' ">
        트윗이 없습니다.
      </v-flex>
      <v-flex xs12 sm12 lg12 md12>
        <template v-for="(item, index) in twitters.users">
        <v-layout row>
          <v-flex xs12 sm12 md12 lg12 @click="linkTo({linkTo:'twitter-list-search', params: { search : item.screen_name }} )">
          <v-card class="">
            <v-list>
              
              <v-list-tile>
                <v-list-tile-avatar>
                  <img :src="item.profile_image_url">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title v-html="item.name"></v-list-tile-title>
                  <v-list-tile-sub-title > @{{item.screen_name}}</v-list-tile-sub-title>
                </v-list-tile-content>
                            
              </v-list-tile>
              
            </v-list>

            <!-- <v-card-actions>
              <v-btn flat color="orange">Share</v-btn>
              <v-btn flat color="orange">Explore</v-btn>
            </v-card-actions> -->
          </v-card>
          </v-flex>
        </v-layout>          
        </template>
      </v-flex> 
  </v-layout>
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
var testObj = {
  users: [
    {
      id: 1045274717471486000,
      id_str: "1045274717471485953",
      name: "FuRIGANA",
      screen_name: "_FuRIGANA",
      location: "Seoul, Republic of Korea",
      description: "Furignana는 한자 또는 일본어에 후리가나를 같이 표현합니다.",
      url: "https://t.co/4Pw8Uf2bXd",
      entities: {
        url: {
          urls: [
            {
              url: "https://t.co/4Pw8Uf2bXd",
              expanded_url: "http://www.furiganahub.com",
              display_url: "furiganahub.com",
              indices: [0, 23]
            }
          ]
        },
        description: {
          urls: []
        }
      },
      protected: false,
      followers_count: 3,
      friends_count: 1,
      listed_count: 0,
      created_at: "Thu Sep 27 11:31:27 +0000 2018",
      favourites_count: 4,
      utc_offset: null,
      time_zone: null,
      geo_enabled: false,
      verified: false,
      statuses_count: 430,
      lang: "en",
      status: {
        created_at: "Sun Oct 21 05:05:35 +0000 2018",
        id: 1053874917421117400,
        id_str: "1053874917421117440",
        full_text:
          "漢字 : 掛\nJLPT Levl :  N3\n音読 :  カイ,ケイ\n例) \n掛ける (かける)\n\n訓読 : か.ける,-か.ける,か.け,-か.け,-が.け,か.かる,-か.かる,-が.かる,か.かり,-が.かり,かかり,-がかり\n例) \n掛留 (ケイリュウ)\n\n意味: hang, suspend, depend, arrive at, tax, pour\n#Jisho https://t.co/kWZ1fpZiTK",
        truncated: false,
        display_text_range: [0, 187],
        entities: {
          hashtags: [
            {
              text: "Jisho",
              indices: [181, 187]
            }
          ],
          symbols: [],
          user_mentions: [],
          urls: [],
          media: [
            {
              id: 1053874914309038100,
              id_str: "1053874914309038080",
              indices: [188, 211],
              media_url:
                "http://pbs.twimg.com/tweet_video_thumb/DqAdpqEV4AAGDDJ.jpg",
              media_url_https:
                "https://pbs.twimg.com/tweet_video_thumb/DqAdpqEV4AAGDDJ.jpg",
              url: "https://t.co/kWZ1fpZiTK",
              display_url: "pic.twitter.com/kWZ1fpZiTK",
              expanded_url:
                "https://twitter.com/_FuRIGANA/status/1053874917421117440/photo/1",
              type: "photo",
              sizes: {
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                small: {
                  w: 150,
                  h: 150,
                  resize: "fit"
                },
                large: {
                  w: 150,
                  h: 150,
                  resize: "fit"
                },
                medium: {
                  w: 150,
                  h: 150,
                  resize: "fit"
                }
              }
            }
          ]
        },
        extended_entities: {
          media: [
            {
              id: 1053874914309038100,
              id_str: "1053874914309038080",
              indices: [188, 211],
              media_url:
                "http://pbs.twimg.com/tweet_video_thumb/DqAdpqEV4AAGDDJ.jpg",
              media_url_https:
                "https://pbs.twimg.com/tweet_video_thumb/DqAdpqEV4AAGDDJ.jpg",
              url: "https://t.co/kWZ1fpZiTK",
              display_url: "pic.twitter.com/kWZ1fpZiTK",
              expanded_url:
                "https://twitter.com/_FuRIGANA/status/1053874917421117440/photo/1",
              type: "animated_gif",
              sizes: {
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                small: {
                  w: 150,
                  h: 150,
                  resize: "fit"
                },
                large: {
                  w: 150,
                  h: 150,
                  resize: "fit"
                },
                medium: {
                  w: 150,
                  h: 150,
                  resize: "fit"
                }
              },
              video_info: {
                aspect_ratio: [1, 1],
                variants: [
                  {
                    bitrate: 0,
                    content_type: "video/mp4",
                    url:
                      "https://video.twimg.com/tweet_video/DqAdpqEV4AAGDDJ.mp4"
                  }
                ]
              }
            }
          ]
        },
        source:
          '<a href="https://omv.rateinquiry.co.kr" rel="nofollow">Furigana Kanji</a>',
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "ja"
      },
      contributors_enabled: false,
      is_translator: false,
      is_translation_enabled: false,
      profile_background_color: "000000",
      profile_background_image_url:
        "http://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_image_url_https:
        "https://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_tile: false,
      profile_image_url:
        "http://pbs.twimg.com/profile_images/1047315073054568448/jtSMUpCq_normal.jpg",
      profile_image_url_https:
        "https://pbs.twimg.com/profile_images/1047315073054568448/jtSMUpCq_normal.jpg",
      profile_banner_url:
        "https://pbs.twimg.com/profile_banners/1045274717471485953/1538548911",
      profile_link_color: "1B95E0",
      profile_sidebar_border_color: "000000",
      profile_sidebar_fill_color: "000000",
      profile_text_color: "000000",
      profile_use_background_image: false,
      has_extended_profile: true,
      default_profile: false,
      default_profile_image: false,
      following: true,
      live_following: false,
      follow_request_sent: false,
      notifications: false,
      muting: false,
      blocking: false,
      blocked_by: false,
      translator_type: "none"
    },
    {
      id: 3064002732,
      id_str: "3064002732",
      name: "박현수",
      screen_name: "phs0904",
      location: "",
      description: "박현수",
      url: null,
      entities: {
        description: {
          urls: []
        }
      },
      protected: false,
      followers_count: 7,
      friends_count: 126,
      listed_count: 0,
      created_at: "Fri Mar 06 05:30:00 +0000 2015",
      favourites_count: 0,
      utc_offset: null,
      time_zone: null,
      geo_enabled: false,
      verified: false,
      statuses_count: 0,
      lang: "ko",
      contributors_enabled: false,
      is_translator: false,
      is_translation_enabled: false,
      profile_background_color: "C0DEED",
      profile_background_image_url:
        "http://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_image_url_https:
        "https://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_tile: false,
      profile_image_url:
        "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
      profile_image_url_https:
        "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
      profile_link_color: "1DA1F2",
      profile_sidebar_border_color: "C0DEED",
      profile_sidebar_fill_color: "DDEEF6",
      profile_text_color: "333333",
      profile_use_background_image: true,
      has_extended_profile: false,
      default_profile: true,
      default_profile_image: true,
      following: true,
      live_following: false,
      follow_request_sent: false,
      notifications: false,
      muting: false,
      blocking: false,
      blocked_by: false,
      translator_type: "none"
    },
    {
      id: 263526210,
      id_str: "263526210",
      name: "Sungkun Leo, OH",
      screen_name: "Itsyourz1",
      location: "Marabut, Samar, Philippines",
      description:
        "JTS Indonesia/ 녹색당/ 이슈털어주는 남자/ 다큐멘터리/ 브로콜리너마저/ 가을방학/ 에피톤 프로젝트/ 페이스북/ 소주 폭음과 폭풍수다/ 김광민/ 켄로치영화/ 종로/ 서초3동/ 분당/ 왕십리/ 서현고/ 한양대/ Civil Engineering/ 8사단 21연대 3대대 10중대",
      url: null,
      entities: {
        description: {
          urls: []
        }
      },
      protected: false,
      followers_count: 104,
      friends_count: 0,
      listed_count: 0,
      created_at: "Thu Mar 10 06:08:54 +0000 2011",
      favourites_count: 5,
      utc_offset: null,
      time_zone: null,
      geo_enabled: false,
      verified: false,
      statuses_count: 165,
      lang: "en",
      status: {
        created_at: "Mon Apr 21 00:49:19 +0000 2014",
        id: 458044774834913300,
        id_str: "458044774834913280",
        full_text:
          "RT @mediatodaynews: [바심마당] 안철수 새정치의 좌절\n- 미디어오늘 김성구 한신대 국제경제학과 교수·\n당안리대안정책발전소 소장 #미디어오늘 http://t.co/Ztgc7EfJDI",
        truncated: false,
        display_text_range: [0, 109],
        entities: {
          hashtags: [
            {
              text: "미디어오늘",
              indices: [80, 86]
            }
          ],
          symbols: [],
          user_mentions: [
            {
              screen_name: "mediatodaynews",
              name: "미디어오늘",
              id: 242753955,
              id_str: "242753955",
              indices: [3, 18]
            }
          ],
          urls: [
            {
              url: "http://t.co/Ztgc7EfJDI",
              expanded_url: "http://fb.me/2Eg2vbxB3",
              display_url: "fb.me/2Eg2vbxB3",
              indices: [87, 109]
            }
          ]
        },
        source:
          '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        retweeted_status: {
          created_at: "Mon Apr 21 00:24:01 +0000 2014",
          id: 458038409924456450,
          id_str: "458038409924456448",
          full_text:
            "[바심마당] 안철수 새정치의 좌절\n- 미디어오늘 김성구 한신대 국제경제학과 교수·\n당안리대안정책발전소 소장 #미디어오늘 http://t.co/Ztgc7EfJDI",
          truncated: false,
          display_text_range: [0, 89],
          entities: {
            hashtags: [
              {
                text: "미디어오늘",
                indices: [60, 66]
              }
            ],
            symbols: [],
            user_mentions: [],
            urls: [
              {
                url: "http://t.co/Ztgc7EfJDI",
                expanded_url: "http://fb.me/2Eg2vbxB3",
                display_url: "fb.me/2Eg2vbxB3",
                indices: [67, 89]
              }
            ]
          },
          source:
            '<a href="http://www.facebook.com/twitter" rel="nofollow">Facebook</a>',
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: null,
          in_reply_to_user_id_str: null,
          in_reply_to_screen_name: null,
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 8,
          favorite_count: 4,
          favorited: false,
          retweeted: false,
          possibly_sensitive: false,
          lang: "ko"
        },
        is_quote_status: false,
        retweet_count: 8,
        favorite_count: 0,
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "ko"
      },
      contributors_enabled: false,
      is_translator: false,
      is_translation_enabled: false,
      profile_background_color: "C0DEED",
      profile_background_image_url:
        "http://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_image_url_https:
        "https://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_tile: false,
      profile_image_url:
        "http://pbs.twimg.com/profile_images/1533164406/image_normal.jpg",
      profile_image_url_https:
        "https://pbs.twimg.com/profile_images/1533164406/image_normal.jpg",
      profile_link_color: "1DA1F2",
      profile_sidebar_border_color: "C0DEED",
      profile_sidebar_fill_color: "DDEEF6",
      profile_text_color: "333333",
      profile_use_background_image: true,
      has_extended_profile: false,
      default_profile: true,
      default_profile_image: false,
      following: true,
      live_following: false,
      follow_request_sent: false,
      notifications: false,
      muting: false,
      blocking: false,
      blocked_by: false,
      translator_type: "none"
    },
    {
      id: 125670977,
      id_str: "125670977",
      name: "58이야기",
      screen_name: "HS2B",
      location: "",
      description: "58이 사는 이야기",
      url: null,
      entities: {
        description: {
          urls: []
        }
      },
      protected: false,
      followers_count: 10,
      friends_count: 16,
      listed_count: 0,
      created_at: "Tue Mar 23 14:14:20 +0000 2010",
      favourites_count: 13,
      utc_offset: null,
      time_zone: null,
      geo_enabled: true,
      verified: false,
      statuses_count: 411,
      lang: "en",
      status: {
        created_at: "Sat Aug 12 06:38:40 +0000 2017",
        id: 896259622075457500,
        id_str: "896259622075457537",
        full_text:
          "“회장님 살아계실때부터…” 이건희 ICO위원 사퇴에 이재용 말실수 재조명 https://t.co/HMcdgovkJf",
        truncated: false,
        display_text_range: [0, 64],
        entities: {
          hashtags: [],
          symbols: [],
          user_mentions: [],
          urls: [
            {
              url: "https://t.co/HMcdgovkJf",
              expanded_url: "http://bit.ly/2hSwOgw",
              display_url: "bit.ly/2hSwOgw",
              indices: [41, 64]
            }
          ]
        },
        source:
          '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "ko"
      },
      contributors_enabled: false,
      is_translator: false,
      is_translation_enabled: false,
      profile_background_color: "C0DEED",
      profile_background_image_url:
        "http://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_image_url_https:
        "https://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_tile: false,
      profile_image_url:
        "http://pbs.twimg.com/profile_images/533061804990017536/5lt2uiAK_normal.jpeg",
      profile_image_url_https:
        "https://pbs.twimg.com/profile_images/533061804990017536/5lt2uiAK_normal.jpeg",
      profile_banner_url:
        "https://pbs.twimg.com/profile_banners/125670977/1398154378",
      profile_link_color: "1DA1F2",
      profile_sidebar_border_color: "C0DEED",
      profile_sidebar_fill_color: "DDEEF6",
      profile_text_color: "333333",
      profile_use_background_image: true,
      has_extended_profile: true,
      default_profile: true,
      default_profile_image: false,
      following: true,
      live_following: false,
      follow_request_sent: false,
      notifications: false,
      muting: false,
      blocking: false,
      blocked_by: false,
      translator_type: "none"
    },
    {
      id: 236858407,
      id_str: "236858407",
      name: "Caleb Cheng",
      screen_name: "gigihaoda",
      location: "",
      description: "",
      url: null,
      entities: {
        description: {
          urls: []
        }
      },
      protected: false,
      followers_count: 6,
      friends_count: 8,
      listed_count: 0,
      created_at: "Tue Jan 11 14:46:13 +0000 2011",
      favourites_count: 0,
      utc_offset: null,
      time_zone: null,
      geo_enabled: false,
      verified: false,
      statuses_count: 4,
      lang: "en",
      status: {
        created_at: "Wed Jul 24 03:14:54 +0000 2013",
        id: 359874300196569100,
        id_str: "359874300196569088",
        full_text:
          "@Doctor_Kal pub lunch with smart ppl http://t.co/yTw55YRQVW",
        truncated: false,
        display_text_range: [0, 59],
        entities: {
          hashtags: [],
          symbols: [],
          user_mentions: [
            {
              screen_name: "Doctor_Kal",
              name: "kalsingh",
              id: 752599376,
              id_str: "752599376",
              indices: [0, 11]
            }
          ],
          urls: [],
          media: [
            {
              id: 359874300204957700,
              id_str: "359874300204957696",
              indices: [37, 59],
              media_url: "http://pbs.twimg.com/media/BP6HxPOCQAAqjOb.jpg",
              media_url_https:
                "https://pbs.twimg.com/media/BP6HxPOCQAAqjOb.jpg",
              url: "http://t.co/yTw55YRQVW",
              display_url: "pic.twitter.com/yTw55YRQVW",
              expanded_url:
                "https://twitter.com/gigihaoda/status/359874300196569088/photo/1",
              type: "photo",
              sizes: {
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 1136,
                  h: 852,
                  resize: "fit"
                },
                medium: {
                  w: 1136,
                  h: 852,
                  resize: "fit"
                },
                small: {
                  w: 680,
                  h: 510,
                  resize: "fit"
                }
              }
            }
          ]
        },
        extended_entities: {
          media: [
            {
              id: 359874300204957700,
              id_str: "359874300204957696",
              indices: [37, 59],
              media_url: "http://pbs.twimg.com/media/BP6HxPOCQAAqjOb.jpg",
              media_url_https:
                "https://pbs.twimg.com/media/BP6HxPOCQAAqjOb.jpg",
              url: "http://t.co/yTw55YRQVW",
              display_url: "pic.twitter.com/yTw55YRQVW",
              expanded_url:
                "https://twitter.com/gigihaoda/status/359874300196569088/photo/1",
              type: "photo",
              sizes: {
                thumb: {
                  w: 150,
                  h: 150,
                  resize: "crop"
                },
                large: {
                  w: 1136,
                  h: 852,
                  resize: "fit"
                },
                medium: {
                  w: 1136,
                  h: 852,
                  resize: "fit"
                },
                small: {
                  w: 680,
                  h: 510,
                  resize: "fit"
                }
              }
            }
          ]
        },
        source:
          '<a href="http://www.apple.com" rel="nofollow">Photos on iOS</a>',
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: 752599376,
        in_reply_to_user_id_str: "752599376",
        in_reply_to_screen_name: "Doctor_Kal",
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        favorited: false,
        retweeted: false,
        possibly_sensitive: false,
        lang: "en"
      },
      contributors_enabled: false,
      is_translator: false,
      is_translation_enabled: false,
      profile_background_color: "C0DEED",
      profile_background_image_url:
        "http://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_image_url_https:
        "https://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_tile: false,
      profile_image_url:
        "http://pbs.twimg.com/profile_images/3251992102/9fb8c953e5d0cd6c0f192a6472fdfe41_normal.jpeg",
      profile_image_url_https:
        "https://pbs.twimg.com/profile_images/3251992102/9fb8c953e5d0cd6c0f192a6472fdfe41_normal.jpeg",
      profile_link_color: "1DA1F2",
      profile_sidebar_border_color: "C0DEED",
      profile_sidebar_fill_color: "DDEEF6",
      profile_text_color: "333333",
      profile_use_background_image: true,
      has_extended_profile: false,
      default_profile: true,
      default_profile_image: false,
      following: true,
      live_following: false,
      follow_request_sent: false,
      notifications: false,
      muting: false,
      blocking: false,
      blocked_by: false,
      translator_type: "none"
    },
    {
      id: 184798477,
      id_str: "184798477",
      name: "chihiro tazawa",
      screen_name: "Tiffanyimunida",
      location: "",
      description: "",
      url: null,
      entities: {
        description: {
          urls: []
        }
      },
      protected: false,
      followers_count: 24,
      friends_count: 9,
      listed_count: 0,
      created_at: "Mon Aug 30 14:25:06 +0000 2010",
      favourites_count: 0,
      utc_offset: null,
      time_zone: null,
      geo_enabled: false,
      verified: false,
      statuses_count: 20,
      lang: "en",
      status: {
        created_at: "Thu Sep 26 04:13:53 +0000 2013",
        id: 383081969338179600,
        id_str: "383081969338179584",
        full_text: "OMG so lonely.....",
        truncated: false,
        display_text_range: [0, 18],
        entities: {
          hashtags: [],
          symbols: [],
          user_mentions: [],
          urls: []
        },
        source:
          '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: null,
        in_reply_to_user_id_str: null,
        in_reply_to_screen_name: null,
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        favorited: false,
        retweeted: false,
        lang: "en"
      },
      contributors_enabled: false,
      is_translator: false,
      is_translation_enabled: false,
      profile_background_color: "C0DEED",
      profile_background_image_url:
        "http://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_image_url_https:
        "https://abs.twimg.com/images/themes/theme1/bg.png",
      profile_background_tile: false,
      profile_image_url:
        "http://pbs.twimg.com/profile_images/378800000313752495/dd5774a8df086137be472e3c5030a01e_normal.jpeg",
      profile_image_url_https:
        "https://pbs.twimg.com/profile_images/378800000313752495/dd5774a8df086137be472e3c5030a01e_normal.jpeg",
      profile_link_color: "1DA1F2",
      profile_sidebar_border_color: "C0DEED",
      profile_sidebar_fill_color: "DDEEF6",
      profile_text_color: "333333",
      profile_use_background_image: true,
      has_extended_profile: false,
      default_profile: true,
      default_profile_image: false,
      following: true,
      live_following: false,
      follow_request_sent: false,
      notifications: false,
      muting: false,
      blocking: false,
      blocked_by: false,
      translator_type: "none"
    }
  ],
  next_cursor: 0,
  next_cursor_str: "0",
  previous_cursor: 0,
  previous_cursor_str: "0",
  total_count: null
};

export default {
  components: {
    myVideo,
    videoPlayer,
    Synthesis
  },
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
    const search = this.$route.params.search;
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
        if (!serach) {
          // dataSet = testObj
          dataSet = (await TwitterService.twitterUserList(serach, this.offset))
            .data;
        }
        if (!dataSet.code) {
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
            this.offset = appendDataSet.reverse()[0].id_str;
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
