<template>
  <panel title="Music">
     <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>   
      <v-data-table
        :headers="headers"
        :search="search"
        :pagination.sync="pagination"
        :items="songs">
        <template slot="items" scope="props">
          <td><img class="album-image" :src="props.item.albumImageUrl" /></td>
          <td class="text-xs-left">{{ props.item.title }}</td>
          <td class="text-xs-left">{{ props.item.artist }}</td>
          <td class="text-xs-right">{{ props.item.updatedAt | moment("dddd, MMMM Do YYYY, h:mm:ss a")}}</td>
          <td class="text-xs-right">{{ props.item.createdAt | moment("dddd, MMMM Do YYYY, h:mm:ss a")}}</td>
          <td class="text-xs-right">
          <v-btn fab dark small class="appColorThema"
              :to="{
                name: 'song', 
                params: {
                  songId: props.item.id
                }
              }">
              View
            </v-btn>
          </td> 
        </template>
      </v-data-table>
    </v-card>
    <v-btn
      slot="action"
      :to="{
        name: 'songs-create'
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
import SongsService from '@/services/SongsService'

export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Album',
          value: 'album',
          align: 'center'
        },
        {
          text: 'Title',
          value: 'title',
          align: 'center'
        },
        {
          text: 'Artist',
          value: 'artist',
          align: 'center'
        },
        {
          text: 'Updated',
          value: 'updatedAt',
          align: 'center'
        },
        {
          text: 'Created',
          value: 'createdAt',
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
      songs: []
    }
  },
  watch: {
    '$route.query.search': {
      immediate: true,
      async handler (value) {
        this.songs = (await SongsService.index(value)).data
      }
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
  width:40px;
  float:left;
}
</style>
