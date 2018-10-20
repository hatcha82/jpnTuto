import Api from '@/services/Api'

export default {
  index (search,offset) {
    return Api().get('articles', {
      params: {
        search: search,
        offset: offset
      }
    })
  },
  rencentNews () {
    return Api().get('articles/recentNews', {
      params: {
      }
    })
  },
  show (articleId) {
    return Api().get(`article/${articleId}`)
  },
  post (article) {
    return Api().post('article', article)
  },
  put (article) {
    return Api().put(`article/${article.id}`, article)
  },
  delete (article) {
    return Api().delete(`article/${article.id}`, article)
  }
}
