import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {THEME} from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherControllerService {
  private themeClass = new BehaviorSubject<THEME>('light-theme');

  constructor() {
    this.getSchemeSystem();
  }

  get themeClass$(): Observable<THEME> {
    return this.themeClass.asObservable();
  }

  set themeScheme(themeClass: THEME) {
    this.themeClass.next(themeClass);
    localStorage.setItem('AppTheme', themeClass);
  }

  getSchemeSystem() {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', (event) => {
      if (event.matches) {
        this.themeScheme = 'dark-theme';
      } else {
        this.themeScheme = 'light-theme';
      }
      alert('Se seteo el tema del sistema');
    });

    const appThemeUser: THEME | null = localStorage.getItem('AppTheme') as THEME;
    if (appThemeUser) {
      this.themeScheme = appThemeUser;
    }
  }
}
