import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrParcialidadComponent } from './qr-parcialidad.component';

describe('QrParcialidadComponent', () => {
  let component: QrParcialidadComponent;
  let fixture: ComponentFixture<QrParcialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrParcialidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrParcialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
