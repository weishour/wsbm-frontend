import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { wsAnimations } from '@ws/animations';
import { WsValidators } from '@ws/validators';
import { WsAlertType } from '@ws/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: wsAnimations,
})
export class AuthResetPasswordComponent implements OnInit {
  @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

  alert: { type: WsAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  resetPasswordForm: FormGroup;
  showAlert: boolean = false;

  /**
   * 构造函数
   */
  constructor(private _authService: AuthService, private _formBuilder: FormBuilder) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 创建表单
    this.resetPasswordForm = this._formBuilder.group(
      {
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
      },
      {
        validators: WsValidators.mustMatch('password', 'passwordConfirm'),
      },
    );
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 重置密码
   */
  resetPassword(): void {
    // 如果表单无效则返回
    if (this.resetPasswordForm.invalid) {
      return;
    }

    // 禁用表单
    this.resetPasswordForm.disable();

    // 隐藏警告提示
    this.showAlert = false;

    // 将请求发送到服务器
    this._authService
      .resetPassword(this.resetPasswordForm.get('password').value)
      .pipe(
        finalize(() => {
          // 重新启用表单
          this.resetPasswordForm.enable();

          // 重置表单
          this.resetPasswordNgForm.resetForm();

          // 显示警告提示
          this.showAlert = true;
        }),
      )
      .subscribe(
        response => {
          // 设置警告提示
          this.alert = {
            type: 'success',
            message: 'Your password has been reset.',
          };
        },
        response => {
          // 设置警告提示
          this.alert = {
            type: 'error',
            message: 'Something went wrong, please try again.',
          };
        },
      );
  }
}
