import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PlatformUserResponse } from '../../models/platform-users.model';
import {
  ThemeSwitcherControllerService,
} from '../../services/theme-switcher-controller.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidenav = new EventEmitter<void>();

  platformUserData: PlatformUserResponse;
  toggleDarkThemeControl = new FormControl(false);
  darkMode = false;
  isLogged = false;
  private destroy$ = new Subject<any>();

  constructor(private authSvc: AuthService, private themeSwitcher: ThemeSwitcherControllerService) {
    const AppTheme = localStorage.getItem('AppTheme') || null;
    if (AppTheme) {
      this.toggleDarkThemeControl.setValue(AppTheme === 'dark-theme' ? true : false);
    }
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout() {
    this.authSvc.logout();
  }

  ngOnInit(): void {
    const AppTheme = localStorage.getItem('AppTheme') || null;
    if (AppTheme) {
      this.darkMode = AppTheme === 'dark-theme' ? true : false;
    }
    this.authSvc.isLoggged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLogged: boolean) => {
        if (isLogged) {
          this.isLogged = isLogged;
        }
      });

    this.authSvc.userResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userRes: PlatformUserResponse) => {
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

  }
}
