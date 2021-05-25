import { OverlayContainer } from '@angular/cdk/overlay';
import { AfterViewInit, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@adminShared/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavControllerService } from '@appShared/services/sidenav-controller.service';
import { ThemeSwitcherControllerService } from '@appShared/services/theme-switcher-controller.service';
import { LoaderService } from '@appShared/services/loader.service';
import { ResponsiveService } from '@appShared/services/responsive.service';
import { SIZE } from '@adminShared/models/shared.model';


@Component({
  selector: 'app-root',
  template: `
    <mat-sidenav-container hasBackdrop='true' fullscreen (window:resize)='onResize()'>
      <mat-sidenav #sidenav mode='side' [(opened)]='opened' class='app-sidenav'>
        <mat-toolbar color='primary'>
          <span>Menu</span>
        </mat-toolbar>
        <app-sidebar></app-sidebar>
      </mat-sidenav>
      <mat-sidenav-content fxFlex fxLayout='column'>
        <app-header *ngIf='authSvc.isLogged$|async' (toggleSidenav)='sidenav.toggle()'></app-header>
        <main fxFlex fxLayout='column'>
          <ngx-spinner *ngIf='loaderSvc.isLoading$ | async'></ngx-spinner>
          <!--          <app-scroll></app-scroll>-->
          <router-outlet></router-outlet>
        </main>
        <footer>
          <app-footer></app-footer>
        </footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

  @HostBinding('class') className: string;

  opened = false;
  title = 'Onomastic';
  private destroy$ = new Subject<any>();

  constructor(
    private responsiveSvc: ResponsiveService,
    public authSvc: AuthService,
    private overlayContainer: OverlayContainer,
    private sidenavController: SidenavControllerService,
    private themeSwitcherController: ThemeSwitcherControllerService,
    private spinner: NgxSpinnerService,
    public loaderSvc: LoaderService
  ) {
  }

  onResize() {
    this.responsiveSvc.checkWidth();
  }

  onSetTheme(classTheme: string) {
    this.className = classTheme;
    this.overlayContainer.getContainerElement().classList.add(classTheme);

    if (classTheme === 'dark-theme') {
      this.overlayContainer.getContainerElement().classList.remove('light-theme');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.responsiveSvc.screenWidth$
        .pipe(takeUntil(this.destroy$))
        .subscribe((media) => {
        let size: SIZE = 'default';
        switch (media) {
          case 'xs' || 'sm':
            size = 'medium';
            break;
          case 'md' || 'lg':
            size = 'default';
            break;
          case 'xl':
            size = 'large';
            break;
        }
        this.spinner.show(undefined, {
          type: 'ball-triangle-path',
          size
        });

      });
    });
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
