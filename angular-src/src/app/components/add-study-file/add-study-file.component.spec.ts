import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudyFileComponent } from './add-study-file.component';

describe('AddStudyFileComponent', () => {
  let component: AddStudyFileComponent;
  let fixture: ComponentFixture<AddStudyFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudyFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudyFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
