import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { wsAnimations } from '@ws/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user';
import { WsAlertType } from '@ws/components/alert';

@Component({
  selector: 'auth-unlock-session',
  templateUrl: './unlock-session.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: wsAnimations,
})
export class AuthUnlockSessionComponent implements OnInit {
  @ViewChild('unlockSessionNgForm') unlockSessionNgForm: NgForm;

  alert: { type: WsAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  name: string;
  showAlert: boolean = false;
  unlockSessionForm: FormGroup;
  private _email: string;

  /**
   * 构造函数
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _userService: UserService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // Get the user's name
    this._userService.user$.subscribe(user => {
      this.name = user.username;
      this._email = user.email;
    });

    // Create the form
    this.unlockSessionForm = this._formBuilder.group({
      name: [
        {
          value: this.name,
          disabled: true,
        },
      ],
      password: ['', Validators.required],
    });
  }

  // ----------------------------------------------------------------------------
  // @ 公共方法
  // ----------------------------------------------------------------------------

  /**
   * Unlock
   */
  unlock(): void {
    // Return if the form is invalid
    if (this.unlockSessionForm.invalid) {
      return;
    }

    // Disable the form
    this.unlockSessionForm.disable();

    // Hide the alert
    this.showAlert = false;

    this._authService
      .unlockSession({
        email: this._email ?? '',
        password: this.unlockSessionForm.get('password').value,
      })
      .subscribe(
        () => {
          // Set the redirect url.
          // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
          // to the correct page after a successful sign in. This way, that url can be set via
          // routing file and we don't have to touch here.
          const redirectURL =
            this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

          // Navigate to the redirect url
          this._router.navigateByUrl(redirectURL);
        },
        response => {
          // Re-enable the form
          this.unlockSessionForm.enable();

          // Reset the form
          this.unlockSessionNgForm.resetForm({
            name: {
              value: this.name,
              disabled: true,
            },
          });

          // Set the alert
          this.alert = {
            type: 'error',
            message: 'Invalid password',
          };

          // Show the alert
          this.showAlert = true;
        },
      );
  }
}
