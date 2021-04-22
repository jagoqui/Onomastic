import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '@adminShared/services/auth.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Auth} from '@adminShared/models/auth.model';
import {ThemeSwitcherControllerService} from '../../services/theme-switcher-controller.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidenav = new EventEmitter<void>();

  platformUserData: Auth;
  toggleDarkThemeControl = new FormControl(false);
  darkMode = false;
  isLogged = false;
  private destroy$ = new Subject<any>();

  constructor(private authSvc: AuthService, private themeSwitcher: ThemeSwitcherControllerService) {
    const appTheme = localStorage.getItem('AppTheme') || null;
    if (appTheme) {
      this.toggleDarkThemeControl.setValue(appTheme === 'dark-theme');
    }
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  ngOnInit(): void {
    const appTheme = localStorage.getItem('AppTheme') || null;
    if (appTheme) {
      this.darkMode = appTheme === 'dark-theme';
    }
    this.authSvc.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLogged: boolean) => {
        if (isLogged) {
          this.isLogged = isLogged;
        }
      });

    this.authSvc.userResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userRes: Auth) => {
        if (userRes) {
          this.platformUserData = userRes;
        }
      });

    this.toggleDarkThemeControl.valueChanges.subscribe((darkMode) => {
      this.darkMode = darkMode;
      this.themeSwitcher.setThemeClass(darkMode ? 'dark-theme' : 'light-theme');
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
