<template>
  <div class="app">
    <transition name="fade" mode="out-in">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus">
.fade
  &-enter
  &-leave-active
    opacity: 0
  &-enter
  &-leave
    &-active
      transition: opacity .3s

.example
  &-input
    padding: 6px 12px
    border: 1px solid #999
    border-radius: 4px

  &-btn
    padding: 6px 12px
    background: #eee
    border: 1px solid #999
    border-radius: 4px
</style>
