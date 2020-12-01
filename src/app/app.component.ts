import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from './auth/services/auth.service';
import {
  SidenavControllerService,
} from './shared/services/sidenav-controller.service';
import {
  ThemeSwitcherControllerService,
} from './shared/services/theme-switcher-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @HostBinding('class') className = 'light-theme';

  opened = false;
  private destroy$ = new Subject<any>();

  constructor(
    public authSvc: AuthService,
    private overlayContainer: OverlayContainer,
    private sidenavController: SidenavControllerService,
    private themeSwitcherController: ThemeSwitcherControllerService
  ) { }

  onSetTheme(classTheme: string) {
    this.className = classTheme;
    this.overlayContainer.getContainerElement().classList.add(classTheme);

    if (classTheme === 'dark-theme') {
      this.overlayContainer.getContainerElement().classList.remove('ligth-theme');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    }
  }

  ngOnInit(): void {

    this.themeSwitcherController.themeClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (theme: string) => (this.onSetTheme(theme))
      );
    this.sidenavController.sidebarOpened$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: boolean) => (this.opened = res)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
