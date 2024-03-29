import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '@adminShared/services/auth.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ThemeSwitcherControllerService} from '@appShared/services';
import {AnimationOptions} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';
import {THEME} from '@adminShared/models/shared.model';
import {PublisherService} from '@app/pages/admin/shared/services/publisher.service';
import SwAlert from 'sweetalert2';

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
        <mat-icon *ngIf="darkMode" class="mat-18"> dark_mode</mat-icon>
        <mat-icon *ngIf="!darkMode" class="mat-18"> light_mode</mat-icon>
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
    private themeSwitcherController: ThemeSwitcherControllerService,
    private publisherSvc: PublisherService
  ) {
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  ngOnInit(): void {
    this.themeSwitcherController.themeClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (theme: THEME) => {
          this.darkMode = theme === 'dark-theme';
          if (this.toggleDarkThemeControl.value !== this.darkMode) {
            this.toggleDarkThemeControl.setValue(this.darkMode);
          }
        }
      );

    this.toggleDarkThemeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((darkMode) => {
        this.darkMode = darkMode;
        this.themeSwitcherController.themeScheme = darkMode ? 'dark-theme' : 'light-theme';
      });

    //TODO: Se está tomando el cambio cuando se recarga la página, buscar manera de que se ejecute cada vez que haga
    // una petición, o el back debe validarlo en cada peticón
    // this.publisherSvc.getPublisherState(this.authSvc.publisherId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((state) => {
    //     if (state === 'INACTIVO') {
    //       SwAlert.fire({
    //         icon: 'error',
    //         title: ` El publicador fue desactivado!`
    //       }).then(_ => this.authSvc.logout());
    //     }
    //   }, () => {
    //     SwAlert.showValidationMessage('Error validando el estado del publicador.');
    //     this.authSvc.logout();
    //   });
  }

  ngOnChanges(changes: SimpleChanges) {
    const opened = changes.sidenavState.currentValue;

    if (opened) {
      this.animationItem?.playSegments([2, 16], true);
    } else {
      this.animationItem?.playSegments([52, 70], true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
