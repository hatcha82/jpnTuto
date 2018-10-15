import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login'
import Main from '@/components/Main'
import Music from '@/view/music/Index'
import ViewMusic from '@/view/music/Detail'
import Articles from '@/view/article/Index'
import ViewArticle from '@/view/article/Detail'
import Twitter from '@/view/twitter/Index'
import Register from '@/view/Register'
import AuthRedirect from '@/view/AuthRedirect'

// import ConvertFurigana from '@/components/Converter/ConvertFurigana'

// import CreateArticle from '@/components/Article/CreateArticle'
// import EditArticle from '@/components/Article/EditArticle'
// import ViewArticle from '@/components/Article/ViewArticle/Index'
// import Songs from '@/components/Song/List/Index'
// import CreateSong from '@/components/Song/CreateSong'
// import EditSong from '@/components/Song/EditSong'
// import ViewSong from '@/components/Song/ViewSong/Index'

Vue.use(Router)
export default new Router({
  mode: 'history',
  canReuse: false,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/Main',
      name: 'Main',
      component: Main
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/login/:providerId',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    // {
    //   path: '/convertFurigana',
    //   name: 'convertFurigana',
    //   component: ConvertFurigana
    // },
    {
      path: '/article/list',
      name: 'article-list',
      component: Articles
    },
    {
      path: '/article/detail/:articleId',
      name: 'article-detail',
      component: ViewArticle
    },
    {
      path: '/twitter/list/',
      name: 'twitter-list',
      component: Twitter
    },
    {
      path: '/twitter/list/:search',
      name: 'twitter-list-search',
      component: Twitter
    },
    // {
    //   path: '/articles/create',
    //   name: 'articles-create',
    //   component: CreateArticle
    // },
    // {
    //   path: '/articles/:articleId',
    //   name: 'article',
    //   component: ViewArticle
    // },
    // {
    //   path: '/articles/:articleId/edit',
    //   name: 'article-edit',
    //   component: EditArticle
    // },
    {
      path: '/music/list',
      name: 'music-list',
      component: Music
    },
    // {
    //   path: '/songs/create',
    //   name: 'songs-create',
    //   component: CreateSong
    // },
    {
      path: '/music/detail/:songId',
      name: 'music-detail',
      component: ViewMusic
    },
    // {
    //   path: '/songs/:songId/edit',
    //   name: 'song-edit',
    //   component: EditSong
    // },
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/auth/google/redirect',
      name: 'google-redirect',
      component: AuthRedirect
    },
    {
      path: '*',
      redirect: 'Main'
    }
  ]
})
