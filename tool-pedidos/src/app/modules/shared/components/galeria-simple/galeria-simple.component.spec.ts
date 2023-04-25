import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaSimpleComponent } from './galeria-simple.component';

describe('GaleriaSimpleComponent', () => {
  let component: GaleriaSimpleComponent;
  let fixture: ComponentFixture<GaleriaSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaleriaSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GaleriaSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
