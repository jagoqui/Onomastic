import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MailUsersComponent} from './mail-users.component';

describe('UsersComponent', () => {
  let component: MailUsersComponent;
  let fixture: ComponentFixture<MailUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MailUsersComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
