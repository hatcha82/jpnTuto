import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import ConvertFurigana from '@/components/Converter/ConvertFurigana'
import Articles from '@/components/Article/List/Index'
import CreateArticle from '@/components/Article/CreateArticle'
import EditArticle from '@/components/Article/EditArticle'
import ViewArticle from '@/components/Article/ViewArticle/Index'
import Songs from '@/components/Song/List/Index'
import CreateSong from '@/components/Song/CreateSong'
import EditSong from '@/components/Song/EditSong'
import ViewSong from '@/components/Song/ViewSong/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/convertFurigana',
      name: 'convertFurigana',
      component: ConvertFurigana
    },
    {
      path: '/articles',
      name: 'articles',
      component: Articles
    },
    {
      path: '/articles/create',
      name: 'articles-create',
      component: CreateArticle
    },
    {
      path: '/articles/:articleId',
      name: 'article',
      component: ViewArticle
    },
    {
      path: '/articles/:articleId/edit',
      name: 'article-edit',
      component: EditArticle
    },
    {
      path: '/songs',
      name: 'songs',
      component: Songs
    },
    {
      path: '/songs/create',
      name: 'songs-create',
      component: CreateSong
    },
    {
      path: '/songs/:songId',
      name: 'song',
      component: ViewSong
    },
    {
      path: '/songs/:songId/edit',
      name: 'song-edit',
      component: EditSong
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '*',
      redirect: 'songs'
    }
  ]
})
