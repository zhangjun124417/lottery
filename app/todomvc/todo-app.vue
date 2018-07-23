<template>
  <div class="todoapp">
    <todo-header></todo-header>
    <todo-list :todos="todos"></todo-list>
    <todo-footer :todos="todos"></todo-footer>
  </div>
</template>

<script>
import {
  debounce,
  capitalize
} from 'lodash';

import { todos } from '../api-v1/todomvc';

import TodoHeader from './todo-header';
import TodoList from './todo-list';
import TodoFooter from './todo-footer';

export default {
  components: {
    TodoHeader,
    TodoList,
    TodoFooter
  },

  data: () => ({
    todos: []
  }),

  title() {
    return capitalize(this.$route.params.filter);
  },

  methods: {
    getTodos: debounce(async function() {
      try {
        this.todos = await todos.get(this.$route.params);
      } catch (err) {
        console.error(err);
      }
    }, 50)
  },

  watch: {
    '$route.params.filter': 'getTodos'
  },

  events: {
    'todomvc:create': 'getTodos',
    'todomvc:update': 'getTodos',
    'todomvc:remove': 'getTodos'
  },

  beforeMount() {
    if (!this.$route.params.filter) {
      this.$router.replace({
        name: 'todomvcFilter',
        params: {
          filter: 'all'
        }
      });
    } else {
      this.getTodos();
    }
  }
};
</script>
