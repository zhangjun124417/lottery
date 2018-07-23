import Model from '../models';

const SysConf = Model('SysConf');

export async function get(param) {
  const sysConf = await SysConf.findOne({});
  if (param) {
    return sysConf[param];
  }
  return sysConf;
}

export default {};
