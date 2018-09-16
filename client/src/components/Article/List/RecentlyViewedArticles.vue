<template>
  <panel title="Recently Viewed Songs">
    <v-data-table
      :headers="headers"
      :pagination.sync="pagination"
      :items="histories">
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
            class="appColorThema"
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
import SongHistoryService from '@/services/SongHistoryService'

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
          value: 'view',
          align: 'right'
        }
      ],
      pagination: {
        sortBy: 'createdAt',
        descending: true
      },
      histories: []
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
      this.histories = (await SongHistoryService.index()).data
    }
  }
}
</script>

<style>

</style>
