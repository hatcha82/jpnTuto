<template>
  <v-container>
    <v-layout align-center justify-center  fill-height>
      <v-flex>
          <form 
            name="tab-tracker-form"
            autocomplete="off">
            <v-text-field
              label="Email"
              v-model="email"
            ></v-text-field>
            <v-text-field
              label="Password"
              type="password"
              v-model="password"
              autocomplete="new-password"
            ></v-text-field>
        

          </form>
          <br>
          <div class="danger-alert" v-html="error" />
          <br>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
            <v-btn
            large
            block
              color="primary" 
              @click="register">
              Create Account
            </v-btn>
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
    async register () {
      try {
        const response = await AuthenticationService.register({
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

<style>
</style>
