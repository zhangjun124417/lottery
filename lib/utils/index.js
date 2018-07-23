import _ from 'lodash';
import promisified from './promisified';
import getErrorHandler from './errorhandler';
import getLogger from './logger';
import passport from './passport';
import redis from './redis';

const logger = getLogger(__filename);
const {
  fs
} = promisified;

export {
  fs,
  getErrorHandler,
  getLogger,
  passport,
  redis
};

export function parseJson(json) {
  let obj;
  try {
    obj = JSON.parse(json);
  } catch (e) {
    logger.error('JSON parse error', e);
  }
  return obj || {};
}

export function pickNotNull(...args) {
  return _.transform(_.pick(...args), (result, value, key) => {
    value != null && (result[key] = value);
  });
}

export function upperCamelCase(string) {
  const firstLetter = string.substr(0, 1).toUpperCase();
  return firstLetter + _.camelCase(string.substr(1));
}

export function toRegExp(str, flags) {
  return new RegExp(_.trim(str).replace(
    /([\\/*.+&^[\](){}|?=!])/g,
    '\\$1'
  ), flags);
}

export function getClientIp(ctx) {
  let ip = ctx.headers['x-forwarded-for'] ||// 是否有反向代理IP(头信息：x-forwarded-for
      (ctx.connection && ctx.connection.remoteAddress) ||// 判断connection的远程IP
      (ctx.socket && ctx.socket.remoteAddress) ||// 判断socketIP
      (ctx.connection && ctx.connection.socket &&
        ctx.connection.socket.remoteAddress);
  if (_.isArray(ip)) {
    ip = _.last(ip);
  }
  return ip || '';
}

export function validateParams(object, fields) {
  if (_.isEmpty(object)) {
    return false;
  }

  // 值为数字需要独立判断
  function isEmpty(val) {
    return _.isNumber(val) ? false : _.isEmpty(val) ||
      _.isNull(object) || _.isUndefined(object) || _.isNaN(object) || val === 'undefined';
  }

  if (_.isString(fields)) {
    return _.has(object, fields) && !isEmpty(object[fields]);
  }

  // 遍历校验所有属性值
  return _.every(fields, field => (_.has(object, field) &&
      _.isBoolean(object[field]) || _.isArray(object[field]) ? true : !isEmpty(object[field])));
}
