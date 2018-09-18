<template>
  <v-layout>
    <v-flex xs4>
      <panel-padding title="Article Metadata">
        <v-text-field
          label="Title"
          required
          :rules="[required]"
          v-model="article.title"
        ></v-text-field>
        <v-text-field
          label="Type"
          required
          :rules="[required]"
          v-model="article.type"
        ></v-text-field>        
        <v-text-field
          label="News URL"
          required
          :rules="[required]"
          v-model="article.newsUrl"
        ></v-text-field>
        <v-text-field
          label="News Image URL"
          required
          :rules="[required]"
          v-model="article.newsImageUrl"
        ></v-text-field>
      </panel-padding>
    </v-flex>

    <v-flex xs8>
      <panel-padding title="Article Structure" class="ml-2">
        <v-text-field
          label="News"
          multi-line
          required
          :rules="[required]"
          v-model="article.article"
        ></v-text-field>
        <v-text-field
          label="Furigana"
          multi-line
          v-model="article.furigana"
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
        Create Article
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import ArticlesService from '@/services/ArticlesService'
import FuriganaService from '@/services/FuriganaService'
export default {
  data () {
    return {
      article: {
        title: null,
        type: 'NEWS',
        newsImageUrl: 'https://s.yimg.jp/c/logo/f/2.0/news_r_34_2x.png',
        newsUrl: null,
        article: null,
        furigana: null
      },
      error: null,
      required: (value) => !!value || 'Required.'
    }
  },
  methods: {
    async convert () {
      try {
        const text = this.article.article
        this.article.furigana = (await FuriganaService.post(text)).data.result.furigana
      } catch (err) {
        console.log(err)
        alert(err)
      }
    },
    async create () {
      // this.error = null
      // const areAllFieldsFilledIn = Object
      //   .keys(this.article)
      //   .every(key => {
      //     if (key !== 'tab') {
      //       return !!this.article[key]
      //     }
      //   })
      // if (!areAllFieldsFilledIn) {
      //   this.error = 'Please fill in all the required fields.'
      //   return
      // }

      try {
        await ArticlesService.post(this.article)
        this.$router.push({
          name: 'articles'
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
