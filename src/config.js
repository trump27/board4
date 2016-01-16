const API_BASE = 'http://localhost:8080/dev/board4.api/api/'

export const config = {
  base_url: API_BASE,
  auth_url: API_BASE + 'users/token',
  todo_url: API_BASE + 'todos/'
}

import Login from './login/login.vue'
import Home from './components/home.vue'
import Todo from './todos/todo.vue'

export function configRouter (router) {

  router.map({
    '/': { component: Login },
    '/home': { component: Home },
    '/todo': { component: Todo },
    '/meno': { component: Home },
    '/signin': { component: Login }
  })

  router.redirect({
    '*': '/'
  })
}

import { auth } from './auth/auth.js'

export function configHttp (vue, router) {

  vue.http.interceptors.push({

    request: function (request) {
      var token = auth.getToken()
      if (token) {
        request.headers.Authorization = auth.getAuthorizationHeader()
      }
      return request
    },

    response: function (response) {
      if (response.status === 401 || !response.ok) {
        auth.signout()
        console.log('response status : ' + response.status)
        router.go('/signin')
      }
      return response
    }
  })

}
