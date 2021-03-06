import { resolve } from 'path';

const {
  env
} = process;

export default {
  port: {
    http: 6009,
    https: 6109
  },
  https: {
    pfx: undefined,
    passphrase: undefined
  },
  mongo: {
    host: 'localhost',
    port: '27017',
    db: 'lottery',
    user: 'admin',
    pwd: 'passwd',
    authSource: 'admin',
    options: {
      server: {
        poolSize: 1,
        socketOptions: {
          connectTimeoutMS: 30000,
          socketTimeoutMS: 360000
        }
      }
    }
  },
  redis: {
    host: 'localhost',
    port: '6379',
    auth: 'root1234',
    db: 2
  },
  cookie: {
    secure: false, // cookie secure 属性
    db: 10
  },
  log: {
    level: 'TRACE'
  },
  static: {
    maxAge: 0
  },
  dir: {
    root: resolve(__dirname, '../')
  }
};
