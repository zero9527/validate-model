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
