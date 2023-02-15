import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestChangeComponent } from './suggest-change.component';

describe('SuggestChangeComponent', () => {
  let component: SuggestChangeComponent;
  let fixture: ComponentFixture<SuggestChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
