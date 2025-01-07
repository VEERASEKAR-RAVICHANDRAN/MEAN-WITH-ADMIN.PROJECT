import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminordersComponent } from './adminorders.component';

describe('AdminordersComponent', () => {
  let component: AdminordersComponent;
  let fixture: ComponentFixture<AdminordersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminordersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
