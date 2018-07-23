<template>
  <footer class="footer">
    <span class="todo-count">
      <strong v-text="remaining"></strong> {{pluralize('item', remaining)}} left
    </span>
    <ul class="filters">
      <li v-for="filter in filters" :key="filter">
        <router-link
          active-class="selected"
          :to="{ name: 'todomvcFilter', params: { filter } }">
          {{capitalize(filter)}}
        </router-link>
      </li>
    </ul>
    <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
      Clear completed
    </button>
  </footer>
</template>

<script>
import { capitalize } from 'lodash';

import { todo } from '../api-v1/todomvc';

export default {
  props: {
    todos: {
      type: Array,
      default: () => ([])
    }
  },

  data: () => ({
    filters: [
      'all',
      'active',
      'completed'
    ]
  }),

  computed: {
    remaining() {
      return this.todos.filter(t => !t.completed).length;
    }
  },

  methods: {
    async removeCompleted() {
      try {
        await Promise.all(this.todos.filter(t => t.completed)
          .map(t => todo.delete(t.id)));
        this.$emit('todomvc:remove');
      } catch (err) {
        console.error(err);
      }
    },
    pluralize(word, count) {
      return word + (count === 1 ? '' : 's');
    },
    capitalize
  }
};
</script>
