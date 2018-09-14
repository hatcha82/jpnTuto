import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    baseURL: `http://` + process.env.API_URL || '106.10.51.131:8080' + `/`,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
