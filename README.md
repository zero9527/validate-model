# validate-model

表单等 `key/value` 数据校验

## 前言

form 表单的字段校验流程化，我是这么写的

## 下载

```
npm i @zr/validate-model
```

## 用法

### 前置

- 内置了常用的字段校验规则如`phone`/`email`等

- 提供了字段校验规则类型 `BaseModel<V>`

- 自定义 model 的实现应按照 `BaseModel<V>`

- 字段校验需要用到其他数据的时候，使用好 `BaseModel<V>` 的泛型 `V`，在 `validate` 方法就会有 `typescript` 的类型提示了

- 如果自定义的字段规则与引入的内部字段重复了，将会使用自定义的字段规则

- 字段校验的实现类型 `BaseModel`
  - `errorText` 即错误信息，可以在不同的校验规则下设置错误信息
  - `validate()` 方法返回一个布尔值：是否通过校验
  > `validate()` 方法建议**不要**使用箭头函数实现，如果内部需要根据不同情况设置`errorText`的话

> TODO: 类型提示截图

```ts
/**
 * 字段的基础校验model
 */
export type BaseModel<V = any> = {
  errorText: string;
  validate: (value: V) => boolean;
};
```

- 内置的字段校验 `baseKeyModel`

提供常用的字段校验如 `phone`/`email` 等（具体实现可以看目录 **内置的字段与校验规则**）

```ts
// 字段对应校验model
export type BaseKeyModel = {
  phone: BaseModel<number>;
  email: BaseModel<string>;
};
```

### 新建自定义 model

- 基于 `BaseModel` 定义当前的字段规则（`currentKeyModel`）；
  > `validate` 方法的参数定义好后，校验规则也可以自己实现，不管是本身内容的校验（**只传这个字段的值**），还是需要根据其他字段的多种校验（**传对象把所需要的其他数据与这个字段的值一起传入**），`value` 参数有 `typescript` 的类型提示

- 使用 `createValidateModel(currentKeyModel, ['phone', 'email'])` 方法创建自定义 model，其中：
  - 第一个参数 `currentKeyModel` 为自定义字段校验规则
  - 第二个参数 `['phone', 'email']` 为指定需要用的内置字段校验 model(有ts类型提示可以友好的食用)
  - 如下示例中，`validateModel` 可用的字段校验有 `name`/`address`/`phone`/`email`

- 调用字段的校验规则
  ```ts
  const validator = validateModel.name;
  const result = validator.validate(value);
  ``` 
  `result` 即校验结果，然后 `validatorName.errorText` 可以知道具体的错误信息（自定义model需要自行设置）


```ts
// _example/src/components/FormData1/useValidateModel.ts
import { BaseModel, createValidateModel } from '@zr/validate-model';

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

const currentKeyModel: CurrentKeyModel = {
  name: {
    errorText: '不能为空',
    validate(value) {
      if(!value) {
        this.errorText = '不能为空!';
        return false;
      }
      if(value.length < 2) {
        this.errorText = '不能少于两个字!';
        return false;
      }
      return true;
    }
  },
  address: {
    errorText: '请填写完整的地址',
    validate(value) {
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
```

## 实现细节

### 一些 typescript 类型

```ts
/**
 * 字段的基础校验model
 */
export type BaseModel<V = any> = {
  errorText: string;
  validate: (value: V) => boolean;
};

// 字段对应校验model
export type BaseKeyModel = {
  phone: BaseModel<number>;
  email: BaseModel<string>;
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

> **注意:** 自定义的字段与内置的字段一样的话会使用自定义的字段规则

字段列表：

- phone
- email

> TODO: 身份证号、银行卡号、url 等（？数字、中文、英文）

具体实现：

```ts
import { checkPhone, checkEmail } from '../utils/index';
import { BaseKeyModel } from '../types/index';

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
```

### 工具方法

```ts
// src/utils
export const emailReg = /^\w+([a-z0-9A-Z-+._])*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export const phoneReg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;

// 邮箱验证
export function checkEmail(val) {
  return emailReg.test(val);
}

// 手机号码验证
export function checkPhone(val) {
  return phoneReg.test(val);
}
```
