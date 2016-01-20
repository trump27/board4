<style lang="stylus">
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
    <navbar></navbar>
    <div class="container">
      <router-view transition="route"></router-view>
    </div>
  </div>
</template>

<script>
import { auth } from './auth/auth.js'
import Navbar from './components/navbar.vue'

export default {
  data () {
    return {
      authenticated: false
    }
  },

  components: {
    navbar: Navbar
  },

  created: function () {
    this.authenticated = auth.isSignin()
    console.log('create app')
  },

  events: {
    'signinNotify': function () {
      this.authenticated = true
    },
    'signoutNotify': function () {
      this.authenticated = false
      this.$route.router.go('/')
    }
  }

}
</script>
