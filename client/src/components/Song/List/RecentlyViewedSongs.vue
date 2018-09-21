<template>
  <panel title="Recently Viewed Songs" >
    <v-data-table s
      :headers="headers"
      :pagination.sync="pagination"
      :items="histories">
      <template slot="items" scope="props">
        <router-link :to="{ name: 'song', params: {  songId: props.item.SongId}}" tag="tr">
        <td class="text-xs-left">
          <img class="album-image"         
           :src="props.item.albumImageUrl" /> 
        </td>      
        <td class="text-xs-left">
            [{{props.item.artist}}]<br>{{props.item.title}}   
        </td>        
        </router-link>
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
.album-image{
  width:50px;
  float:left;
  margin-right:5px;
  border-radius: 25px;
}
</style>