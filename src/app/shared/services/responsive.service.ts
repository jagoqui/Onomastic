import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject, Observable } from 'rxjs';
import { MEDIA } from '@adminShared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  @Output() media: EventEmitter<MEDIA> = new EventEmitter(null);

  private screenWidth =  new BehaviorSubject<MEDIA>(null);

  constructor() {
    this.checkWidth();
  }

  get screenWidth$(): Observable<MEDIA> {
    return this.screenWidth.asObservable();
  }

  checkWidth() {
    const width = window.innerWidth;

    if (width <= 599) {
      this.media.emit('xs');
      this.setWidth('xs');
    } else if (width > 600 && width <= 959) {
      this.media.emit('sm');
      this.setWidth('sm');
    }else if (width > 960 && width <= 1279) {
      this.media.emit('md');
      this.setWidth('md');
    }else if (width > 1280 && width <= 1919) {
      this.media.emit('lg');
      this.setWidth('lg');
    }else{
      this.media.emit('lg');
      this.setWidth('xl');
    }
  }

  private setWidth(media: MEDIA) {
    this.screenWidth.next(media);
  }

}
