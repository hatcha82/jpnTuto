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
  show (articleId) {
    return Api().get(`articles/${articleId}`)
  },
  post (article) {
    return Api().post('articles', article)
  },
  put (article) {
    return Api().put(`articles/${article.id}`, article)
  },
  delete (article) {
    return Api().delete(`articles/${article.id}`, article)
  }
}
