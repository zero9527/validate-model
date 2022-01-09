/**
 * 字段的基础校验model
 */
declare type BaseModel<V = any> = {
    errorText: string;
    validate: (value: V) => boolean;
};
declare type BaseKeyModel = {
    phone: BaseModel<number>;
    email: BaseModel<string>;
};
declare type BaseKey = keyof BaseKeyModel;
declare type ValidateModel<M extends Record<string, BaseModel<any>> = {}, K extends BaseKey = never> = M & Pick<BaseKeyModel, K>;

/**
 * 创建ValidateModel
 * @param customKeyModel 自定义校验字段规则
 * @param useBaseModelKey 使用内置的字段校验规则
 * @returns
 */
declare function createValidateModel<M extends Record<string, BaseModel<any>> = {}, K extends BaseKey = never>(customKeyModel: M, useBaseModelKey?: K[]): ValidateModel<M, K>;

export { BaseModel, createValidateModel };
