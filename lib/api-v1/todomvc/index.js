import * as todoCtrl from './todo';

export default {
  '/todos': {
    get: todoCtrl.get,
    post: todoCtrl.create
  },
  '/todo/:id': {
    put: todoCtrl.update,
    delete: todoCtrl.remove
  }
};
