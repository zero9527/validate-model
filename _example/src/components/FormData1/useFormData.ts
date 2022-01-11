
import { computed, nextTick, reactive } from 'vue';
import { AddressValue, validateModel } from './useValidateModel';

enum RadioType { ADDR = 1, ELEC = 2 };
type BaseKey = 'radioType';
type ValidateKey = 'name' | 'phone' | 'email' | 'address';

/**
 * formData的数据处理
 * @returns 
 */
export function useFormData() {
  const errorTextMap = reactive<Record<ValidateKey, string>>({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const infoData = reactive({
    radioType: RadioType.ADDR,
    name: '',
    phone: '',
    email: '',
    address: { province: '', city: '',  area: '', detail: '' }
  });

  // 需要校验的字段
  const validateKeys = computed<ValidateKey[]>(() => {
    if (infoData.radioType === RadioType.ADDR) {
      return ['name', 'phone', 'address'];
    }
    return ['name', 'phone', 'email'];
  });

  // 需要提交的字段
  const submitKeys = computed<Array<BaseKey | ValidateKey>>(() => {
    return [...validateKeys.value, 'radioType'];
  });

  // 校验字段
  function validateParam(_validateKeys: Array<ValidateKey>) {
    let isPass = true;
    _validateKeys.forEach((key) => {
      const value = infoData[key];
      const validator = validateModel[key];
      // 特殊的校验规则
      if (validator) {
        // 因为不是直接调用某个字段的方法，所以需要as
        const result = validator.validate(value as never);
        errorTextMap[key] = result ? '' : validator.errorText;
        if (!result) isPass = false;
      }
      // 校验非空
      else if (value === '') {
        errorTextMap[key] = '不能为空';
        isPass = false;
      } else {
        errorTextMap[key] = '';
      }
    });
    return isPass;
  }

  function onChange(key: Exclude<ValidateKey, 'address'>, event: Event & { target: HTMLInputElement }) {
    infoData[key] = event.target.value;
    nextTick(() => validateParam([key]));
  }
  
  function onAddressChange(key: keyof AddressValue, event: Event & { target: HTMLInputElement }) {
    infoData.address[key] = event.target.value;
    nextTick(() => validateParam(['address']));
  }

  function onSubmit() {
    const isPass = validateParam(validateKeys.value);
    if (!isPass) return;
    console.log(submitKeys.value);
  }

  return {
    RadioType,
    errorTextMap,
    infoData,
    onChange,
    onAddressChange,
    onSubmit,
  }
}
