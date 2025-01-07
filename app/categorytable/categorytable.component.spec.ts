import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorytableComponent } from './categorytable.component';

describe('CategorytableComponent', () => {
  let component: CategorytableComponent;
  let fixture: ComponentFixture<CategorytableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorytableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorytableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
