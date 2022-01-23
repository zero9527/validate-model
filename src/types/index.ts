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
