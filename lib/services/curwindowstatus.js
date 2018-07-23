import Model from '../models';
import { redis } from '../utils';

const CurWindowStatus = Model('CurWindowStatus');
const TICKET_ACTION_INDEX_MAP = {
  CALL: 1,
  WELCOME: 2,
  PASS: 3,
  DISCARD: 3,
  DONE: 3
};
const TELLER_ACTION_INDEX_MAP = {
  LOGIN: 1,
  LOGOUT: 2
};
const WIN_CONF_PRE = 'conf:w:';

export async function saveOrUpdateForTicket(ticket) {
  const date = new Date().getTime();
  const winConf = await redis.getValueFromRedis(WIN_CONF_PRE + ticket.windowid, 'hash');
  let status;
  let lastActionTime;
  switch (ticket.action) {
    case 'CALL':
      status = 'DOING';
      lastActionTime = ticket.calltime;
      break;
    case 'WELCOME':
      status = 'DOING';
      lastActionTime = ticket.welcometime;
      break;
    case 'PASS':
    case 'DISCARD':
    case 'DONE':
      status = 'LEISURE';
      lastActionTime = ticket.endtime;
      break;
    default:
  }
  await CurWindowStatus.update({
    p: ticket.province,
    c: ticket.city,
    o_id: ticket.officeid,
    wid: ticket.windowid
  }, {
    $set: {
      o: ticket.officename,
      wn: ticket.windowname,
      tc: ticket.tellercode,
      tn: ticket.tellername,
      s: status,
      tno: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.ticketnumber : null,
      bn: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.businessname : null,
      // ------客户信息------//
      ci: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.customeridcard : null,
      cit: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.customeridtype : null,
      cin: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.customeridno : null,
      cn: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.customername : null,
      cl: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.customerlevel : null,
      ivc: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.customerisvip : null,
      cvl: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.customerviplevel : null,
      cs: ticket.action == 'CALL' || ticket.action == 'WELCOME' ? ticket.customersex : null,
      // ------其他------//
      lat: lastActionTime,
      ut: date
    },
    $setOnInsert: {
      crt: date,
      bs: winConf && winConf.businesses ? winConf.businesses.split(',') : []
    }
  }, {
    upsert: true
  });
}

export async function saveOrUpdateForTellerOnline(online) {
  const date = new Date().getTime();
  const winConf = await redis.getValueFromRedis(WIN_CONF_PRE + online.windowid, 'hash');
  let status;
  let lastActionTime;
  switch (online.action) {
    case 'LOGIN':
      status = 'LEISURE';
      lastActionTime = online.logintime;
      break;
    case 'LOGOUT':
      status = 'LOGOUT';
      lastActionTime = online.logouttime;
      break;
    default:
  }
  await CurWindowStatus.update({
    p: online.province,
    c: online.city,
    o_id: online.officeid,
    wid: online.windowid
  }, {
    $set: {
      o: online.officename,
      wn: online.windowname,
      tc: online.tellercode,
      tn: online.tellername,
      s: status,
      // ------其他------//
      lat: lastActionTime,
      ut: date
    },
    $setOnInsert: {
      crt: date,
      bs: winConf && winConf.businesses ? winConf.businesses.split(',') : []
    }
  }, {
    upsert: true
  });
}

export async function validateForTicket(ticket) {
  // 不需记录
  if (!TICKET_ACTION_INDEX_MAP[ticket.action]) {
    return false;
  }
  const curWindowStatus = await CurWindowStatus.findOne({
    p: ticket.province,
    c: ticket.city,
    o_id: ticket.officeid,
    wid: ticket.windowid
  });
  if (!curWindowStatus) {
    return true;
  }
  // 数据库记录中的行为在上报行为之后
  switch (ticket.action) {
    case 'CALL':
      if (curWindowStatus.lat > ticket.calltime) {
        return false;
      }
      break;
    case 'WELCOME':
      if (curWindowStatus.lat > ticket.welcometime) {
        return false;
      }
      break;
    case 'PASS':
    case 'DISCARD':
    case 'DONE':
      if (curWindowStatus.lat > ticket.endtime) {
        return false;
      }
      break;
    default:
  }
  return true;
}

export async function validateForTellerOnline(online) {
  // 不需记录
  if (!TELLER_ACTION_INDEX_MAP[online.action]) {
    return false;
  }
  const curWindowStatus = await CurWindowStatus.findOne({
    p: online.province,
    c: online.city,
    o_id: online.officeid,
    wid: online.windowid
  });
  if (!curWindowStatus) {
    return true;
  }
  // 数据库记录中的行为在上报行为之后
  switch (online.action) {
    case 'LOGIN':
      if (curWindowStatus.lat > online.logintime) {
        return false;
      }
      break;
    case 'LOGOUT':
      if (curWindowStatus.lat > online.logouttime) {
        return false;
      }
      break;
    default:
  }
  return true;
}
