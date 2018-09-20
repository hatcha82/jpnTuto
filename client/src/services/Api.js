import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    baseURL: `http://` + process.env.API_URL,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
