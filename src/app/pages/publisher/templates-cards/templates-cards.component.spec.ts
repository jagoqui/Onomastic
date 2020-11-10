import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesCardsComponent } from './templates-cards.component';

describe('TemplatesCardsComponent', () => {
  let component: TemplatesCardsComponent;
  let fixture: ComponentFixture<TemplatesCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatesCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
