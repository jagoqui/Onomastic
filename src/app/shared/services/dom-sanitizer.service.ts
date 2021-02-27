import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DomSanitizerService {

  constructor(private sanitizer: DomSanitizer) { }

  sanitizeHTML(cardText: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(cardText);
  }
}
