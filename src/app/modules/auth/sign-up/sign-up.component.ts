import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { wsAnimations } from '@ws/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: wsAnimations,
})
export class AuthSignUpComponent implements OnInit {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;
  signUpForm: FormGroup;

  /**
   * 构造函数
   */
  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 创建表单
    this.signUpForm = this._formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      agreements: [false, Validators.requiredTrue],
    });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 注册
   */
  signUp(): void {
    // 如果表单无效则返回
    if (this.signUpForm.invalid) return;

    // 禁用表单
    this.signUpForm.disable();

    // 注册
    this._authService.signUp(this.signUpForm.value).subscribe({
      next: () => {
        // 导航到登录页面
        this._router.navigateByUrl('/sign-in');
      },
      error: error => {
        // 重新启用表单
        this.signUpForm.enable();
      },
    });
  }
}
