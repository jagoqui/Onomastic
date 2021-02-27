import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherControllerService {
  private themeClass = new BehaviorSubject<string>('light-theme');
  themeClass$ = this.themeClass.asObservable();

  constructor() {
    const AppTheme = localStorage.getItem('AppTheme') || null;
    if (AppTheme) {
      this.themeClass.next(AppTheme);
    }
  }

  setThemeClass(themeClass: string): void {
    this.themeClass.next(themeClass);
    localStorage.setItem('AppTheme', themeClass);
  }
}
