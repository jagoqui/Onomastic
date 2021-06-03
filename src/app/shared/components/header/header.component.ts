import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '@adminShared/services/auth.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ThemeSwitcherControllerService} from '../../services/theme-switcher-controller.service';
import {AnimationOptions} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z3 main-toolbar">
      <span>
        <button mat-icon-button (click)="onToggleSidenav()">
          <ng-lottie [options]="menu" (animationCreated)="animationCreated($event)"></ng-lottie>
        </button>
        <button id="app-title" mat-raised-button color="primary" class="mat-display-2" [routerLink]="'/PUBLISHER/help'"
                title="Home">
          Onomástico
        </button>
      </span>
      <span class="spacer"></span>
      <mat-slide-toggle [formControl]="toggleDarkThemeControl">
        <mat-icon *ngIf="darkMode" class="mat-18"> dark_mode </mat-icon>
        <mat-icon *ngIf="!darkMode" class="mat-18"> light_mode </mat-icon>
      </mat-slide-toggle>
    </mat-toolbar>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() sidenavState: boolean;
  @Output() toggleSidenav = new EventEmitter<void>();

  toggleDarkThemeControl = new FormControl(false);
  darkMode = false;

  menu: AnimationOptions = {
    path: 'assets/lotties/menu.json',
    autoplay: false,
    loop: false
  };
  private animationItem: AnimationItem;
  private destroy$ = new Subject<any>();

  constructor(
    private authSvc: AuthService,
    private themeSwitcher: ThemeSwitcherControllerService) {
    const appTheme = localStorage.getItem('AppTheme') || null;
    if (appTheme) {
      this.toggleDarkThemeControl.setValue(appTheme === 'dark-theme');
    }
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  ngOnInit(): void {
    const appTheme = localStorage.getItem('AppTheme') || null;
    if (appTheme) {
      this.darkMode = appTheme === 'dark-theme';
    }
    this.toggleDarkThemeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((darkMode) => {
        this.darkMode = darkMode;
        this.themeSwitcher.setThemeClass(darkMode ? 'dark-theme' : 'light-theme');
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    const opened = changes.sidenavState.currentValue;

    if (opened) {
      this.animationItem.playSegments([2, 16], true);
    } else {
      this.animationItem.playSegments([52, 70], true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
