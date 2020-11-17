import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  constructor(private sidenavController: SidenavControllerService) { }

  onExit(): void {
    // this.authSvc.logout();
    this.sidenavController.openSidebar(false);
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
