import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  HeaderFooterViewControllerService,
} from 'src/app/shared/services/header-footer-view-controller.service';
import {
  BaseFormPlatformUsers,
} from 'src/app/shared/utils/base-form-platform-users';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  hidePassword = true;
  private subscripcion: Subscription = new Subscription();
  recaptchaConfig = {
    siteKey: `${environment.RECAPTCHA_KEY}`,
    size: 'Normal',
    lang: 'es',
    theme: 'Ligtht',
    type: 'Image',
    success: false
  };
  constructor(
    private router: Router,
    public loginForm: BaseFormPlatformUsers,
    private headerFooterViewController: HeaderFooterViewControllerService
  ) { }

  onLogin(): void {
    this.router.navigate(['/home']);
    // const formValue = this.loginForm.baseForm.value;
    // this.subscripcion.add(
    //   this.authSvc.login(formValue).subscribe(userRes => {
    //     if (userRes) {
    //       this.router.navigate(['']);
    //       this.loginForm.baseForm.reset();
    //     }
    //   })
    // );
  }

  isValidForm(): boolean {
    return this.loginForm.baseForm.invalid && !this.recaptchaConfig.success;
  }

  handleKeyDown(event: any) {
    if (event.keyCode === 'Enter') {
      this.onLogin();
      event.default();
    }
  }

  checkField(field: string): boolean {
    return this.loginForm.isValidField(field);
  }

  handleResetRecaptcha() { }

  handleExpireRecaptcha() { this.recaptchaConfig.success = false; }

  handleLoadRecaptcha() { }

  handleSuccessRecaptcha(event: any) {
    this.recaptchaConfig.success = true;
  }

  handleErrorRecaptcha() { }

  ngOnInit(): void {
    this.headerFooterViewController.setShowHeaderFooter();
    this.loginForm.baseForm.get('name').setValidators(null);
    this.loginForm.baseForm.get('name').updateValueAndValidity();
    this.loginForm.baseForm.get('email').setValidators(null);
    this.loginForm.baseForm.get('email').updateValueAndValidity();
    this.loginForm.baseForm.get('association').setValidators(null);
    this.loginForm.baseForm.get('association').updateValueAndValidity();
    this.loginForm.baseForm.get('role').setValidators(null);
    this.loginForm.baseForm.get('role').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.headerFooterViewController.setShowHeaderFooter(true);
    this.subscripcion.unsubscribe();
  }

}
