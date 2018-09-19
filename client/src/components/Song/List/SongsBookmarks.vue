<template>
  <panel title="Bookmarks">
    <v-data-table
      :headers="headers"
      :pagination.sync="pagination"
      :items="bookmarks">
      <template slot="items" scope="props">
        <router-link :to="{ name: 'song', params: {  songId: props.item.SongId}}" tag="tr">
        <td class="text-xs-left ">
          <img class="album-image"         
           :src="props.item.albumImageUrl" />
        </td>
        <td class="text-xs-left">
          [{{props.item.artist}}]<br>
          {{props.item.title}}   
        </td>
        <td class="text-xs-right">
          <v-btn
            fab dark 
            class="appColorThema">
            View
          </v-btn>
        </td>
        </router-link>  
      </template>
    </v-data-table>
  </panel>
</template>

<script>
import {mapState} from 'vuex'
import BookmarksService from '@/services/BookmarksService'

export default {
  data () {
    return {
      headers: [
        {
          text: 'Title',
          value: 'title',
          align: 'left'
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
      bookmarks: []
    }
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ])
  },
  async mounted () {
    if (this.isUserLoggedIn) {
      this.bookmarks = (await BookmarksService.index()).data
    }
  }
}
</script>

<style>
.bookMarkRow{
  line-height:40px;  
  padding-left:50px;
}
.album-image{
  width:40px;
  float:left;
}
</style>
