import { checkPhone, checkEmail } from "../utils/index";
import { BaseKeyModel } from "../types/index";

/**
 * 内置的基础校验规则
 */
export const baseKeyModel: BaseKeyModel = {
  phone: {
    errorText: '请输入正确的手机号',
    validate(value) {
      if (!checkPhone(`${value}`)) return false;
      return true;
    },
  },
  email: {
    errorText: '请输入正确的邮箱',
    validate(value) {
      if (!value) {
        this.errorText = '不能为空';
        return false;
      }
      if (!checkEmail(value)) {
        this.errorText = '请输入正确的邮箱';
        return false;
      }
      return true;
    },
  },
};
