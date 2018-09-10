<template>
  <panel title="Bookmarks">
    <v-data-table
      :headers="headers"
      :pagination.sync="pagination"
      :items="bookmarks">
      <template slot="items" scope="props">
        <td class="text-xs-left ">
            <img class="album-image"         
           :src="props.item.albumImageUrl" />
          <div class="bookMarkRow">
            {{props.item.title}}   
          </div>   
                  
        </td>
        <td class="text-xs-left">
          {{props.item.artist}}
        </td>
        <td class="text-xs-right">
          <v-btn
            fab dark small
            class="cyan"
            :to="{
              name: 'song', 
              params: {
                songId: props.item.SongId
              }
            }">
            View
          </v-btn>
        </td>  
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
          text: 'Artist',
          value: 'artist',
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
