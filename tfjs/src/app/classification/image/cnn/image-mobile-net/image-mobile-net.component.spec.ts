import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageMobileNetComponent } from './image-mobile-net.component';

describe('ImageMobileNetComponent', () => {
  let component: ImageMobileNetComponent;
  let fixture: ComponentFixture<ImageMobileNetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageMobileNetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageMobileNetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
