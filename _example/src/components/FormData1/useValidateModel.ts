import { baseKeyModel, BaseModel, createValidateModel } from '@zr/validate-model';

export type AddressValue = {
  province: string;
  city: string;
  area: string;
  detail: string;
};
type CurrentKeyModel = {
  name: BaseModel<string>;
  address: BaseModel<AddressValue>;
};

const currentKeyModel: CurrentKeyModel & Pick<typeof baseKeyModel, 'phone'> = {
  name: {
    errorText: '不能为空',
    required: true,
    validate(value) {
      if (!this.required && !value) return true;
      if (this.required && !value) {
        this.errorText = '不能为空!';
        return false;
      }
      if (value.length < 2) {
        this.errorText = '不能少于两个字!';
        return false;
      }
      return true;
    }
  },
  phone: {
    ...baseKeyModel.phone,
    required: true,
  },
  address: {
    errorText: '请填写完整的地址',
    validate(value) {
      if (!this.required && !value) return true;
      const { province, city, area, detail } = value;
      if (!province && !city && !area && !detail) {
        this.errorText = '请填写完整的地址!';
        return false;
      }
      if (!province) {
        this.errorText = '省份不能为空!';
        return false;
      }
      if (!city) {
        this.errorText = '城市不能为空!';
        return false;
      }
      if (!area) {
        this.errorText = '区县不能为空!';
        return false;
      }
      if (!detail) {
        this.errorText = '详细地址不能为空!';
        return false;
      }
      if (detail.length < 10) {
        this.errorText = '详细地址写多点吧，打十个!';
        return false;
      }
      return true;
    },
  },
};

/**
 * 字段校验规则
 */
export const validateModel = createValidateModel(currentKeyModel, ['phone', 'email']);
