import Model from '../models';

const CurTellerOnline = Model('CurTellerOnline');
const TELLER_ACTION_INDEX_MAP = {
  LOGIN: 1,
  LOGOUT: 2
};

export async function saveOrUpdateForTellerOnline(online) {
  const date = new Date().getTime();
  const curTellerOnline = await CurTellerOnline.findOneAndUpdate({
    o_id: online.officeid,
    wid: online.windowid,
    it: parseInt(online.logintime, 10)
  }, {
    $set: {
      // ------基础信息------//
      p: online.province,
      c: online.city,
      o: online.officename,
      // ------在线信息------//
      wn: online.windowname,
      tc: online.tellercode,
      tn: online.tellername,
      it1: new Date(parseInt(online.logintime, 10)),
      ot: online.logouttime ? parseInt(online.logouttime, 10) : null,
      ot1: online.logouttime ? new Date(parseInt(online.logouttime, 10)) : null,
      od: online.onlinetime || online.onlinetime == 0 ? online.onlinetime : null,
      action: online.action,
      // ------其他------//
      ut: date
    },
    $setOnInsert: {
      crt: date
    }
  }, {
    upsert: true,
    new: true
  });
  return curTellerOnline;
}

export async function validateForTellerOnline(online) {
  // 不在需记录行为列表中
  if (!TELLER_ACTION_INDEX_MAP[online.action]) {
    return false;
  }
  const curTellerOnline = await CurTellerOnline.findOne({
    o_id: online.officeid,
    wid: online.windowid,
    it: parseInt(online.logintime, 10)
  });
  // 第一次上报
  if (!curTellerOnline) {
    return true;
  }
  // 数据库记录中的行为在上报行为之后
  if (TELLER_ACTION_INDEX_MAP[curTellerOnline.action] >= TELLER_ACTION_INDEX_MAP[online.action]) {
    return false;
  }
  return true;
}
