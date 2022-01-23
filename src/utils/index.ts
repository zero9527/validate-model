// 邮箱验证
const emailReg = /^\w+([a-z0-9A-Z-+._])*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
export function checkEmail(val: string) {
  return emailReg.test(val);
}

// 手机号码验证
const phoneReg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
export function checkPhone(val: string) {
  return phoneReg.test(val);
}

// 数字验证
export function checkNumber(val: number) {
  const parsedVal = val - 0;
  return typeof val === 'number' && parsedVal === parsedVal;
}

// 身份证号验证
const idCardReg = /^([1-9]{1})(\d{15}|\d{18})$/;
export function checkIdCard(val: string) {
  return idCardReg.test(val);
}

// 银行卡号验证
const bankCardReg = /^([1-9]{1})(\d{15}|\d{18})$/;
export function checkBankCard(val: string) {
  return bankCardReg.test(val);
}

// url验证
const urlReg = /^[A-Za-z]+:\/\/[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$/;
export function checkUrl(val: string) {
  return urlReg.test(val);
}

// ipv4验证
const ipv4Reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
export function checkIpv4(val: string) {
  return ipv4Reg.test(val);
}
