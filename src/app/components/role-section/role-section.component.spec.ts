import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSectionComponent } from './role-section.component';

describe('RoleSectionComponent', () => {
  let component: RoleSectionComponent;
  let fixture: ComponentFixture<RoleSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
