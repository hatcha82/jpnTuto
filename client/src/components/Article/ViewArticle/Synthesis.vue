<template>
<div id="app">
<transition name="fade" v-if="isLoading">
    <pulse-loader></pulse-loader>
  </transition>
  <transition name="fade" v-if="!isLoading">
    <div class="form-container">
      
      <form @submit.prevent="play">        
        <!-- <div class="" style="text-align:left;padding:5px;padding-top:0;">발음 듣기</div> -->
        <v-btn @click="play"><v-icon dark>play_arrow</v-icon></v-btn>
        <v-btn @click="pause"><v-icon dark>pause</v-icon></v-btn>
        <v-btn @click="stop"><v-icon dark>stop</v-icon></v-btn>        
        <div class="form-group" v-if="voiceList.length">          
          <select class="form-control" style="" id="voices" v-model="selectedVoice" @change="langChange">
            <template v-for="(voice, index) in voiceList">              
            <option :data-lang="voice.lang" :value="index">{{ voice.name }}</option>
            </template>
          </select>
        </div>
        
      </form>
    </div>
  </transition>
</div>  
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
export default {
  props: [
    'article'
  ],
  data () {
    return {
      select: {name: 'Microsoft Haruka Desktop - Japanese'},
      isLoading: false,
      name: '',
      selectedVoice: 1,
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
    this.voiceList = this.synth.getVoices()
    console.log(this.voiceList)
    if (this.voiceList.length) {
      this.isLoading = false
    }
    this.synth.onvoiceschanged = () => {
      this.voiceList = this.synth.getVoices()
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
    play () {
      // it should be 'craic', but it doesn't sound right
      if (this.synth.paused) {
        this.synth.resume()
      } else {
        this.synth.cancel()
        this.greetingSpeech.text = this.article.article
        this.greetingSpeech.voice = this.voiceList[this.selectedVoice]
        this.synth.speak(this.greetingSpeech)
      }
    },
    pause () {
      this.synth.pause()
    },
    stop () {
      this.synth.cancel()
    },
    langChange () {
      this.synth.cancel()
    }
  }
}
</script>

<style scope>
.form-container {
  min-width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

form {
  /* padding: 20px; */
  max-width: 600px;  
  /* background: #fff;
  border-radius: 3px;
  box-shadow: 0 10px 30px 10px rgba(0, 0, 0, 0.1); */
}
form select{
  border:1px solid #ddd;
  padding: 5px;  
  line-height: 30px;
  font-size:13px;
}
.v-spinner {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity ease .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.btn-success {
  background: #43C6AC;
  border-color: #43C6AC;
  cursor: pointer;
}

h1 {
  margin-bottom: 25px;
}

</style>
