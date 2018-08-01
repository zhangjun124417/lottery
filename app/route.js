export default {
  '/': {
    name: 'homepage',
    meta: {
      title: '首页'
    },
    component: () => import('./index/index')
  },
  '/fix': {
    name: 'homepage',
    meta: {
      title: '固定数列'
    },
    component: () => import('./index/fix')
  },
  '/tokyo/fixed': {
    name: 'homepage',
    meta: {
      title: '东京'
    },
    component: () => import('./index/tokyo')
  },
  '/example/:id': {
    name: 'example',
    meta: {
      title: '请求例子'
    },
    component: () => import('./example/example')
  },
  '/example/:id/error': {
    name: 'exampleError',
    meta: {
      title: '请求异常例子'
    },
    component: () => import('./example/example')
  },
  '/todomvc': {
    name: 'todomvc',
    meta: {
      title: 'TodoMVC'
    },
    component: () => import('./todomvc/todo-app')
  },
  '/todomvc/:filter': {
    name: 'todomvcFilter',
    meta: {
      title: 'TodoMVC'
    },
    component: () => import('./todomvc/todo-app')
  }
};
