import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderFooterViewControllerService {
  private showHeaderFooter = new BehaviorSubject<boolean>(true);
  showHeaderFooter$ = this.showHeaderFooter.asObservable();

  constructor(private location: Location) { }

  // TODO: Hace refactor, ésta función puede ser enificiente
  setShowHeaderFooter(show?: boolean): void {
    if (show !== null) {
      this.showHeaderFooter.next(this.location.path() !== '/login' && show);
    } else {
      this.showHeaderFooter.next(this.location.path() !== '/login');
    }
  }
}
