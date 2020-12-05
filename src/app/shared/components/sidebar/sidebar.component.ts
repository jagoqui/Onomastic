import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

import {
  SidenavControllerService,
} from '../../services/sidenav-controller.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  opened = false;
  private destroy$ = new Subject<any>();

  constructor(
    private authSvc: AuthService,
    private sidenavController: SidenavControllerService
  ) { }

  onExit() {
    if (confirm('Está seguro que desea cerrar sesión')) {
      this.sidenavController.openSidebar(false);
      this.authSvc.logout();
    }
  }

  ngOnInit(): void {
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
