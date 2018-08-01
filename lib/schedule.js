import scheduleJob from './services/schedule-job';

import log4jsConfig from './config/log4js';

import * as staticCtrl from './api-v1/statics/statics';

export default async function(config) {
  // 每天 01:00 日志清理
  await scheduleJob('0 0 1 * * *', `cleanLogs${config.ips.join('')}`, log4jsConfig.cleanLogs);
  await scheduleJob('*/25 * * * * *', 'staticLogspullfromlotterytrend', staticCtrl.createStatics);
  await scheduleJob('*/25 * * * * *', 'tokyoLogspullfromlotterytrend', staticCtrl.createTokyo);
}
