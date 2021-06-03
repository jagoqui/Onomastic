import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {THEME} from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherControllerService {
  private themeClass = new BehaviorSubject<THEME>('light-theme');

  constructor() {
    let appTheme: THEME | null = localStorage.getItem('AppTheme') as THEME;
    if (appTheme) {
      this.themeClass.next(appTheme);
    }else{
      appTheme  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme': 'light-theme';
      this.themeClass.next(appTheme);
    }
  }

  get themeClass$(): Observable<THEME> {
    return this.themeClass.asObservable();
  }

  setThemeClass(themeClass: THEME): void {
    this.themeClass.next(themeClass);
    localStorage.setItem('AppTheme', themeClass);
  }
}
