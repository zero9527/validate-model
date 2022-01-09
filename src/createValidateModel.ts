import { baseKeyModel } from "./model/baseKeyModel";
import { BaseModel, BaseKey, ValidateModel } from "./types/index";

/**
 * 创建ValidateModel
 * @param customKeyModel 自定义校验字段规则
 * @param useBaseModelKey 使用内置的字段校验规则
 * @returns 
 */
export function createValidateModel<M extends Record<string, BaseModel<any>> = {}, K extends BaseKey = never>(
  customKeyModel: M, 
  useBaseModelKey: K[] = []
) {
  const injectModel = useBaseModelKey.reduce((acc, key) => ({ ...acc, [key]: baseKeyModel[key] }), {});
  return { ...injectModel, ...customKeyModel } as ValidateModel<M, K>;
}
