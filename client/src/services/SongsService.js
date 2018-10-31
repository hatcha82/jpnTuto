import Api from '@/services/Api'

export default {
  index (search,offset) {
    return Api().get('songs', {
      params: {
        search: search,
        offset: offset
      }
    })
  },
  searchImage (keyword,offset) {
    return Api().get('image/search', {
      params: {
        keyword: keyword,
        offset: offset
      }
    })
  },
  indexImageTracker (search,offset) {
    return Api().get('songs/indexImageTracker', {
      params: {
        search: search,
        offset: offset
      }
    })
  },
  randomFiveSong () {
    return Api().get('songs/randomeSong', {
      params: {
      }
    })
  },
  show (songId) {
    return Api().get(`song/${songId}`)
  },
  post (song) {
    return Api().post('song', song)
  },
  put (song) {
    return Api().put(`song/${song.id}`, song)
  },
  delete (song) {
    return Api().delete(`song/${song.id}`, song)
  }
}
