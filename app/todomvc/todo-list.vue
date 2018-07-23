<template>
  <section class="main" v-show="todos.length">
    <input id="toggle-all" type="checkbox" class="toggle-all" v-model="allDone">
    <label for="toggle-all"></label>
    <ul class="todo-list">
      <todo-item
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :edited-todo="editedTodo">
      </todo-item>
    </ul>
  </section>
</template>

<script>
import TodoItem from './todo-item';

export default {
  components: {
    TodoItem
  },

  props: {
    todos: {
      type: Array,
      default: () => ([])
    }
  },

  data: () => ({
    editedTodo: null
  }),

  computed: {
    allDone: {
      get() {
        return !this.todos.filter(todo => !todo.completed).length;
      },
      set(value) {
        this.todos.forEach((todo) => {
          todo.completed = value;
        });
      }
    }
  },

  methods: {
    doneEdit() {
      this.editedTodo = null;
      this.$emit('todomvc:update');
    }
  },

  events: {
    'todomvc:edit'(todo) {
      this.editedTodo = todo;
    },
    'todomvc:doneEdit': 'doneEdit'
  }
};
</script>
