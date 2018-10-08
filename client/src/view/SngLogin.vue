<template>
  <v-container>
    
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  async mounted () {
    const search = this.$route.params.token
    this.$store.dispatch('setToken', response.data.token)
    this.$store.dispatch('setUser', response.data.userId)
    this.$router.push({
      name: 'music-list'
    })
  },
  methods: {
    linkTo (name) {
        this.$router.push({
          name: name
        })
    },
    async login () {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })
        
      } catch (error) {
        this.error = error.response.data.error
      }
    },
    async google () {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push({
          name: 'music-list'
        })
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>


