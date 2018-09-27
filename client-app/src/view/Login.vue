<template>
  <v-container>
  <v-layout align-center justify-center fill-height>
    <v-flex>
        <v-text-field
          label="Email"
          v-model="email"
        ></v-text-field>
        <v-text-field
          label="Password"
          type="password"
          v-model="password"
        ></v-text-field>
        <br>
        <div class="danger-alert" v-html="error" />
        <br>
        <div class="text-xs-center">
        <v-btn
        large
          color="primary" 
          round
          @click="login">
          Login
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
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


