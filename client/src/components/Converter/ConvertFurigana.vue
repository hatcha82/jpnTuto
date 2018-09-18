<template>
<div>
  <div class="danger-alert" v-if="error">
    {{error}}
  </div>
   <v-layout row justify-end class="mb-3">
     <v-flex xs10>
     </v-flex>
     
  </v-layout>   
  <v-layout>
    <v-flex xs4>
      <panel title="Text" class="ml-2" >
        <v-text-field
          style="height:700px"
          label="Text"
          multi-line
          required
          :rules="[required]"
          v-model="userInput.text"
        ></v-text-field>       
      </panel>
    </v-flex>
     <v-flex xs6>
       <panel title="Furigana" class="ml-2" style="height:100%">
         <Furigana :contents="userInput" class="ml-2 mt-2"/>
       </panel>
    </v-flex>        
    <v-flex xs2>    
    <Synthesis :text="userInput.text" class="ml-2"/>    
    <v-flex xs12>
       <v-btn style="margin-top:14px" class="" @click="convert"><v-icon dark>translate</v-icon> Furigana</v-btn>                   
     </v-flex>  
    </v-flex>

  </v-layout>
 
</div>  
</template>
<script>
import FuriganaService from '@/services/FuriganaService'
import Furigana from '../globals/Furigana'
import Synthesis from '../globals/Synthesis'
export default {
  components: {
    Furigana,
    Synthesis
  },
  data () {
    return {
      dialog: false,
      userInput: {
        text: null,
        furigana: null
      },
      error: null,
      required: (value) => !!value || 'Required.'
    }
  },
  methods: {
    async convert () {
      try {
        const text = this.userInput.text
        this.userInput.furigana = (await FuriganaService.post(text)).data.result.furigana
      } catch (err) {
        console.log(err)
        alert(err)
      }
    }
  },
  async mounted () {
  }
}
</script>

<style scoped>

</style>
