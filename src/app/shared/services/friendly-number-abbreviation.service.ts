import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendlyNumberAbbreviationService {

  getFriendlyFormat(numData: number): string {
    let x: number = ('' + numData).length;
    const p = Math.pow;
    const dec = p(10, 2);
    x -= x % 3;
    return Math.round(numData * dec / p(10, x)) / dec + ' kMGTPE'[x / 3];
  }
}
