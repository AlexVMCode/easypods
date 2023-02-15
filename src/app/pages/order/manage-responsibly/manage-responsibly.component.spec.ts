import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageResponsiblyComponent } from './manage-responsibly.component';

describe('ManageResponsiblyComponent', () => {
  let component: ManageResponsiblyComponent;
  let fixture: ComponentFixture<ManageResponsiblyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageResponsiblyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageResponsiblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
