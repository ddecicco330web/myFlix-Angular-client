import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreInfoComponentComponent } from './genre-info-component.component';

describe('GenreInfoComponentComponent', () => {
  let component: GenreInfoComponentComponent;
  let fixture: ComponentFixture<GenreInfoComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenreInfoComponentComponent]
    });
    fixture = TestBed.createComponent(GenreInfoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
