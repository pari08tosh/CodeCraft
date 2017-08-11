import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEbookComponent } from './add-ebook.component';

describe('AddEbookComponent', () => {
  let component: AddEbookComponent;
  let fixture: ComponentFixture<AddEbookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEbookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
