import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaAvanzadaComponent } from './galeria-avanzada.component';

describe('GaleriaAvanzadaComponent', () => {
  let component: GaleriaAvanzadaComponent;
  let fixture: ComponentFixture<GaleriaAvanzadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GaleriaAvanzadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GaleriaAvanzadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
