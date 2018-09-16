<template>
  <v-layout>
    <v-flex xs4>
      <panel title="Article Metadata">
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
          label="New Image Url"
          required
          :rules="[required]"
          v-model="article.newsImageUrl"
        ></v-text-field>
      </panel>
    </v-flex>

    <v-flex xs8>
      <panel title="Article Structure" class="ml-2">
        <v-text-field
          label="News"
          multi-line
          required
          :rules="[required]"
          v-model="article.article"
        ></v-text-field>
      </panel>
      <Furigana :article="article" class="ml-2 mt-2"/>
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
import ArticlesService from '@/services/ArticlesService'
import FuriganaService from '@/services/FuriganaService'
import Furigana from './ViewArticle/Furigana'
export default {
  components: {
    Furigana
  },
  data () {
    return {
      dialog: false,
      article: {
        title: null,
        type: null,
        newsImageUrl: null,
        article: null,
        furigana: null
      },
      error: null,
      required: (value) => !!value || 'Required.'
    }
  },
  methods: {
    async remove () {
      try {
        await ArticlesService.delete(this.article)
        this.$router.push({
          name: 'article'
        })
      } catch (err) {
        console.log(err)
      }
    },
    async save () {
      this.error = null
      const areAllFieldsFilledIn = Object
        .keys(this.article)
        .every(key => !!this.article[key])
      if (!areAllFieldsFilledIn) {
        this.error = 'Please fill in all the required fields..'
        return
      }
      const articleId = this.$store.state.route.params.articleId
      console.log('save id : ', this.article)
      try {
        await ArticlesService.put(this.article)
        this.$router.push({
          name: 'article',
          params: {
            articleId: articleId
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    async convert () {
      try {
        const text = this.article.article
        this.article.furigana = (await FuriganaService.post(text)).data.result.furigana
      } catch (err) {
        console.log(err)
        alert(err)
      }
    }
  },
  async mounted () {
    try {
      const articleId = this.$store.state.route.params.articleId
      this.article = (await ArticlesService.show(articleId)).data
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped>

</style>
