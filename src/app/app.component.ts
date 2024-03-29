import {OverlayContainer} from '@angular/cdk/overlay';
import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {AuthService} from '@adminShared/services/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SidenavControllerService} from '@appShared/services/sidenav-controller.service';
import {ThemeSwitcherControllerService} from '@appShared/services/theme-switcher-controller.service';
import {LoaderService} from '@appShared/services/loader.service';
import {ResponsiveService} from '@appShared/services/responsive.service';
import {SIZE, THEME} from '@adminShared/models/shared.model';
import {AppModeService} from '@appShared/services/app-mode.service';


@Component({
  selector: 'app-root',
  template: `
    <app-header *ngIf="authSvc.isLogged$|async" (toggleSidenav)="sidenav.toggle()"
                [sidenavState]="sidenav.opened"></app-header>
    <mat-sidenav-container hasBackdrop="true" fullscreen (window:resize)="onResize()">
      <mat-sidenav #sidenav mode="over" [(opened)]="opened">
        <mat-toolbar color="primary">
          <span>Menu</span>
        </mat-toolbar>
        <app-sidebar></app-sidebar>
      </mat-sidenav>
      <mat-sidenav-content fxFlex fxLayout="column">
        <main fxFlex fxLayout="column">
          <ngx-spinner *ngIf="loaderSvc.isLoading$ | async"></ngx-spinner>
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
export class AppComponent implements OnInit, AfterContentChecked,AfterViewInit,OnDestroy {
  @HostBinding('class') className: THEME;
  globalListenFunc: { (): void; (): void };

  opened = false;
  title = 'Onomastic';
  private destroy$ = new Subject<any>();

  constructor(
    private changeDetRef: ChangeDetectorRef,
    private appModeSvc: AppModeService,
    private renderer: Renderer2,
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

  onSetTheme(classTheme: THEME) {
    this.overlayContainer.getContainerElement().classList.add(classTheme);
    this.overlayContainer.getContainerElement().classList.remove(this.className);
    this.className = classTheme;
  }

  ngAfterViewInit() {
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
          }).then();

        });
    });
  }

  ngAfterContentChecked(): void {
    this.changeDetRef.detectChanges();
  }

  ngOnInit(): void {
    this.globalListenFunc = this.renderer.listen('document', 'keydown.alt.l', () => {
      this.appModeSvc.mode = 'local';
    });
    this.globalListenFunc = this.renderer.listen('document', 'keydown.alt.t', () => {
      this.appModeSvc.mode = 'test';
    });
    this.globalListenFunc = this.renderer.listen('document', 'keydown.alt.p', () => {
      this.appModeSvc.mode = 'production';
    });

    this.themeSwitcherController.themeClass$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (theme: THEME) => (this.onSetTheme(theme))
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
    this.globalListenFunc();
  }
}
