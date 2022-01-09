# validate-model

表单等 `key/value` 数据校验

## 前言

form 表单的字段校验流程化，我就这么写

## 下载

```
npm i @zr/validate-model
```

## 看看用法

在开始前先了解下，

- 内置了常用的字段校验规则如`phone`/`email`等
- 提供了字段校验规则类型 `BaseModel<V>`
- 自定义 model 的实现应按照 `BaseModel<V>`
- 内置的字段校验可以被覆盖

### 前置

- 字段校验的实现类型 `BaseModel`
  - `errorText` 即错误信息，可以在不同的校验规则下设置错误信息
  - `validate()` 方法返回一个布尔值：是否通过校验

> `validate()` 方法建议**不要**使用箭头函数实现，如果内部需要根据不同情况设置`errorText`的话

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

提供常用的字段校验如 `phone`/`email` 等，自定义 model 可参考如下列出`phone`的校验规则实现（更多的往下翻翻）

```ts
// src\model\baseKeyModel.ts
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
  // ...
};
```

### 新建自定义 model

- 基于 `BaseModel` 定义当前的字段规则（`currentKeyModel`）
- 使用 `createValidateModel` 方法创建自定义 model
- 将 `currentKeyModel` 作为第一个参数，第二个参数可以指定需要用的内置字段校验 model
- `createValidateModel` 方法的返回值即包含**当前字段与指定内置字段**的校验规则的一个对象，暴露出去给外面使用

```ts
import { BaseModel, createValidateModel } from '@zr/validate-model';

type AddressValue = {
  province: string;
  city: string;
  area: string;
  detail: string;
};
type CurrentKeyModel = {
  address: BaseModel<AddressValue>;
};

const currentKeyModel: CurrentKeyModel = {
  address: {
    errorText: '请填写完整的地址',
    validate(value) {
      const { province, city, area, detail } = value;
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
export const validateModel = createValidateModel<CurrentKeyModel>(currentKeyModel, ['phone']);
```

### 使用自定义 model

> TODO：使用真实例子的代码实现

字段校验之后需要在界面上显示，一些简单数据可参考：

```js
// 错误信息
errorTextMap = { address: '', phone: '', email: '' };

// form表单数据
infoData = {
  address: { province: '', city: '', area: '', detail: '' },
  phone: '',
  email: '',
};
```

可以根据要求：

- 在内容 `onChange` 的时候（检验一个字段）
- 或者 `onSubmit` 提交的时候触发（校验所有字段）

```ts
// 校验字段
function validateParam(validateKeys: string[]) {
  let isPass = true;
  validateKeys.forEach((key) => {
    const value = infoData[key];
    const validator = validateModel[key];
    // 特殊的校验规则
    if (validator) {
      const result = validator.validate(value);
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

// 单个变化
function onChange(key: string, value: string) {
  infoData[key] = value;
  validateParam([key]);
}

// 点击提交
function onSubmit() {
  const validateKeys = ['phone', 'email', 'address'];
  const isPass = validateParam(validateKeys);
  if (!isPass) return;
  // ...
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

### 内置的字段校验

前面已经说了一部分了，这里全部的都说一下

> 在 `createValidateModel` 方法的第二那个参数传入即可

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
