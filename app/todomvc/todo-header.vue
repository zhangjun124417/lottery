<template>
  <header class="header">
    <h1>todos</h1>
    <input
      class="new-todo"
      autofocus
      autocomplete="off"
      placeholder="What needs to be done?"
      v-model="newTodo"
      @keyup.enter="createTodo">
  </header>
</template>

<script>
import { todos } from '../api-v1/todomvc';

export default {
  data: () => ({
    newTodo: ''
  }),

  methods: {
    async createTodo() {
      try {
        await todos.post({
          content: this.newTodo
        });
        this.newTodo = '';
        this.$emit('todomvc:create');
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
