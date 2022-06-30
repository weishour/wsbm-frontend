import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, takeWhile, tap, timer } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'auth-sign-out',
  templateUrl: './sign-out.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AuthSignOutComponent implements OnInit {
  countdown: number = 5;
  countdownMapping: {
    [count: string]: string;
  };

  /**
   * 构造函数
   */
  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _translocoService: TranslocoService,
  ) {
    this.countdownMapping = {
      '=1': `# ${this._translocoService.translate('common.second')}`,
      'other': `# ${this._translocoService.translate('common.seconds')}`,
    };
  }

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 登出
    this._authService.signOut(false);

    // 倒计时后重新定向
    timer(1000, 1000)
      .pipe(
        finalize(() => {
          this._router.navigate(['sign-in']);
        }),
        takeWhile(() => this.countdown > 0),
        untilDestroyed(this),
        tap(() => this.countdown--),
      )
      .subscribe();
  }
}
