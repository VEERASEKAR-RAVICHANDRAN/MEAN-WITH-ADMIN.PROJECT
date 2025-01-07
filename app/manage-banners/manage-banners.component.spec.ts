import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBannersComponent } from './manage-banners.component';

describe('ManageBannersComponent', () => {
  let component: ManageBannersComponent;
  let fixture: ComponentFixture<ManageBannersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBannersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
