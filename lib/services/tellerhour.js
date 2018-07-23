import _ from 'lodash';
import moment from 'moment';
import Model from '../models';

const TellerHour = Model('TellerHour');

async function saveOrUpdateForTicketImpl(businessDetail, isRollback) {
  const date = new Date().getTime();
  const hourStart = moment(businessDetail.tit).startOf('hour').toDate();
  const incParams = {
    ac: 1,
    od: 0
  };
  if (businessDetail.es == 'DONE') {
    if (businessDetail.iv) {
      incParams.cc = 1;
      incParams.wd = businessDetail.wd;
      incParams.td = businessDetail.td;
      incParams.ioc = businessDetail.io ? 1 : 0;
      incParams.ioc_cou = businessDetail.io_cou ? 1 : 0;
      incParams.ioc_pro = businessDetail.io_pro ? 1 : 0;
      incParams.ioc_city = businessDetail.io_city ? 1 : 0;
      incParams.woc = businessDetail.wo ? 1 : 0;
      incParams.woc_cou = businessDetail.wo_cou ? 1 : 0;
      incParams.woc_pro = businessDetail.wo_pro ? 1 : 0;
      incParams.woc_city = businessDetail.wo_city ? 1 : 0;
      if (!businessDetail.evs) {
        incParams.nac = 1; // 未请求评价数
      } else if (businessDetail.ert) { // 有评价
        if (businessDetail.er == 1) {
          incParams.nsc = 1; // 不满意数
        } else if (businessDetail.er == 3) {
          incParams.sc = 1; // 满意数
        } else if (businessDetail.er == 5) {
          incParams.gsc = 1; // 非常满意数
        }
      } else {
        incParams.nec = 1;
        incParams.netc = 1;
        if (businessDetail.evsc) {
          if (businessDetail.erc == 1) {
            incParams.nscc = 1; // 不满意数
          } else if (businessDetail.erc == 3) {
            incParams.scc = 1; // 满意数
          } else if (businessDetail.erc == 5) {
            incParams.gscc = 1; // 非常满意数
          }
          incParams.netc -= 1;
        } else if (businessDetail.be != 'LOCAL') {
          incParams.necc = 1;
        }
        if (businessDetail.be != 'LOCAL') {
          incParams.aevcc = 1;
        }
      }
      if (businessDetail.be != 'LOCAL') {
        incParams.aecc = 1;
      }
    } else {
      incParams.rc = 1;
    }
  } else {
    incParams.dc = 1;
  }
  if (isRollback) {
    for (const i in incParams) {
      if (Object.prototype.hasOwnProperty.call(incParams, i)) {
        incParams[i] = -incParams[i];
      }
    }
  }
  await TellerHour.update(_.assign({
    d1: hourStart.getTime()
  }, _.pick(businessDetail, ['p', 'c', 'o_id', 'tc'])), {
    $set: {
      o: businessDetail.o,
      tn: businessDetail.tn,
      ut: date
    },
    $inc: incParams,
    $setOnInsert: {
      crt: date,
      d: hourStart
    }
  }, {
    upsert: true
  });
}

export async function saveOrUpdateForTicket(businessDetails) {
  if (businessDetails[0]) {
    await saveOrUpdateForTicketImpl(businessDetails[0], true);
  }
  await saveOrUpdateForTicketImpl(businessDetails[1]);
}

export async function saveOrUpdateForTellerOnline(tellerOnline) {
  const date = new Date().getTime();
  const logoutTime = tellerOnline.ot;
  let hourStart = moment(tellerOnline.it).startOf('hour').toDate().getTime();
  let nextHourStart = hourStart + 60 * 60 * 1000;
  let startTime = tellerOnline.it;
  const incParams = {};
  while (startTime < logoutTime) {
    incParams.od = logoutTime > nextHourStart ? nextHourStart - startTime : logoutTime - startTime;
    await TellerHour.update(_.assign({
      d1: hourStart
    }, _.pick(tellerOnline, ['p', 'c', 'o_id', 'tc'])), {
      $set: {
        o: tellerOnline.o,
        tn: tellerOnline.tn,
        ut: date
      },
      $inc: incParams,
      $setOnInsert: {
        crt: date,
        d: new Date(hourStart)
      }
    }, {
      upsert: true
    });
    startTime = hourStart = nextHourStart;
    nextHourStart = hourStart + 60 * 60 * 1000;
  }
}
