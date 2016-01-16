console.log('index.js start')

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(VueRouter)

var router = new VueRouter({
  // history: true,
  // saveScrollPosition: true
  // transitionOnLoad: true
})

import { configRouter, configHttp } from './config.js'
configRouter(router)
configHttp(Vue, router)

const App = Vue.extend(require('./app.vue'))
router.start(App, '#app')
