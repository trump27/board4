<style lang="stylus">
.v-transition
  transition: all .3s ease
.v-enter, .v-leave
  height: 0
  padding: 0 0
  opacity: 0
</style>

<template>
  <div>
    <h1>Todo</h1>
    <div class="form-inline">
      <input v-model="newTodo" @keyup.enter="addTodo" class="form-control" size="40" placeholder="something todo...">
      <button @click="addTodo" class="btn btn-primary btn-sm">Add</button>
    </div>
    <ul class="list-group">
      <li class="list-group-item todo" v-for="todo in todos | orderBy 'id' -1 " transition>
        <input type="checkbox">
        <span>id:{{ todo.id }}  {{ todo.title }}</span>
        <button @click="removeTodo(todo)" class="btn btn-danger btn-xs pull-right">Remove</button>
        <div class="clear-fix"></div>
        <span>{{ todo.description }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { config } from '../config.js'

export default {
  data () {
    return {
      newTodo: '',
      todos: []
    }
  },

  created: function () {
    console.log('created todo-app')
    this.fetchTodoList()
  },

  methods: {

    fetchTodoList () {
      this.$http.get(config.todo_url + 'index.json')
        .then((response) => {
          this.$data.todos = response.data.data
        }, (err) => {
          console.log(err)
        }).bind(this)
    },

    addTodo () {
      var title = this.newTodo.trim()
      if (title) {
        var todo = {user_id: 1, title: title, description: 'auto'}
        this.$http.post(config.todo_url, todo)
          .then((response) => {
            todo.id = response.data.data.id
            this.$data.todos.unshift(todo)
          }, (response) => {
            console.log(response)
          })
        this.newTodo = ''
      }
    },

    removeTodo (todo) {
      this.$http.delete(config.todo_url + todo.id)
        .then(function (response) {
          this.todos.$remove(todo)
        }, function (response) {
          console.log('remove error')
        })
    }
  }
}
</script>
