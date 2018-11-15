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
  searchItune(keyword){
    var ituneSearchUrl = `https://itunes.apple.com/search?term=${keyword}&country=JP&entity=song&lang=ja_jp&limit=1`    
    return Api().get(ituneSearchUrl, { crossDomain: true})
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
  songByArtist (artist, offset, limit) {
    return Api().get('songs/songByArtist', {
      params: {
        artist: artist,
        offset: offset,
        limit: limit,
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
