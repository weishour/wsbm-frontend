import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class WsValidators {
  /**
   * 检查可选字段空值
   *
   * @param value
   */
  static isEmptyInputValue(value: any): boolean {
    return value == null || value.length === 0;
  }

  /**
   * 必须匹配验证器
   *
   * @param controlPath 点分隔的字符串值，定义到控件的路径.
   * @param matchingControlPath 以点分隔的字符串值，定义到匹配控件的路径.
   */
  static mustMatch(controlPath: string, matchingControlPath: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      // 获得控制和匹配控制
      const control = formGroup.get(controlPath);
      const matchingControl = formGroup.get(matchingControlPath);

      // 如果控件或匹配的控件不存在，则返回
      if (!control || !matchingControl) {
        return null;
      }

      // 删除mustMatch错误以重置匹配控件上的错误
      if (matchingControl.hasError('mustMatch')) {
        delete matchingControl.errors.mustMatch;
        matchingControl.updateValueAndValidity();
      }

      // 不要验证匹配控件上的空值
      // 不要验证值是否匹配
      if (
        this.isEmptyInputValue(matchingControl.value) ||
        control.value === matchingControl.value
      ) {
        return null;
      }

      // 准备验证错误
      const errors = { mustMatch: true };

      // 设置匹配控件上的验证错误
      matchingControl.setErrors(errors);

      // 返回错误
      return errors;
    };
  }
}
