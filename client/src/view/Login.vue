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
           
    </v-flex>
  </v-layout>
  <v-layout column>
    
        <v-btn
        large
          color="primary" 
          Block
          @click="login()">
          Login
        </v-btn>
       
        <v-btn
          large
          color="primary" 
          Block
          flat
          @click="linkTo('register')">
          Sign Up
        </v-btn>
        <a class="google btn" href="http://localhost:8080/auth/google">Google+</a>
        <a class="naver btn" href="http://localhost:8081/auth/naver">Naver</a>
        <a class="kakao btn" href="http://localhost:8081/auth/kakao">Kakao</a>
        <a class="facebook btn" href="http://localhost:8081/auth/facebook">facebook</a>    
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
    linkTo (name) {
        this.$router.push({
          name: name
        })
    },
    
    login: function () {
      var email =this.email;
      var password = this.password
      
      this.$auth.login({ email, password }).then(function (res) {
        console.log(res.data.login)
      })
    },
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


