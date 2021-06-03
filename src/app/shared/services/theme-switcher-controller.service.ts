import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {THEME} from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherControllerService {
  private themeClass = new BehaviorSubject<string>('light-theme');

  constructor() {
    let appTheme: THEME | null = localStorage.getItem('AppTheme') as THEME;
    if (appTheme) {
      this.themeClass.next(appTheme);
    }else{
      appTheme  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme': 'light-theme';
      this.themeClass.next(appTheme);
    }
  }

  get themeClass$() {
    return this.themeClass.asObservable();
  }

  setThemeClass(themeClass: string): void {
    this.themeClass.next(themeClass);
    localStorage.setItem('AppTheme', themeClass);
  }
}
