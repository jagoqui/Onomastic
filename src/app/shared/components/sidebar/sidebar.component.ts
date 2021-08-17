import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AuthService} from '@adminShared/services/auth.service';

import {SidenavControllerService} from '@appShared/services';
import {AuthRes, DecodeToken} from '@adminShared/models/auth.model';
import SwAlert from "sweetalert2";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  opened = false;
  publisherLogged: DecodeToken;
  private destroy$ = new Subject<any>();

  constructor(
    private authSvc: AuthService,
    public sidenavController: SidenavControllerService
  ) {
  }

  get isAdmin(): boolean {
    return this.authSvc.isPublisherAdmin;
  }

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
    this.authSvc.authRes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userRes: AuthRes) => {
        if (userRes) {
          this.publisherLogged = this.authSvc.decodeToken(userRes.accessToken);
        }
      }, () => {
        SwAlert.showValidationMessage(
          'Error obteniendo publicador.');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
