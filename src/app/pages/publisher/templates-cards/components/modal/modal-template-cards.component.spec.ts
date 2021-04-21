import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalTemplateCardsComponent} from './modal-template-cards.component';

describe('ModalComponent', () => {
  let component: ModalTemplateCardsComponent;
  let fixture: ComponentFixture<ModalTemplateCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalTemplateCardsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTemplateCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
