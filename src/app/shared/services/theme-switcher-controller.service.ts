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

  private getSchemeSystem() {
    const schemeSystemEvent = window.matchMedia('(prefers-color-scheme: dark)');

    schemeSystemEvent.addEventListener('change', (event) => {
      this.themeScheme = event.matches? 'dark-theme':'light-theme';
      alert('Se seteo el tema del sistema');
    });

    const appThemeUser: THEME | null = localStorage.getItem('AppTheme') as THEME;
    if (appThemeUser) {
      this.themeScheme = appThemeUser;
    }else{
      this.themeScheme = schemeSystemEvent.matches? 'dark-theme':'light-theme';
    }

    window.addEventListener('beforeunload', () =>{
      if (!appThemeUser) {
        this.themeScheme = schemeSystemEvent.matches? 'dark-theme':'light-theme';
      }
    });
  }
}
