import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    baseURL: `http://211.174.239.219:8081/`,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
