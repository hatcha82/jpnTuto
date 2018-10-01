<template>
<div class="">
<transition name="fade" v-if="isLoading">
    <pulse-loader></pulse-loader>
  </transition>
  <transition name="fade" v-if="!isLoading">    
     <div id="page-wrapper">       
        <v-layout row justify-center >
          <v-flex xs12 style="display:none">
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
          <v-flex xs6 style="display:none">
            <v-slider min="0" max="10" step="1" v-model="volume" label="Volume"></v-slider>
          </v-flex>
          <v-flex xs6 style="display:none">
            <v-slider min="0" max="10" step="1" v-model="rate" label="Rate"></v-slider>
          </v-flex>           
          <!-- <v-flex xs4>
            <v-slider min="0" max="10" step="1" thumb-label="always" v-model="pitch" label="Pitch"></v-slider>
          </v-flex>            -->
        </v-layout>
      
      <v-btn @click="play"><v-icon >play_arrow</v-icon></v-btn>
      <v-btn @click="pause"><v-icon >pause</v-icon></v-btn>
      <v-btn @click="stop"><v-icon >stop</v-icon></v-btn> 
      <v-btn @click="reset"><v-icon ></v-icon>Reset</v-btn>    
    </div>
  </transition>
</div>  
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
export default {
  props: [
    'text'
  ],
  data () {
    return {
      select: {name: 'Microsoft Haruka Desktop - Japanese'},
      isLoading: false,
      name: '',
      selectedVoice: null,
      rate: 5,
      volume: 5,
      pitch: 5,
      synth: window.speechSynthesis,
      voiceList: [],
      greetingSpeech: new window.SpeechSynthesisUtterance()
    }
  },

  components: {
    PulseLoader
  },
  mounted () {
    // wait for voices to load
    // I can't get FF to work without calling this first
    // Chrome works on the onvoiceschanged function
    this.voiceList = this.synth.getVoices().filter(function (obj) {
      if (obj.lang === 'ja-JP') return true
    })
    this.selectedVoice = this.voiceList[0]
    if (this.voiceList.length) {
      this.isLoading = false
    }
    this.synth.onvoiceschanged = () => {
      this.voiceList = this.synth.getVoices().filter(function (obj) {
        if (obj.lang === 'ja-JP') return true
      })
      this.selectedVoice = this.voiceList[0]
      this.synth.cancel()
      // give a bit of delay to show loading screen
      // just for the sake of it, I suppose. Not the best reason
      setTimeout(() => {
        this.isLoading = false
      }, 800)
    }
    this.listenForSpeechEvents()
  },
  methods: {
    /**
     * React to speech events
     */
    listenForSpeechEvents () {
      this.greetingSpeech.onstart = () => {
       // this.isLoading = true
      }
      this.greetingSpeech.onend = () => {
       // this.isLoading = false
      }
    },
    /**
     * Shout at the user
     */
    voiceChange () {
    },
    play () {
      // it should be 'craic', but it doesn't sound right
      
      this.voiceList = this.synth.getVoices().filter(function (obj) {
        if (obj.lang === 'ja-JP') return true
      })
      this.selectedVoice = this.voiceList[0]
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
