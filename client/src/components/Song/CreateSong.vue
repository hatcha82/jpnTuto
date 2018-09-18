<template>
  <v-layout>
    <v-flex xs4>
      <panel-padding title="Song Metadata">
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
      </panel-padding >
    </v-flex>

    <v-flex xs8>
      <panel-padding  title="Lyrics" class="ml-2">
        <v-text-field
          label="Lyrics"
          multi-line
          required
          :rules="[required]"
          v-model="song.lyrics"
        ></v-text-field>
        <v-text-field
          label="Furigana"
          multi-line
          v-model="song.tab"
        ></v-text-field>
      </panel-padding>

      <div class="danger-alert" v-if="error">
        {{error}}
      </div>
      <v-btn dark class="appColorThema" @click="convert">Convert</v-btn>
      <v-btn
        dark
        class="appColorThema"
        @click="create">
        Create Song
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import SongsService from '@/services/SongsService'
import FuriganaService from '@/services/FuriganaService'
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  data () {
    return {
      song: {
        title: null,
        artist: null,
        genre: 'J-pop',
        album: null,
        albumImageUrl: null,
        youtubeId: null,
        lyrics: null,
        tab: 'No Furigana translated'
      },
      error: null,
      required: (value) => !!value || 'Required.'
    }
  },
  methods: {
    async convert () {
      try {
        const text = this.song.lyrics
        this.song.tab = (await FuriganaService.post(text)).data.result.furigana
      } catch (err) {
        alert(err)
      }
    },
    async create () {
      this.error = null
      const areAllFieldsFilledIn = Object
        .keys(this.song)
        .every(key => {
          // if (key !== 'tab') {
          return this.song[key]
          // }
        })
      if (!areAllFieldsFilledIn) {
        this.error = 'Please fill in all the required fields.'
        return
      }
      try {
        this.song.createdUserId = this.user.id
        this.song.updatedUserId = this.user.id
        await SongsService.post(this.song)
        this.$router.push({
          name: 'songs'
        })
      } catch (err) {
        alert(err)
      }
    }
  }
}
</script>

<style scoped>
</style>
