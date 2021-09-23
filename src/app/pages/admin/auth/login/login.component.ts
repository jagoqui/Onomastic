import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ReCaptcha2Component} from 'ngx-captcha';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subject} from 'rxjs';
import {environment} from '@env/environment';

import {AuthService} from '@adminShared/services/auth.service';
import {BaseFormAuth} from '@adminShared/utils/base-form-auth';
import SwAlert from 'sweetalert2';
import {DOCUMENT} from '@angular/common';
import {AnimationOptions} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';
import {ThemeSwitcherControllerService} from '@appShared/services/theme-switcher-controller.service';
import {takeUntil} from 'rxjs/operators';
import {THEME} from '@adminShared/models/shared.model';
import {Auth} from '@adminShared/models/auth.model';

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

  private destroy$ = new Subject<any>();
  private animationItem: AnimationItem;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authSvc: AuthService,
    private router: Router,
    public loginForm: BaseFormAuth,
    private spinner: NgxSpinnerService,
    private themeSwitcherController: ThemeSwitcherControllerService
  ) {
    this.onResetCaptcha();
    this.recaptchaConfig.success = false;
  }

  onLogin(): void {
    const formValue: Auth = this.loginForm.baseForm.value;

    this.authSvc.login(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe(userRes => {
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
      });
  }

  isValidForm(): boolean {
    return this.loginForm.baseForm.invalid && !this.recaptchaConfig.success;
  }

  checkField(field: string): boolean {
    return this.loginForm.isValidField(field);
  }

  handleSuccessRecaptcha() {
    this.recaptchaConfig.success = true;
    //TODO: Obtener el token del recaptcha y enviarlo al back para validarlo, o probar con la versión 3 de recaptcha
    // this.loginForm.baseForm.patchValue({recaptchaKey: ''});
  }


  ngOnInit(): void {
    this.themeSwitcherController.themeClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (theme: THEME) => {
          this.recaptchaConfig = {
            ...this.recaptchaConfig,
            theme: theme === 'light-theme' ? 'light' : 'dark'
          };
        });

    this.spinner.show('spinner', {
      type: 'ball-triangle-path',
      size: 'medium'
    }).then();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private onResetCaptcha(): void {
    this.captchaElem?.resetCaptcha();
  }
}
