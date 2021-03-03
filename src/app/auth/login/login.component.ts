import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ReCaptcha2Component} from 'ngx-captcha';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {BaseFormPlatformUsers} from 'src/app/shared/utils/base-form-platform-users';
import {environment} from 'src/environments/environment';

import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  hidePassword = true;
  recaptchaConfig = {
    siteKey: `${environment.recaptchaKey}`,
    size: 'normal',
    lang: 'es',
    theme: 'light',
    type: 'image',
    success: false
  };
  private subscription: Subscription = new Subscription();

  constructor(
    private authSvc: AuthService,
    private router: Router,
    public loginForm: BaseFormPlatformUsers,
    private spinner: NgxSpinnerService,
  ) {
    this.onResetCaptcha();
    this.recaptchaConfig.success = false;
  }

  onLogin(): void {
    const formValue = this.loginForm.baseForm.value;
    this.subscription.add(
      this.authSvc.login(formValue).subscribe(userRes => {
        if (userRes) {
          this.router.navigate(['/home']).then(r => console.log(r));
          this.loginForm.baseForm.reset();
        }
      })
    );
  }

  isValidForm(): boolean {
    return this.loginForm.baseForm.invalid && !this.recaptchaConfig.success;
  }

  checkField(field: string): boolean {
    return this.loginForm.isValidField(field);
  }

  handleResetRecaptcha() {
  }

  handleExpireRecaptcha() {
    this.recaptchaConfig.success = false;
  }

  handleLoadRecaptcha() {
  }

  handleSuccessRecaptcha() {
    this.recaptchaConfig.success = true;
  }

  handleErrorRecaptcha() {
  }

  ngOnInit(): void {
    this.spinner.show(undefined, {
      type: 'ball-triangle-path',
      size: 'medium'
    });

    this.loginForm.baseForm.get('name').setValidators(null);
    this.loginForm.baseForm.get('name').updateValueAndValidity();
    this.loginForm.baseForm.get('association').setValidators(null);
    this.loginForm.baseForm.get('association').updateValueAndValidity();
    this.loginForm.baseForm.get('role').setValidators(null);
    this.loginForm.baseForm.get('role').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onResetCaptcha(): void {
    this.captchaElem?.resetCaptcha();

  }

}
