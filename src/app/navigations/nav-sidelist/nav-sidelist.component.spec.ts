import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSidelistComponent } from './nav-sidelist.component';

describe('NavSidelistComponent', () => {
  let component: NavSidelistComponent;
  let fixture: ComponentFixture<NavSidelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavSidelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSidelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
