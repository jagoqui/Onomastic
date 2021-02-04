import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTempalteCardsComponent } from './modal-template-cards.component';

describe('ModalComponent', () => {
  let component: ModalTempalteCardsComponent;
  let fixture: ComponentFixture<ModalTempalteCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalTempalteCardsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTempalteCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
