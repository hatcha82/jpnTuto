import Api from '@/services/Api'

export default {
  index (search,offset) {
    return Api().get('twitters/userTimeLine', {
      params: {
        search: search,
        offset: offset
      }
    })
  },
  homeTimeLine (search,offset) {
    return Api().get('twitters/homeTimeLine', {
      params: {
        search: search,
        offset: offset
      }
    })
  },
  show (songId) {
    return Api().get(`songs/${songId}`)
  },
  post (song) {
    return Api().post('songs', song)
  },
  put (song) {
    return Api().put(`songs/${song.id}`, song)
  },
  delete (song) {
    return Api().delete(`songs/${song.id}`, song)
  }
}
