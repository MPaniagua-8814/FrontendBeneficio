import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoParcialidadQRComponent } from './info-parcialidad-qr.component';

describe('InfoParcialidadQRComponent', () => {
  let component: InfoParcialidadQRComponent;
  let fixture: ComponentFixture<InfoParcialidadQRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoParcialidadQRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoParcialidadQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
