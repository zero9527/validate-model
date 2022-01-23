import { checkPhone, checkEmail, checkNumber, checkIpv4, checkUrl } from "../utils/index";
import { BaseKeyModel } from "../types/index";

/**
 * 内置的基础校验规则
 */
export const baseKeyModel: BaseKeyModel = {
  phone: {
    errorText: '请输入正确的手机号',
    required: false,
    validate(value) {
      if (!this.required && !value) return true;
      if (this.required && !value) {
        this.errorText = '不能为空';
        return false;
      }
      if (!checkPhone(`${value}`)) {
        this.errorText = '请输入正确的手机号';
        return false;
      }
      return true;
    },
    validateAsync(value) {
      return new Promise<boolean>((resolve, reject) => {
        const res = this.validate(value);
        if (res) resolve(res);
        else reject(res);
      });
    }
  },
  email: {
    errorText: '请输入正确的邮箱',
    required: false,
    validate(value) {
      if (!this.required && !value) return true;
      if (this.required && !value) {
        this.errorText = '不能为空';
        return false;
      }
      if (!checkEmail(value)) {
        this.errorText = '请输入正确的邮箱';
        return false;
      }
      return true;
    },
    validateAsync(value) {
      return new Promise<boolean>((resolve, reject) => {
        const res = this.validate(value);
        if (res) resolve(res);
        else reject(res);
      });
    }
  },
  number: {
    errorText: '请输入数字',
    required: false,
    validate(value) {
      if (!this.required && !value) return true;
      if (this.required && !value) {
        this.errorText = '不能为空';
        return false;
      }
      if (!checkNumber(value)) {
        this.errorText = '请输入数字';
        return false;
      }
      return true;
    },
    validateAsync(value) {
      return new Promise<boolean>((resolve, reject) => {
        const res = this.validate(value);
        if (res) resolve(res);
        else reject(res);
      });
    }
  },
  ip: {
    errorText: '请输入正确的ip地址',
    required: false,
    validate(value) {
      if (!this.required && !value) return true;
      if (this.required && !value) {
        this.errorText = '不能为空';
        return false;
      }
      if (!checkIpv4(value)) {
        this.errorText = '请输入正确的ip地址';
        return false;
      }
      return true;
    },
    validateAsync(value) {
      return new Promise<boolean>((resolve, reject) => {
        const res = this.validate(value);
        if (res) resolve(res);
        else reject(res);
      });
    }
  },
  url: {
    errorText: '请输入正确的URL',
    required: false,
    validate(value) {
      if (!this.required && !value) return true;
      if (this.required && !value) {
        this.errorText = '不能为空';
        return false;
      }
      if (!checkUrl(value)) {
        this.errorText = '请输入正确的URL';
        return false;
      }
      return true;
    },
    validateAsync(value) {
      return new Promise<boolean>((resolve, reject) => {
        const res = this.validate(value);
        if (res) resolve(res);
        else reject(res);
      });
    }
  },
};
