import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherControllerService {
  private themeClass = new BehaviorSubject<string>('light-theme');
  themeClass$ = this.themeClass.asObservable();

  setThemeClass(themeClass: string): void {
    this.themeClass.next(themeClass);
  }
}
