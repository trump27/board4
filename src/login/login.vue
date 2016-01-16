<style lang="stylus">
.loginForm
  max-width 330px
  padding 15px
  margin 0 auto
  .text
    margin-bottom 0
</style>

<template>
  <form class="loginForm">
    <h1>Sign in</h1>
    <div v-show="message" class="alert alert-danger" role="alert">{{message}}</div>
    <div class="form-group text">
      <input v-model="username" type="text" name="username" placeholder="username" class="form-control"/>
    </div>
    <div class="form-group password">
      <input v-model="password" type="password" name="password" placeholder="password" class="form-control"/>
    </div>
    <button type="submit" @click="signin" class="btn btn-lg btn-primary btn-block">Sign in</button>
  </form>
</template>

<script>
import { auth } from '../auth/auth.js'

export default {
  data () {
    return {
      username: null,
      password: null,
      message: null
    }
  },

  created: () => {
    console.log('start signin')
  },

  methods: {

    signin (e) {
      e.preventDefault()
      if (!this.username) {
        this.message = '未入力です'
        return
      }
      this.$data.message = ''

      var creds = {username: this.username, password: this.password}
      var self = this
      auth.signin(this, creds, (done) => {
        if (done) {
          self.$dispatch('signinNotify')
        }
      })
    }
  }
}
</script>
