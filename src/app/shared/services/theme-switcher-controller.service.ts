import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherControllerService {
  themeClass = new BehaviorSubject<string>('light-theme');
  themeClass$ = this.themeClass.asObservable();

  constructor() {
    const appTheme = localStorage.getItem('AppTheme') || null;
    if (appTheme) {
      this.themeClass.next(appTheme);
    }
  }

  setThemeClass(themeClass: string): void {
    this.themeClass.next(themeClass);
    localStorage.setItem('AppTheme', themeClass);
  }
}
