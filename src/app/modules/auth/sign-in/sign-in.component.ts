import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { wsAnimations } from '@ws/animations';
import { WsMessageService } from '@ws/services/message';
import { AuthService } from 'app/core/auth';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: wsAnimations,
})
export class AuthSignInComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm: NgForm;
  signInForm: FormGroup;

  /**
   * 构造函数
   */
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _wsMessageService: WsMessageService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 创建表单
    this.signInForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [this._authService.rememberMe],
    });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * 登录
   */
  signIn(): void {
    // 如果表单无效则返回
    if (this.signInForm.invalid) return;

    // 禁用表单
    this.signInForm.disable();

    // 登录
    this._authService.signIn(this.signInForm.value).subscribe({
      next: () => {
        // 设置重定向url
        const redirectURL =
          this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

        // 导航到重定向url
        this._router.navigateByUrl(redirectURL);
      },
      error: error => {
        this._wsMessageService.error(error);

        // 重新启用表单
        this.signInForm.enable();
      },
    });
  }

  /**
   * 关闭消息面板
   */
  openToast(): void {
    // this._wsMessageService.toast('error', 'Hello World!');
    // this._wsMessageService.toast('info', 'Hello World!');
    // this._wsMessageService.toast('loading', 'Hello World!');
    // this._wsMessageService.toast('show', 'Hello World!');
    // this._wsMessageService.toast('success', 'Hello World!');
    this._wsMessageService.toast('warning', '暂无接入!');
  }

  /**
   * 关闭消息面板
   */
  openToasta(): void {
    this._wsMessageService.notification('error', 'Hello World!', '通知内容');
    this._wsMessageService.notification('info', 'Hello World!', '通知内容');
    this._wsMessageService.notification('loading', 'Hello World!', '通知内容');
    this._wsMessageService.notification('show', 'Hello World!', '通知内容');
    this._wsMessageService.notification('success', 'Hello World!', '通知内容');
    this._wsMessageService.notification('warning', 'Hello World!', '通知内容');
  }
}
