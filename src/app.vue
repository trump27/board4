<style lang="stylus">
// .view
.route-transition
  transition all .5s ease
.route-leave
  display none
.route-enter
  opacity 0
  padding 0 0
  height 0
  transform translate3d(0, 0, 0)
  // transform translateX(15px)
</style>

<template>
  <div>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navmenu">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Board4</a>
        </div>

        <div class="collapse navbar-collapse" id="navmenu">
          <ul class="nav navbar-nav">
            <li><a v-link="'/todo'">Todo</a></li>
            <li><a v-link="'/memo'">Memo</a></li>
            <li><a v-link="{ path: '/home' }">Home</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a v-if="authenticated" @click="signout" href="#">Sign out</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-view transition="route"></router-view>
    </div>
  </div>
</template>

<script>
import { auth } from './auth/auth.js'

export default {
  data () {
    return {
      authenticated: false
    }
  },

  created: function () {
    this.authenticated = auth.isSignin()
    console.log('create app')
  },

  events: {
    'signinNotify': function () {
      this.authenticated = true
    }
  },

  methods: {

    signout () {
      this.authenticated = false
      auth.signout()
      this.$route.router.go('/')
    }

  }
}
</script>
