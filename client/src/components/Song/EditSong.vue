<template>
  <v-layout>
    <v-flex xs4>
      <panel-padding  title="Song Metadata">
        <v-text-field
          label="Title"
          required
          :rules="[required]"
          v-model="song.title"
        ></v-text-field>

        <v-text-field
          label="Artist"
          required
          :rules="[required]"
          v-model="song.artist"
        ></v-text-field>

        <v-text-field
          label="Genre"
          required
          :rules="[required]"
          v-model="song.genre"
        ></v-text-field>

        <v-text-field
          label="Album"
          required
          :rules="[required]"
          v-model="song.album"
        ></v-text-field>

        <v-text-field
          label="Album Image Url"
          required
          :rules="[required]"
          v-model="song.albumImageUrl"
        ></v-text-field>

        <v-text-field
          label="YouTube ID"
          required
          :rules="[required]"
          v-model="song.youtubeId"
        ></v-text-field>
      </panel-padding>
    </v-flex>

    <v-flex xs8>
      <panel-padding title="Song Structure" class="ml-2">
        <v-text-field
          label="Lyrics"
          multi-line
          required
          :rules="[required]"
          v-model="song.lyrics"
        ></v-text-field>       
      </panel-padding>
      <Furigana :song="song" class="ml-2 mt-2"/>
      <div class="danger-alert" v-if="error">
        {{error}}
      </div>
      <v-layout row justify-center>
        <v-btn dark class="appColorThema" @click="convert">Convert</v-btn>
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-btn slot="activator" color="primary" dark>Delete</v-btn>
          <v-card>
            <v-card-title class="headline">Delete</v-card-title>
            <v-card-text>삭제하시겠습니까?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click.native="dialog = false">No</v-btn>
              <v-btn color="green darken-1" flat @click = "remove">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn dark class="appColorThema" @click="save">Save</v-btn>
      </v-layout>      
    </v-flex>
  </v-layout>
</template>

<script>
import SongsService from '@/services/SongsService'
import FuriganaService from '@/services/FuriganaService'
import Furigana from './ViewSong/Furigana'
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  components: {
    Furigana
  },
  data () {
    return {
      dialog: false,
      song: {
        title: null,
        artist: null,
        genre: null,
        album: null,
        albumImageUrl: null,
        youtubeId: null,
        lyrics: null,
        tab: null
      },
      error: null,
      required: (value) => !!value || 'Required.'
    }
  },
  methods: {
    async remove () {
      try {
        await SongsService.delete(this.song)
        this.$router.push({
          name: 'songs'
        })
      } catch (err) {
        alert(err)
      }
    },
    async save () {
      this.error = null
      // const areAllFieldsFilledIn = Object
      //   .keys(this.song)
      //   .every(key => !!this.song[key])
      // if (!areAllFieldsFilledIn) {
      //   this.error = areAllFieldsFilledIn + 'Please fill in all the required fields..'
      //   return
      // }
      const songId = this.$store.state.route.params.songId
      try {
        this.song.createdUserId = this.song.createdUserId ? this.song.createdUserId : this.user.id
        this.song.updatedUserId = this.user.id
        await SongsService.put(this.song)
        this.$router.push({
          name: 'song',
          params: {
            songId: songId
          }
        })
      } catch (err) {
        alert(err)
      }
    },
    async convert () {
      try {
        const text = this.song.lyrics
        this.song.tab = (await FuriganaService.post(text)).data.result.furigana
      } catch (err) {
        alert(err)
      }
    }
  },
  async mounted () {
    try {
      const songId = this.$store.state.route.params.songId
      this.song = (await SongsService.show(songId)).data
    } catch (err) {
      alert(err)
    }
  }
}
</script>

<style scoped>

</style>
