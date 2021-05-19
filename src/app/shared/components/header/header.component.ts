import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '@adminShared/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeSwitcherControllerService } from '../../services/theme-switcher-controller.service';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color='primary' class='mat-elevation-z3 main-toolbar' *ngIf='isLogged'>
    <span>
      <button *ngIf='isLogged' mat-icon-button (click)='onToggleSidenav()'>
        <mat-icon>menu</mat-icon>
      </button>
      <button id='app-title' mat-raised-button color='primary' class='mat-display-2' [routerLink]="'/home'" title='Home'>Onomástico</button>
    </span>
      <span class='spacer'></span>
      <mat-slide-toggle [formControl]='toggleDarkThemeControl'>
        <mat-icon *ngIf='darkMode' class='mat-18'>brightness_4</mat-icon>
        <mat-icon *ngIf='!darkMode' class='mat-18'>brightness_7</mat-icon>
      </mat-slide-toggle>
    </mat-toolbar>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidenav = new EventEmitter<void>();

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
