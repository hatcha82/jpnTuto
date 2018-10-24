import Api from '@/services/Api'

export default {
  visiterIncrease (visitor) {
    return Api().post('visitor/increase', visitor)
  }  
}
