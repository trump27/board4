<style lang="stylus">
.v-transition
  transition all .3s ease
.v-enter, .v-leave
  opacity 0
.addTodoForm
  margin-bottom 15px
.todoTitle
  border none
  outline none
.todoItem
  width 100%
  input
    background-color transparent
  input[type="text"]
    display block
    width 100%
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
      <input v-model="searchText" class="form-control" placeholder="quick seacrh"
        @keyup.esc="searchText = ''">
    </div>
    <ul class="list-group">
      <li class="list-group-item todoItem"
        v-for="todo in todos | todoFilter | filterBy searchText in searchFields"
        :class="{'completed' : todo.done}"
        transition>
        <input type="checkbox"
          @click="doneTodo(todo)"
          v-model="todo.done">
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
      todos: [],
      searchText: '',
      searchFields: ['title', 'description']
    }
  },

  filters: {
    todoFilter: (todos) => {
      return todos.filter((todo) => {
        return true
      })
      .sort((todoA, todoB) => {
        if (todoA.done !== todoB.done) return todoA.done - todoB.done
        if (todoA.priority !== todoB.priority) return todoA.priority - todoB.priority
        return todoB.id - todoA.id
      })
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
        var todo = { title: title, description: this.newTodoDesc, done: false}
        this.$http.post(config.todo_url, todo)
          .then((response) => {
            todo.id = response.data.data.id
            todo.user_id = response.data.data.user_id
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
      todo.done = !todo.done
      if (todo.done) todo.completed = formatDatetime()
      this._updateTodo({id: todo.id, completed: todo.completed, done: todo.done})
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
