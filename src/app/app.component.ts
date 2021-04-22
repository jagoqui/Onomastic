import {OverlayContainer} from '@angular/cdk/overlay';
import {AfterViewInit, Component, HostBinding, OnDestroy, OnInit,} from '@angular/core';
import {AuthService} from '@auth/services/auth.service';
import {LoaderService} from '@shared/services/control/loader.service';
import {SidenavControllerService,} from '@shared/services/control/sidenav-controller.service';
import {ThemeSwitcherControllerService,} from '@shared/services/control/theme-switcher-controller.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

  @HostBinding('class') className: string;

  opened = false;
  title = 'Onomastic';
  private destroy$ = new Subject<any>();

  constructor(
    public authSvc: AuthService,
    private overlayContainer: OverlayContainer,
    private sidenavController: SidenavControllerService,
    private themeSwitcherController: ThemeSwitcherControllerService,
    private spinner: NgxSpinnerService,
    public loaderSvc: LoaderService,
    private router: Router
  ) {
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
      this.spinner.show(undefined, {
        type: 'ball-triangle-path',
        size: 'medium'
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
