<style lang="stylus">
.v-transition
  transition all .3s ease
.v-enter, .v-leave
  height 0
  padding 0 0
  opacity 0
.addTodoForm
  margin-bottom 15px
.todoTitle
  border none
  outline none
  width 70%
.todoItem
  input[type="checkbox"]
    display inline-block
    position relative
    top -10px
    // vertical-align middle
    width 35px
.todoBlock
  display inline-block
  width 80%
</style>

<template>
  <div>
    <h1>Todo</h1>
    <div class="addTodoForm form-inline">
      <input v-model="newTodoTitile" @keyup.enter="addTodo" class="form-control" size="20" placeholder="something todo...">
      <input v-model="newTodoDesc" @keyup.enter="addTodo" class="form-control" size="30" placeholder="description...">
      <button @click="addTodo" class="btn btn-primary btn-sm">Add</button>
    </div>
    <ul class="list-group">
      <li class="list-group-item todoItem" v-for="todo in todos | orderBy 'id' -1 " transition>
        <input type="checkbox">
        <div class="todoBlock">
          <input type="text"
            v-model="todo.title"
            @blur="updateTodo(todo)"
            class="todoTitle">
          <input type="text"
            v-model="todo.description"
            @blur="updateTodo(todo)"
            class="todoTitle">
          <!--<span>id:{{ todo.id }}  {{ todo.title }}</span>-->
        </div>
        <button @click="removeTodo(todo)" class="btn btn-danger btn-xs pull-right">Remove</button>
        <div class="clear-fix"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import { config } from '../config.js'

export default {
  data () {
    return {
      newTodoTitile: '',
      newTodoDesc: '',
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
        })
        // }).bind(this)
    },

    addTodo () {
      var title = this.newTodoTitile.trim()
      if (title) {
        var todo = { title: title, description: this.newTodoDesc}
        this.$http.post(config.todo_url, todo)
          .then((response) => {
            todo.id = response.data.data.id
            this.$data.todos.unshift(todo)
          }, (response) => {
            console.log('add error')
          })
        this.newTodoTitile = this.newTodoDesc = ''
      }
    },
    updateTodo (todo) {
      var title = todo.title.trim()
      if (title) {
        this.$http.put(config.todo_url + todo.id, todo)
          .then((response) => {
            if (!response.data.success) {
              console.log('update error')
            }
          })
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
