<template>
  <panel title="Article">
     <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-card-title>   
      <v-data-table
        :headers="headers"
        :search="search"
        :pagination.sync="pagination"
        :rows-per-page-items="[30,50,100]"
        :items="articles">
        <template slot="items" scope="props">
          
          <tr> 
          <td>
            <router-link :to="{ name: 'article', params: {  articleId: props.item.id}}">
            <img class="album-image" :src="props.item.newsImageUrl" />
            </router-link>
          </td>
            
          <td class="text-xs-left">{{ props.item.title }}</td>         
          <td class="text-xs-right">{{ props.item.updatedAt | moment("dddd, MMMM Do YYYY, h:mm:ss a")}}</td>    
          <td class="text-xs-right">
          <v-btn fab dark small class="appColorThema"
              :to="{
                name: 'article', 
                params: {
                  articleId: props.item.id
                }
              }">
              View
            </v-btn>
          </td> 
          </tr>
          
        </template>
        
      </v-data-table>
    </v-card>
    <v-btn
      v-if="isUserLoggedIn"
      slot="action"
      :to="{
        name: 'articles-create'
      }"
      class="white"
      light
      small
      absolute
      right
      middle      
      fab>
      Add
    </v-btn>
  </panel>
</template>
<script>
import ArticlesService from '@/services/ArticlesService'

export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Site',
          value: 'site',
          align: 'center'
        },
        {
          text: 'Title',
          value: 'title',
          align: 'center'
        },
        {
          text: 'Updated',
          value: 'updatedAt',
          align: 'center'
        },
        {
          text: '',
          value: 'View',
          align: 'right'
        }
      ],
      pagination: {
        sortBy: 'createdAt',
        descending: true
      },
      articles: []
    }
  },
  watch: {
    '$route.query.search': {
      immediate: true,
      async handler (value) {
        this.articles = (await ArticlesService.index(value)).data
      }
    }
  },
  method: {
    linkToDetail (id) {
      this.$router.push({
        name: 'article',
        params: {
          articleId: id
        }
      })
    }
  }
}
</script>

<style scoped>
.song {
  padding: 20px;
  height: 180px;
  overflow: hidden;
}

.song-title {
  font-size: 30px;
  text-align:left;
  padding-left:25px;
}

.song-artist {
  font-size: 24px;
}

.song-genre {
  font-size: 18px;
}

.album-image{
  width:100px;
  float:left;
}
</style>
