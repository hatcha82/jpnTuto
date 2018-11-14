<template>
<div class="">
  <v-layout row>
    <v-flex xs8 md8 lg8>
        <v-select 
          @change="voiceChange"
          v-model="selectedVoice"             
          :items="voiceList"
          item-text="name"
          item-value="name"
          label="Voice"
          persistent-hint
          return-object
          single-line          
        ></v-select>
    </v-flex>
    <v-flex class="pt-4" xs1 md1 lg1>
      <transition name="fade" v-if="isLoading">  
        <v-btn @click="stop"  color="primary">
          <scale-loader :loading="isLoading" :size="loadingSize" :color="this.$vuetify.theme.accent"></scale-loader>
        </v-btn> 
        <!-- <pulse-loader :loading="isLoading" :color="color" :size="size"></pulse-loader> -->
      </transition>
      <transition name="fade" v-if="!isLoading">
        <v-btn @click="play" color="primary"  >
            <v-icon v-if="!isLoading">fas fa-volume-up </v-icon>
            <v-icon v-if="isLoading">fas fa-headphones-alt</v-icon>
          </v-btn>    
        <div id="page-wrapper">       
            <v-layout row justify-center >
              <v-flex xs12>
                <v-select 
                  @change="voiceChange"
                  v-model="selectedVoice"             
                  :items="voiceList"
                  item-text="name"
                  item-value="name"
                  label="Voice"
                  persistent-hint
                  return-object
                  single-line
                ></v-select>
              </v-flex>
              <v-flex xs6 style="">
                <v-slider min="0" max="10" step="1" v-model="volume" label="Volume"></v-slider>
              </v-flex>
              <v-flex xs6 style="">
                <v-slider min="0" max="10" step="1" v-model="rate" label="Rate"></v-slider>
              </v-flex>           
              <v-flex xs4>
                <v-slider min="0" max="10" step="1" thumb-label="always" v-model="pitch" label="Pitch"></v-slider>
              </v-flex>           
            </v-layout>        
          <v-btn @click="play"><v-icon >play_arrow</v-icon></v-btn>
          <v-btn @click="pause"><v-icon >pause</v-icon></v-btn>      
          <v-btn @click="reset"><v-icon ></v-icon>Reset</v-btn>    
        </div>
      </transition>
    </v-flex>
  </v-layout>

  

</div>  
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
export default {
  props: [
    'text'
  ],
  data () {
    return {
      select: null,
      isLoading: false,
      loadingSize : '20px',
      name: '',
      selectedVoice: null,
      rate: 5,
      volume: 5,
      pitch: 5,
      synth: window.speechSynthesis,
      voiceList: window.speechSynthesis.getVoices()  ,
      greetingSpeech: new window.SpeechSynthesisUtterance()
    }
  },

  components: {
    PulseLoader,
    ScaleLoader
  },
  mounted () {
    // wait for voices to load
    // I can't get FF to work without calling this first
    // Chrome works on the onvoiceschanged function   
    setTimeout(() => {
        this.isLoading = false
        this.voiceList = this.synth.getVoices().filter(function (obj) {
            if (obj.lang === 'ja-JP') return true
        })
        this.selectedVoice = this.voiceList[0]
    }, 2000)
    if (this.voiceList.length) {
      this.isLoading = false
    }
    this.synth.onvoiceschanged = () => {
      this.synth.cancel()
      // give a bit of delay to show loading screen
      // just for the sake of it, I suppose. Not the best reason
      
    }
    this.listenForSpeechEvents()
  },
  methods: {
    /**
     * React to speech events
     */
    listenForSpeechEvents () {
      this.greetingSpeech.onstart = () => {
       this.isLoading = true
      }
      this.greetingSpeech.onend = () => {
       this.isLoading = false
      }
    },
    /**
     * Shout at the user
     */
    voiceChange () {
    },
    play () {
      // it should be 'craic', but it doesn't sound right      
      this.synth.cancel()      
      if (this.synth.paused) {
        this.synth.resume()
      } else {
        this.greetingSpeech.text = this.text
        this.greetingSpeech.rate = this.rate / 5
        this.greetingSpeech.volume = this.volume / 5
        this.greetingSpeech.pitch = this.pitch / 5
        this.greetingSpeech.voice = this.selectedVoice
        this.synth.speak(this.greetingSpeech)
      }
    },
    pause () {
      this.synth.pause()
    },
    stop () {
      this.synth.cancel()
    },
    reset () {
      this.rate = 5
      this.volume = 5
      this.pitch = 5
    },
    langChange () {
      this.synth.cancel()
    }
  }
}
</script>

<style scope>
#page-wrapper{
  border-radius: 10px
}
</style>
