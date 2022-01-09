export const emailReg = /^\w+([a-z0-9A-Z-+._])*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export const phoneReg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;

// 邮箱验证
export function checkEmail(val: string) {
  return emailReg.test(val);
}

// 手机号码验证
export function checkPhone(val: string) {
  return phoneReg.test(val);
}
