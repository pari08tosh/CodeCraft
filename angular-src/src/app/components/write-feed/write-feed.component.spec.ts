import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteFeedComponent } from './write-feed.component';

describe('WriteFeedComponent', () => {
  let component: WriteFeedComponent;
  let fixture: ComponentFixture<WriteFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
