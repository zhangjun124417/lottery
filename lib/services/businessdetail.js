import _ from 'lodash';
import { redis } from '../utils';
import Model from '../models';

const BusinessDetail = Model('BusinessDetail');
const TICKET_ACTION_INDEX_MAP = {
  PASS: 1,
  DISCARD: 1,
  DONE: 1,
  EVALUATEREQUEST: 2,
  EVALUATERESULT: 3
};
const OFFICE_CONF_PRE = 'conf:o:';

export async function saveOrUpdateFromCur(curBusinessDetail) {
  const date = new Date().getTime();
  const matchParams = {
    _id: curBusinessDetail._doc._id
  };
  const setParams = _.clone(curBusinessDetail._doc);
  delete setParams.crt;
  delete setParams.__v;
  setParams.ut = date;
  const setOnInsertParams = {
    crt: date
  };
  const businessDetail = await BusinessDetail.findOneAndUpdate(matchParams, {
    $set: setParams,
    $setOnInsert: setOnInsertParams
  }, {
    upsert: true
  });
  return [businessDetail, businessDetail ? _.assign(_.clone(businessDetail._doc), setParams) :
    _.assign(matchParams, setParams, setOnInsertParams)
  ];
}

export async function saveOrUpdateForTicket(ticket) {
  const date = new Date().getTime();
  const officeConf = await redis.getValueFromRedis(OFFICE_CONF_PRE + ticket.officeid, 'hash');
  let isWaitAbnormal = null;
  if (ticket.waittime || ticket.waittime == 0) {
    isWaitAbnormal = ticket.waittime > officeConf.waitmaxdura * 60 * 1000;
  }
  let isTranAbnormal = null;
  if (ticket.dealtime || ticket.dealtime == 0) {
    isTranAbnormal = !!(ticket.dealtime > officeConf.busimaxdura * 60 * 1000 ||
      ticket.dealtime < officeConf.busimindura * 1000);
  }
  const matchParams = {
    o_id: ticket.officeid,
    tit: parseInt(ticket.tickettime, 10),
    tiid: ticket.ticketid
  };
  const setParams = {
    // ------基础信息------//
    p: ticket.province,
    c: ticket.city,
    o: ticket.officename,
    // ------票号信息------//
    tin: ticket.ticketnumber,
    bn: ticket.businessname,
    wid: ticket.windowid ? ticket.windowid : null,
    wn: ticket.windowname ? ticket.windowname : null,
    tc: ticket.tellercode ? ticket.tellercode : null,
    tn: ticket.tellername ? ticket.tellername : null,
    wd: ticket.waittime || ticket.waittime == 0 ? ticket.waittime : null,
    td: ticket.dealtime || ticket.dealtime == 0 ? ticket.dealtime : null,
    be: ticket.type ? ticket.type.toUpperCase() : null,
    action: ticket.action,
    es: ticket.endstatus ? ticket.endstatus : null,
    evs: ticket.action == 'EVALUATEREQUEST' || ticket.action == 'EVALUATERESULT' ? ticket.action : null,
    tion: ticket.ticketordernumber || ticket.ticketordernumber == 0 ? ticket.ticketordernumber : null,
    // ------票号信息->动作时间------//
    tit1: new Date(parseInt(ticket.tickettime, 10)),
    ct: ticket.calltime ? parseInt(ticket.calltime, 10) : null,
    ct1: ticket.calltime ? new Date(parseInt(ticket.calltime, 10)) : null,
    hut: ticket.hanguptime ? parseInt(ticket.hanguptime, 10) : null,
    hut1: ticket.hanguptime ? new Date(parseInt(ticket.hanguptime, 10)) : null,
    wt: ticket.welcometime ? parseInt(ticket.welcometime, 10) : null,
    eqt: ticket.evaluaterequesttime ? parseInt(ticket.evaluaterequesttime, 10) : null,
    ert: ticket.evaluateresulttime ? parseInt(ticket.evaluateresulttime, 10) : null,
    et: ticket.endtime ? parseInt(ticket.endtime, 10) : null,
    et1: ticket.endtime ? new Date(parseInt(ticket.endtime, 10)) : null,
    // ------票号信息->异常信息------//
    iv: !(isWaitAbnormal == true || isTranAbnormal == true),
    iwa: isWaitAbnormal,
    ita: isTranAbnormal,
    io: ticket.dealtime || ticket.dealtime == 0 ?
      (ticket.dealtime > officeConf.busiovertime * 60 * 1000) : null,
    io_cou: ticket.dealtime || ticket.dealtime == 0 ?
      (ticket.dealtime > officeConf.handleovertime_cou * 60 * 1000) : null,
    io_pro: ticket.dealtime || ticket.dealtime == 0 ?
      (ticket.dealtime > officeConf.handleovertime_pro * 60 * 1000) : null,
    io_city: ticket.dealtime || ticket.dealtime == 0 ?
      (ticket.dealtime > officeConf.handleovertime_city * 60 * 1000) : null,
    wo: ticket.waittime || ticket.waittime == 0 ?
      (ticket.waittime > officeConf.waitovertime * 60 * 1000) : null,
    wo_cou: ticket.waittime || ticket.waittime == 0 ?
      (ticket.waittime > officeConf.queueovertime_cou * 60 * 1000) : null,
    wo_pro: ticket.waittime || ticket.waittime == 0 ?
      (ticket.waittime > officeConf.queueovertime_pro * 60 * 1000) : null,
    wo_city: ticket.waittime || ticket.waittime == 0 ?
      (ticket.waittime > officeConf.queueovertime_city * 60 * 1000) : null,
    // ------票号信息->评价信息------//
    er: ticket.evaluateresult ? ticket.evaluateresult : null,
    // ------客户信息------//
    ci: ticket.customeridcard ? ticket.customeridcard : null,
    cit: ticket.customeridtype ? ticket.customeridtype : null,
    cin: ticket.customeridno ? ticket.customeridno : null,
    cn: ticket.customername ? ticket.customername : null,
    cl: ticket.customerlevel ? ticket.customerlevel : null,
    ivc: ticket.customerisvip ? ticket.customerisvip : null,
    cvl: ticket.customerviplevel ? ticket.customerviplevel : null,
    cs: ticket.customersex ? ticket.customersex : null,
    // ------预约信息------//
    iac: !!ticket.appointmentid,
    a_id: ticket.appointmentid ? ticket.appointmentid : null,
    // ------其他------//
    ut: date // 更新时间
  };
  const setOnInsertParams = {
    crt: date
  };
  const businessDetail = await BusinessDetail.findOneAndUpdate(matchParams, {
    $set: setParams,
    $setOnInsert: setOnInsertParams
  }, {
    upsert: true
  });
  return [businessDetail, businessDetail ? _.assign(_.clone(businessDetail._doc), setParams) :
    _.assign(matchParams, setParams, setOnInsertParams)
  ];
}

