<template>
  <li
    class="todo"
    :class="{completed: todo.completed, editing: todo == editedTodo}">
    <div class="view">
      <input class="toggle" type="checkbox" v-model="todo.completed">
      <label @dblclick="editTodo">{{todo.content}}</label>
      <button class="destroy" @click="removeTodo"></button>
    </div>
    <input
      class="edit"
      type="text"
      v-model="todo.content"
      v-todo-focus="todo == editedTodo"
      @blur="doneEdit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit">
  </li>
</template>

<script>
import { todo } from '../api-v1/todomvc';

export default {
  props: {
    todo: {
      type: Object,
      default: () => ({
        id: '',
        content: '',
        completed: false,
        create_date: 0
      })
    },
    editedTodo: {
      type: Object
    }
  },

  data: () => ({
    beforeEditCache: ''
  }),

  methods: {
    async removeTodo() {
      try {
        await todo.delete(this.todo.id);
        this.$emit('todomvc:remove');
      } catch (err) {
        console.error(err);
      }
    },

    editTodo() {
      this.beforeEditCache = this.todo.content;
      this.$emit('todomvc:edit', this.todo);
    },

    async doneEdit() {
      try {
        this.todo.content = this.todo.content.trim();
        if (this.todo.content) {
          await todo.put(this.todo);
        } else {
          await this.removeTodo();
        }
        this.$emit('todomvc:doneEdit');
      } catch (err) {
        console.error(err);
      }
    },

    cancelEdit() {
      this.todo.content = this.beforeEditCache;
    }
  },

  watch: {
    'todo.completed': 'doneEdit'
  },

  directives: {
    todoFocus(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
};
</script>
