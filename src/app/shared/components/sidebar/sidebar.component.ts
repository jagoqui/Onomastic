import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@adminShared/services/auth.service';

import { SidenavControllerService } from '../../services/sidenav-controller.service';
import { ThemeSwitcherControllerService } from '../../services/theme-switcher-controller.service';
import { AuthRes } from '@adminShared/models/auth.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  opened = false;
  platformUserData: AuthRes;
  private destroy$ = new Subject<any>();

  constructor(
    private authSvc: AuthService,
    public sidenavController: SidenavControllerService,
    private themeSwitcherController: ThemeSwitcherControllerService
  ) {
  }

  get isAdmin(): boolean {
    return this.authSvc.isPublisherAdmin;
  }

  onExit() {
    if (confirm('Está seguro que desea cerrar sesión')) {
      this.sidenavController.openSidebar(false);
      this.themeSwitcherController.setThemeClass('light-theme');
      this.authSvc.logout();
    }
  }

  ngOnInit(): void {
    this.sidenavController.sidebarOpened$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: boolean) => (this.opened = res)
      );
    this.authSvc.userResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userRes: AuthRes) => {
        if (userRes) {
          this.platformUserData = userRes;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
