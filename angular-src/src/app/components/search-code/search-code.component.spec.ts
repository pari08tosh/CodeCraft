import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCodeComponent } from './search-code.component';

describe('SearchCodeComponent', () => {
  let component: SearchCodeComponent;
  let fixture: ComponentFixture<SearchCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
