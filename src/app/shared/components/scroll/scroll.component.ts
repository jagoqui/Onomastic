import { Component, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-scroll',
  template:`
    <div class="scroll-to-top" [ngClass]="{'show-scrollTop': windowScrolled}">
      <button (click)="scrollToTop()">
        <mat-icon color='primary'>keyboard_arrow_up</mat-icon>
      </button>
    </div>
  `,
  styleUrls: ['./scroll.component.scss']
})
export class ScrollComponent {
  windowScrolled: boolean;

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    (function smoothScroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothScroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }

}
