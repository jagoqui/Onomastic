import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ReCaptcha2Component} from 'ngx-captcha';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {environment} from '@env/environment';

import {AuthService} from '@adminShared/services/auth.service';
import {BaseFormAuth} from '@adminShared/utils/base-form-auth';
import SwAlert from 'sweetalert2';
import {DOCUMENT} from '@angular/common';
import {AnimationOptions} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';

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
  onScroll: AnimationOptions = {
    path: 'https://assets5.lottiefiles.com/packages/lf20_MbJfuz.json',
    // autoplay: false,
    // loop: false
  };
  private animationItem: AnimationItem;
  private subscription: Subscription = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authSvc: AuthService,
    private router: Router,
    public loginForm: BaseFormAuth,
    private spinner: NgxSpinnerService
  ) {
    this.onResetCaptcha();
    this.recaptchaConfig.success = false;
  }

  onLogin(): void {
    const formValue = this.loginForm.baseForm.value;
    this.subscription.add(
      this.authSvc.login(formValue).subscribe(userRes => {
        if (userRes) {
          if (this.authSvc.isPublisherAdmin) {
            this.router.navigate(['/ADMIN/publishers']).then();
          } else {
            this.router.navigate(['/PUBLISHER/mail-users']).then();
          }
          this.loginForm.baseForm.reset();
        }
      }, () => {
        SwAlert.showValidationMessage(
          'No se pudo iniciar sesion, verifique su email y contraseña.');
      })
    );
  }

  isValidForm(): boolean {
    return this.loginForm.baseForm.invalid && !this.recaptchaConfig.success;
  }

  checkField(field: string): boolean {
    return this.loginForm.isValidField(field);
  }


  handleExpireRecaptcha() {
    this.recaptchaConfig.success = false;
  }

  handleSuccessRecaptcha() {
    this.recaptchaConfig.success = true;
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
