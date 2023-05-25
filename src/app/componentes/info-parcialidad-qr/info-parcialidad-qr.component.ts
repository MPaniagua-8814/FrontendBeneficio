import { Servicios } from './../../services/servicios.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';

@Component({
  selector: 'app-info-parcialidad-qr',
  templateUrl: './info-parcialidad-qr.component.html',
  styleUrls: ['./info-parcialidad-qr.component.scss']
})
export class InfoParcialidadQRComponent implements OnInit {


  title="Información de la Parcialidad"
  idCuenta=0;
  estadoActual:any;
  parcialidad: any;
  idParcialidad:any;
  transporte:any;
  transportista: any;

  constructor( private servicios: ServiciosAgricultor, private router: Router, private route: ActivatedRoute, private authService: AuthService) { }


  ngOnInit(): void {
    this.idCuenta = Number(this.route.snapshot.paramMap.get("idCuenta"));
    this.estadoActual = this.route.snapshot.paramMap.get("estadoActual");
    this.idParcialidad = this.route.snapshot.paramMap.get("idParcialidad");
    this.obtenerDatosParcialidad()

    //para validar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

  }


  regresar(){
    // this.router.
    location.href = 'bandeja-principal/detalle-pesaje/'+this.idCuenta+'/'+this.estadoActual

  }

  obtenerDatosParcialidad(){
     this.servicios.obtenerParcialidadPorId(this.idParcialidad).subscribe(
      resp =>{
        console.log("respuesta", resp)
        // this.transportistas = resp;
        this.parcialidad=  resp;
        this.transporte = this.parcialidad.idTransporte
        this.transportista = this.parcialidad.idTransportista
      }
    );
  }

  estado(estadoActual : any){

    return (estadoActual==true? 'Activo' : 'Inactivo')

  }

}
