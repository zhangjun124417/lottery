import { isFunction } from 'lodash';

export default function VueTitle(Vue) {
  function setTitle(title, ctx) {
    const titleParts = [process.env.PKG_NAME];
    ctx.$route.meta.title && titleParts.unshift(ctx.$route.meta.title);
    title && titleParts.unshift(title);
    document.title = titleParts.join(' - ');
  }

  Vue.mixin({
    mounted() {
      const titleExp = this.$options.title;
      if (titleExp || this.$parent && this.$parent.$el.className == 'app') {
        if (isFunction(titleExp)) {
          this.$watch(titleExp, function(newVal, oldVal) {
            if (newVal != oldVal) {
              setTitle(newVal, this);
            }
          }, {
            immediate: true
          });
        } else {
          setTitle(titleExp, this);
        }
      }
    }
  });
}
