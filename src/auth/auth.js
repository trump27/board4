// import Vue from '../index.js'
import { config } from '../config.js'

// var auth = {
export var auth = {

  // authenticated: false,

  // profile: {
  //   // id: null,
  //   // username: null
  // },

  getToken () {
    return sessionStorage.getItem('token')
  },

  setToken (token) {
    sessionStorage.setItem('token', token)
  },

  removeToken () {
    sessionStorage.removeItem('token')
  },
  isSignin () {
    if (this.getToken()) {
      return true
    } else {
      return false
    }
  },
  // checkAuth () {
  //   if (this.getToken()) {
  //     this.authenticated = true
  //   } else {
  //     this.authenticated = false
  //   }
  // },

  signin (context, creds, callback) {

    context.$http.post(config.auth_url, creds)
      .then((response) => {
        if (response.data.success) {
          this.setToken(response.data.data.token)

          callback(true)

          context.$route.router.go('/todo')
        }
      }, (response) => {
        callback(false)
        context.message = 'サインインに失敗しました'
      })
  },

  signout () {
    this.removeToken()
    // this.authenticated = false
  },

  getAuthorizationHeader () {
    var token = this.getToken()
    if (token) {
      return 'Bearer ' + token
    }
    return null
  }
}
