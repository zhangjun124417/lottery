<template>
  <div>
    <p>
      Example request <strong>{{jsonString}}</strong>:
    </p>
    <p>
      <button class="example-btn" @click="request" :disabled="pending">
        {{pending ? 'Pending...' : 'Request'}}
      </button>
    </p>
    <p>
      Response: {{response}}
    </p>
    <p>
      <button class="example-btn" @click="$router.back()">
        Back
      </button>
    </p>
  </div>
</template>

<script>
import {
  example,
  exampleError
} from '../api-v1/example';

export default {
  data: () => ({
    response: '',
    pending: false
  }),

  computed: {
    jsonString() {
      return `{ id: ${this.$route.params.id} }`;
    }
  },

  title() {
    return `Example request ${this.jsonString}`;
  },

  methods: {
    async request() {
      this.pending = true;
      try {
        this.response = await (this.$route.name == 'example' ? example : exampleError).get(this.$route.params);
      } catch (err) {
        this.response = err;
      }
      this.pending = false;
    }
  }
};
</script>