export async function saveOrUpdateForCloudEvaluate(cloudEvaluate) {
  const date = new Date().getTime();
  const setParams = {
    sn: cloudEvaluate.sn,
    sat: cloudEvaluate.sat,
    sen: cloudEvaluate.sen,
    sef: cloudEvaluate.sef,
    erc: cloudEvaluate.erc,
    ertc: cloudEvaluate.ertc,
    evsc: 'EVALUATERESULT',
    ut: date
  };
  const businessDetail = await BusinessDetail.findOneAndUpdate({
    o_id: cloudEvaluate.oid,
    tit: parseInt(cloudEvaluate.tit, 10),
    tiid: cloudEvaluate.tiid,
    eqt: {
      $ne: null
    },
    evsc: {
      $ne: 'EVALUATERESULT'
    }
  }, {
    $set: setParams
  });
  return [businessDetail, businessDetail ? _.assign(_.clone(businessDetail._doc), setParams) : null];
}

export async function validateForTicket(ticket) {
  // 不在需记录行为列表中
  if (!TICKET_ACTION_INDEX_MAP[ticket.action]) {
    return false;
  }
  const businessDetail = await BusinessDetail.findOne({
    o_id: ticket.officeid,
    tit: parseInt(ticket.tickettime, 10),
    tiid: ticket.ticketid
  });
  if (!businessDetail) {
    return true;
  }
  // 数据库记录中的行为在上报行为之后
  if (TICKET_ACTION_INDEX_MAP[businessDetail.action] >= TICKET_ACTION_INDEX_MAP[ticket.action]) {
    return false;
  }
  return true;
}
