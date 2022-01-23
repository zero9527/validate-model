# validate-model

表单等 `key/value` 数据校验

## 前言

form 表单的字段校验流程化，`纯js`、不依赖 `ui组件库`

## 下载

```
npm i @zr/validate-model
```

## 用法

### 前置

- 内置了常用的字段校验规则如`phone`/`email`等，默认都为非必填

- 提供了字段校验规则类型 `BaseModel<V>`

- 复杂的校验情况下，字段校验需要用到其他数据的时候，使用好 `BaseModel<V>` 的泛型 `V`，`value` 参数就会有 `typescript` 的类型提示了；同步校验使用`validate(value)`，异步校验使用 `validateAsync()` 方法

- 如果自定义的字段规则与引入的内部字段重复了，将会使用自定义的字段规则

- 字段校验的实现类型 `BaseModel`

  - `errorText` 即错误信息，可以在不同的校验规则下设置错误信息
  - `required` 是否必填，进行空校验
  - `validate()` 方法返回一个 `boolean`：是否通过校验
  - `validateAsync()` 方法会返回一个 `Promise<boolean>`

  > `validate()/validateAsync()` 方法建议**不要**使用箭头函数实现，如果内部需要根据不同情况设置`errorText`的话

> TODO: 类型提示截图

```ts
/**
 * 字段的基础校验model
 */
export type BaseModel<V = any> = {
  errorText: string;
  required?: boolean;
  validate: (value: V) => boolean;
  validateAsync?: (value: V) => Promise<boolean>;
};
```

- 内置的字段校验 model `baseKeyModel`

提供常用的字段校验如 `phone`/`email` 等（具体实现可以看目录 **内置的字段与校验规则**）

```ts
// 字段对应校验model
export type BaseKeyModel = {
  phone: BaseModel<number>;
  email: BaseModel<string>;
  number: BaseModel<number>;
  url: BaseModel<string>;
  ip: BaseModel<string>;
  // idCard: BaseModel<string>;
  // bankCard: BaseModel<string>;
};
```

### 新建自定义 model

- 基于 `BaseModel` 定义当前的字段规则（`currentKeyModel`）；

  > `validate` 方法的参数定义好后，校验规则也可以自己实现，不管是本身内容的校验（**只传这个字段的值**），还是需要根据其他字段的多种校验（**传对象把所需要的其他数据与这个字段的值一起传入**），`value` 参数有 `typescript` 的类型提示

- 使用 `createValidateModel(currentKeyModel, ['phone', 'email'])` 方法创建自定义 model，其中：

  - 第一个参数 `currentKeyModel` 为自定义字段校验规则
  - 第二个参数 `['phone', 'email']` 为指定需要用的内置字段校验 model(有 ts 类型提示可以友好的食用)
  - 如下示例中，`validateModel` 可用的字段校验有 `name`/`address`/`phone`/`email`

- 调用字段的校验规则
  ```ts
  const validator = validateModel.name;
  const result = validator.validate(value);
  ```
  `result` 即校验结果，然后 `validator.errorText` 可以知道具体的错误信息（自定义 model 需要自行设置）

```ts
// _example/src/components/FormData1/useValidateModel.ts
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
    },
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
```

### 使用自定义 model

可以根据要求：

- 在内容 `onChange` 的时候（检验一个字段）
- 或者 `onSubmit` 提交的时候触发（校验所有字段）

```ts
// _example\src\components\FormData1\useFormData.ts
import { computed, nextTick, reactive } from 'vue';
import { AddressValue, validateModel } from './useValidateModel';

enum RadioType {
  ADDR = 1,
  ELEC = 2,
}
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
    address: { province: '', city: '', area: '', detail: '' },
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

  function onChange(
    key: Exclude<ValidateKey, 'address'>,
    event: Event & { target: HTMLInputElement }
  ) {
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
  };
}
```

## 实现细节

### 一些 typescript 类型

```ts
/**
 * 字段的基础校验model
 */
export type BaseModel<V = any> = {
  errorText: string;
  required?: boolean;
  validate: (value: V) => boolean;
  validateAsync?: (value: V) => Promise<boolean>;
};

// 字段对应校验model
export type BaseKeyModel = {
  phone: BaseModel<number>;
  email: BaseModel<string>;
  number: BaseModel<number>;
  url: BaseModel<string>;
  ip: BaseModel<string>;
  // idCard: BaseModel<string>;
  // bankCard: BaseModel<string>;
};

// 内置的基础的校验字段
export type BaseKey = keyof BaseKeyModel;

// 基础的字段校验类型
export type ValidateModel<
  M extends Record<string, BaseModel<any>> = {},
  K extends BaseKey = never
> = M & Pick<BaseKeyModel, K>;
```

### createValidateModel

```ts
import { baseKeyModel } from './model/baseKeyModel';
import { BaseModel, BaseKey, ValidateModel } from './types/index';

/**
 * 创建ValidateModel
 * @param customKeyModel 自定义校验字段规则
 * @param useBaseModelKey 使用内置的字段校验规则
 * @returns
 */
export function createValidateModel<
  M extends Record<string, BaseModel<any>> = {},
  K extends BaseKey = never
>(customKeyModel: M, useBaseModelKey: K[] = []) {
  const injectModel = useBaseModelKey.reduce(
    (acc, key) => ({ ...acc, [key]: baseKeyModel[key] }),
    {}
  );
  return { ...injectModel, ...customKeyModel } as ValidateModel<M, K>;
}
```

### 内置的字段与校验规则

在 `createValidateModel` 方法的第二那个参数传入即可，

> **注意:**
>
> - 内置的字段默认**非必填**，可以使用字段覆盖的方式（对应的`baseKeyModel`导出可供使用）
> - 自定义的字段与内置的字段一样的话会使用自定义的字段规则

字段列表：

- phone
- email
- number
- url
- ip

> TODO: 身份证号、银行卡号、等（？中文、英文）

具体实现：

```ts
// src\model\baseKeyModel.ts
import { checkPhone, checkEmail, checkNumber, checkIpv4, checkUrl } from '../utils/index';
import { BaseKeyModel } from '../types/index';

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
    },
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
    },
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
    },
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
    },
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
    },
  },
};
```

### 工具方法

```ts
// src/utils
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
const ipv4Reg =
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
export function checkIpv4(val: string) {
  return ipv4Reg.test(val);
}
```
