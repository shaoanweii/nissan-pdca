import type { FieldRule } from '@arco-design/web-vue'

/**
 * 校验规则
 */
export function useFormRules() {
  /**
   * 生成默认必传rule
   * @param message
   * @param fieldRule
   */
  function createRequiredRule(message: string, fieldRule?: FieldRule) {
    return {
      required: true,
      message,
      ...fieldRule
    }
  }

  /**
   * 生成字符长度校验
   * @param field
   * @param minLen
   * @param maxLen
   * @param fieldRule
   */
  function createStrLengthRule(
    field: string,
    minLen: number,
    maxLen: number,
    fieldRule?: FieldRule
  ) {
    return {
      required: true,
      validator: (value: any, cb: (val?: any) => void) => {
        if (!value) {
          cb(`${field}必填`)
        }
        const strValue = value?.toString()
        if (strValue?.length < minLen || strValue?.length > maxLen) {
          if (minLen === 0) {
            cb(`${field}字符限制${maxLen}以内`)
          } else {
            cb(`${field}字符限制${minLen}-${maxLen}字符`)
          }
        }
      },
      ...fieldRule
    }
  }

  return {
    createRequiredRule,
    createStrLengthRule
  }
}
