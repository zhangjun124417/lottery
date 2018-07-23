<template>
  <div>
    <h1>Simple Example</h1>
    <p>
      <input class="example-input" type="text" v-model="id">
      <router-link class="example-btn" tag="button" :to="{ name: 'example', params: { id } }">
        Go Example
      </router-link>
      <router-link class="example-btn" tag="button" :to="{ name: 'exampleError', params: { id } }">
        Go Example Error
      </router-link>
    </p>
    <h1>Todomvc Example</h1>
    <p>
      <router-link class="example-btn" tag="button" :to="{ name: 'todomvc' }">
        Go Todomvc Example
      </router-link>
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    id: '1'
  })
};
</script>
