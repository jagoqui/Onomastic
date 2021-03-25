import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalEventDayComponent} from './modal-event-day.component';

describe('ModalComponent', () => {
  let component: ModalEventDayComponent;
  let fixture: ComponentFixture<ModalEventDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalEventDayComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEventDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
