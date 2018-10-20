<template>
<div>
  <v-layout row wrap  justify-center>
    <template v-for="(item, index) in kanjis">
            <v-flex xs12 x12 sm12 lg2 md2 >
      <!-- <v-flex x12 sm12 lg12 md12> -->
        <v-card class="mb-2" height="100%">     
          <v-layout col wrap>     
            <v-flex xs6 sm6 lg12 md12>
            <v-img
              :lazy-src="item.strokeOrderGifUri ? item.strokeOrderGifUri : require('../../assets/noImage.png')"  
              :src="item.strokeOrderGifUri ? item.strokeOrderGifUri : require('../../assets/noImage.png')"
              contain
              />
            </v-flex>
            <v-flex xs6 sm6 lg12 md12>
            <v-card-title primary-title full-height>
                <div>
                    JLPT : {{item.grade}}<br>
                    音読 :  {{item.onyomi}}<br>
                    訓読 : {{item.kunyomi}}
                </div>
              </v-card-title>
              
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      </template>
    </v-layout>
  </div>     
</template>


//   <v-layout row>
    
//      <v-flex xs12 sm12 lg12 md12>
//        <template v-for="(item, index) in kanjis">
//       <v-card>
//         <v-list>
//         </v-list>
//         <v-container
//               fill-height
//               pa-2
//             >
//         <v-layout fill-height>
//           <v-flex xs12 align-end flexbox>
//             <span class="headline" v-text="item.grade"></span>
//           </v-flex>
//         </v-layout>
//       </v-container>
//         <v-img  :lazy-src="item.strokeOrderGifUri ? item.strokeOrderGifUri : require('../../assets/noImage.png')"
//                 :src="item.strokeOrderGifUri ? item.strokeOrderGifUri : require('../../assets/noImage.png')"
//                 aspect-ratio="1"
//                 class=""
//                 width="100px"
//                 contain
//                 >
        
//         </v-img>     
//         <v-card-title primary-title>
//             <div>
//               <div class="headline">{{item.onyomi}}</div>
//               <span class="grey--text">1,000 miles of wonder</span>
//             </div>
//           </v-card-title>   
//       </v-card>
//       </template>
//     </v-flex>
    
//   </v-layout>
// </template>
<script>
import {mapState} from 'vuex'
import KanjisService from '@/services/KanjisService'

export default {
  data () {
    return {
      kanjis: null,
    }
  },
    computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  async mounted () {
    try {
      var dataSet = (await KanjisService.randomKanjis()).data;
      this.kanjis = dataSet.data;
    } catch (error) {
      alert(error)
    }
  },
  methods: {
  }
}
</script>