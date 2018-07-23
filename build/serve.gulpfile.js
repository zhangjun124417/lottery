/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';

import config from './config.gulpfile';

const {
  dir,
  $,
  pkg
} = config;

gulp.task('nodemon', ['init'], () => {
  $.nodemon({
    exec: 'babel-node',
    script: pkg.main,
    watch: [
      `${dir.backend}/`,
      `${dir.config}/`
    ],
    ext: 'js',
    env: {
      NODE_ENV: 'development'
    }
  });
});

gulp.task('serve', [
  'nodemon',
  'webpack-dev-server'
]);
