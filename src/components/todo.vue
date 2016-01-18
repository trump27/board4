<style lang="stylus">
.v-transition
  transition all .3s ease
.v-enter, .v-leave
  // height 0
  // padding 0 0
  opacity 0
.addTodoForm
  margin-bottom 15px
.todoTitle
  border none
  outline none
  width 70%
.todoItem
  input
    background-color transparent
  input[type="checkbox"]
    display inline-block
    position relative
    top -10px
    width 35px
  div.todoBlock
    display inline-block
    width 80%
.completed
  input[type="text"]
    text-decoration line-through
  background-color #efefef

</style>

<template>
  <div>
    <h1>Todo</h1>
    <div class="addTodoForm form-inline">
      <input v-model="newTodoTitle"
        id="newTodoTitle"
        @keyup.enter="addTodo"
        class="form-control" size="20" placeholder="todo title...">
      <input v-model="newTodoDesc"
        @keyup.enter="addTodo" class="form-control" size="30" placeholder="description...">
      <button @click="addTodo" class="btn btn-primary btn-sm">Add</button>
    </div>
    <ul class="list-group">
      <li class="list-group-item todoItem"
        v-for="todo in todos | orderBy 'completed' -1 'id' -1 "
        :class="{'completed' : (todo.completed)}"
        transition>
        <input type="checkbox"
          @click="doneTodo(todo)"
          v-model="todo.completed"
          v-bind:value="(todo.completed===null)">
        <!--  v-bind:false-value="(todo.completed===null)">-->
        <div class="todoBlock">
          <input type="text"
            v-model="todo.title"
            @focus="editTitle(todo.title)"
            @keyup.esc="cancelEditTitle(todo)"
            @blur="updateTodo(todo)"
            class="todoTitle">
          <input type="text"
            v-model="todo.description"
            @focus="editDesc(todo.description)"
            @keyup.esc="cancelEditDesc(todo)"
            @blur="updateTodo(todo)"
            class="todoTitle">
        </div>
        <button
          @click="removeTodo(todo)"
          class="btn btn-danger btn-xs pull-right">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { config } from '../config.js'

function formatDatetime (date = null) {
  if (date == null) {
    date = new Date()
  }
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ].join('/') + ' ' + date.toLocaleTimeString()
}

export default {
  data () {
    return {
      newTodoTitle: '',
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

      this.$nextTick(() => {
        document.getElementById('newTodoTitle').focus()
      })

    },

    addTodo () {
      var title = this.newTodoTitle.trim()
      if (title) {
        var todo = { title: title, description: this.newTodoDesc}
        this.$http.post(config.todo_url, todo)
          .then((response) => {
            todo.id = response.data.data.id
            this.todos.unshift(todo)
            this.$nextTick(() => {
              document.getElementById('newTodoTitle').focus()
            })
          }, (response) => {
            console.log('add error')
          })
        this.newTodoTitle = this.newTodoDesc = ''
      }
    },
    _updateTodo (todo) {
      this.$http.put(config.todo_url + todo.id, todo)
        .then((response) => {
          if (!response.data.success) {
            console.log('update error')
          }
        })
    },
    updateTodo (todo) {
      var title = todo.title.trim()
      if (title) {
        this._updateTodo(todo)
      }
    },
    removeTodo (todo) {
      this.$http.delete(config.todo_url + todo.id)
        .then(function (response) {
          this.todos.$remove(todo)
        }, function (response) {
          console.log('remove error')
        })
    },
    doneTodo (todo) {
      if (todo.completed) {
        todo.completed = null
      } else {
        todo.completed = formatDatetime()
      }
      this._updateTodo({id: todo.id, completed: todo.completed})
    },
    editTitle (title) {
      this.titleCache = title
    },
    cancelEditTitle (todo) {
      todo.title = this.titleCache
    },
    editDesc (description) {
      this.descriptionCache = description
    },
    cancelEditDesc (todo) {
      todo.description = this.descriptionCache
    }
  }
}
</script>
