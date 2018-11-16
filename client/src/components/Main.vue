<template>
<div class="pt-0">
    <section>
      <v-parallax :src="require('../assets/bg/bg002.jpg')" height="400">
        <v-layout
          column
          align-center
          justify-center
          class="white--text"
        >
          <img src="../assets/logoBlue.jpg" alt="Vuetify.js" height="150" style="border-radius:100px">
          <h1 class="white--text mb-2 display-1 text-xs-center font-weight-black">FuRigana Hub</h1>
          <div class="subheading mb-3 text-xs-center " >일본어를 쉽게 읽어 봅시다.</div>
          <router-link to="/login">
          <v-btn
            class="blue lighten-2 mt-5"
            dark
            large
            v-if="!isUserLoggedIn"
          >
            시작하기
          </v-btn>
          </router-link>
        </v-layout>
      </v-parallax>
    </section>

    <section>
      <v-layout
        column
        wrap
        class="my-5"
        align-center
      >
        <v-flex xs12 sm4 class="my-3">
          <div class="text-xs-center">
            <h2 class="headline">히라가나는 읽을 줄 아는데..<br>한자가 어렵다면.. </h2>
            <span class="subheading">
              후리가나를 보면서 계속 읽어보세요.
            </span>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-container grid-list-lg>
            <v-layout row wrap align-center>
               <!-- <v-flex xs12 md6>
                
              </v-flex> -->
              <v-flex xs12 md6>
                <router-link to="/music/list" style="text-decoration:none">
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <v-icon x-large class="blue--text text--lighten-2">fas fa-music</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">J-pop<br>후리가나 가사</div>
                  </v-card-title>
                  <v-card-text>
                    80년도에서 최신 J-pop 7000여곡의 노래를 후리가나를 읽으면서 일본어를 배울 수있습니다. 후리가나, 원곡가사, 번역 그리고 관련 유튜브 동영상을 보면서 노래와 일본어 읽기를 시작하세요.<br><br>
                  </v-card-text>
                </v-card>
                </router-link>
                <br>
                <h1>추천 J-pop</h1>
                <RandomMusicList/> 
              </v-flex>
            
              <v-flex xs12 md6>
                <router-link to="/article/list" style="text-decoration:none">
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <v-icon x-large class="blue--text text--lighten-2">far fa-newspaper</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline">일본 뉴스<br>후리가나</div>
                  </v-card-title>
                  <v-card-text>
                    <img class="newsIcon" src="https://s.yimg.jp/images/news/cobranding/nnn.png"/>
                    <img class="newsIcon" src="https://s.yimg.jp/images/news/cobranding/ann.png"/>
                    <img class="newsIcon" src="https://s.yimg.jp/images/news/cobranding/jnn.png"/>
                    <img class="newsIcon" src="https://s.yimg.jp/images/news/cobranding/fnn.png"/>
                    <br>
                    매일 1시간에 한번씩 업데이트 되는 일본의 4대 메인 뉴스인 일본 TV(NNN), 아사히(ANN), TBS(JNN), 후지 TV(FNN)의 기사를 후리가나와 함께 읽을 수 있습니다. 
                    <br>
                  </v-card-text>
                </v-card>
                </router-link>
                <br>
                <h1>최근 뉴스</h1>
                <RecentNews/>
              </v-flex>
            </v-layout>
            <v-layout row wrap align-center>
              
              <v-flex xs12 md12>
                <router-link to="/twitter/list/_FURIGANA" style="text-decoration:none">
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <v-icon x-large class="blue--text text--lighten-2">translate</v-icon>
                    <!-- <img :src="require('../assets/kanji-character.svg')" style="width:40px"/> -->
                    <!-- <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div> -->
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">매일 한자 후리가나</div>
                  </v-card-title>
                  <EveryDayKanji/>
                  <v-card-text>
                    JLPT모든 레벨(1 ~ 5)의 한자를 배울 수 있습니다. 그림과 획수 음독 훈독을 보면서 배워봅시다.<br><br>
                    <i>한국어 번역이 추가 될 예정입니다.</i><br><br>
                  </v-card-text>
                  
                </v-card>
                </router-link>
                
                
              </v-flex>
              <v-flex xs12 md12>
                <router-link to="/twitter/list" style="text-decoration:none">
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <v-icon x-large class="blue--text text--lighten-2">fab fa-twitter</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">일본 트위터<br>후리가나와</div>
                  </v-card-title>
                  <!-- <TwitterUsersList  :twitterId="user.twitterId"/> -->
                  <v-card-text>
                    좋아하는 일본 연예인 또는 친구의 트위터계정을 조회해보세요. 한자가 포함된 트윗을 후리가나로 보실 수 있습니다.<br><br>
                    <i>좋아하는 트윗 추가 기능이 추가 될 예정입니다.</i>
                  </v-card-text>
                </v-card>
                </router-link>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </section>
    <section>
      <v-parallax :src="require('../assets/bg/bg008.jpg')" height="380">
        <v-layout column align-center justify-center>
          <div class="headline white--text mb-3 text-xs-center parallax-dark">
            일본어 한자를 히라가나와 함께 읽으면서 배울 수 있습니다.
          </div>
          <em class="parallax-dark">Furigana Hub로 시작하세요.</em>
          <router-link to="/login">
          <v-btn
            class="blue lighten-2 mt-5"
            dark
            large
             v-if="!isUserLoggedIn"
          >
            시작하기
          </v-btn>
          </router-link>
        </v-layout>
      </v-parallax>
    </section>

    <section>
      <!-- <v-container grid-list-xl>
        <v-layout row wrap justify-center class="my-5">
          <v-flex xs12 sm4>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline">Company info</div>
              </v-card-title>
              <v-card-text>
                Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare. 
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
                Nullam in aliquet odio. Aliquam eu est vitae tellus bibendum tincidunt. Suspendisse potenti. 
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4 offset-sm1>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline">Contact us</div>
              </v-card-title>
              <v-card-text>
                Cras facilisis mi vitae nunc lobortis pharetra. Nulla volutpat tincidunt ornare.
              </v-card-text>
              <v-list class="transparent">
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">phone</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>777-867-5309</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">place</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Chicago, US</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">email</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>hatcha82@gmail.com</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container> -->
    </section>

    <!-- <v-footer class="blue darken-2">
      <v-layout row wrap align-center>
        <v-flex xs12>
          <div class="white--text ml-3">
            Made with
            <v-icon class="red--text">favorite</v-icon>
            by <a class="white--text" href="https://vuetifyjs.com" target="_blank">Vuetify</a>
            and <a class="white--text" href="https://github.com/vwxyzjn">Costa Huang</a>
          </div>
        </v-flex>
      </v-layout>
    </v-footer> -->
  </div>
</template>

<script>
import RandomMusicList from "@/components/music/RandomMusicList";
import RecentNews from "@/components/article/RecentNews";
import EveryDayKanji from "@/components/kanji/EveryDayKanji";
import TwitterUsersList from "@/components/twitter/TwitterUsersList";
import { mapState } from "vuex";

export default {
  components: {
    RandomMusicList,
    RecentNews,
    EveryDayKanji,
    TwitterUsersList
  },
  computed: {
    ...mapState(["isUserLoggedIn", "user"])
  },
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.newsIcon {
  width: 40px;
}
.parallax-dark {
  background: #222;
  opacity: 0.7;
  padding: 10px;
  border-radius: 5px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
