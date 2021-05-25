import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherControllerService {
  private themeClass = new BehaviorSubject<string>('light-theme');

  constructor() {
    const appTheme = localStorage.getItem('AppTheme') || null;
    if (appTheme) {
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
