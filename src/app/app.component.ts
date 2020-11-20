import { OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  SidenavControllerService,
} from './shared/services/sidenav-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @HostBinding('class') className = 'light-theme';

  opened = false;
  private destroy$ = new Subject<any>();
  onHeaderView: boolean;

  constructor(
    private overlayContainer: OverlayContainer,
    private sidenavController: SidenavControllerService,
    location: Location
  ) { this.onHeaderView = location.path() !== '/login' ? true : false; }

  onSetTheme(classTheme: string) {
    this.className = classTheme;
    if (classTheme === 'dark-theme') {
      this.overlayContainer.getContainerElement().classList.add(classTheme);
    } else {
      this.overlayContainer.getContainerElement().classList.remove(classTheme);
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