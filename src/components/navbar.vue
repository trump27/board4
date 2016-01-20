<template>
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
          <li><a v-if="$root.authenticated" @click="signout" href="#">Sign out</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth } from '../auth/auth.js'

export default {

  methods: {
    signout () {
      auth.signout()
      this.$dispatch('signoutNotify')
    }
  }
}
</script>
