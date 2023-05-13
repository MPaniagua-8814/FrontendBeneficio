import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-pesaje',
  templateUrl: './detalle-pesaje.component.html',
  styleUrls: ['./detalle-pesaje.component.scss']
})
export class DetallePesajeComponent implements OnInit {

  title = 'Detalle Cuenta'
  parcialidades : any= []
  idCuenta: any;
  estadoActual:any;
  //idEstadoNuevo:any;

  public formCuenta = new FormGroup({
    estadoActual: new FormControl(null),
    estadoNuevo: new FormControl(null, [Validators.required]),
    idCuenta: new FormControl(null),
  });

  constructor( private servicios: ServiciosAgricultor, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.idCuenta =  (this.route.snapshot.paramMap.get("idCuenta"));;
    this.estadoActual =  (this.route.snapshot.paramMap.get("estado"));;

    //this.parcialidades= this.servicios.obtenerParcialidadesPorIdPesaje(1);

    //aqui se va a consultar detalle (parcialidades) por cuenta
    this.servicios.obtenerParcialidadesPorIdPesaje(this.idCuenta).subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.parcialidades = resp;
    })

    // this.obtenerEstadoCuenta()

  }


  regresar(){
    location.href = 'bandeja-principal'
  }

  formValid(){
    return this.formCuenta.valid
  }

  actualizarEstadoCuenta(){
    
    this.servicios.actualizarEstadoBeneficio(Number(this.idCuenta), Number(this.formCuenta.controls.estadoNuevo.value));
    this.mensajeExito()
  }

  mensajeExito(){
    Swal.fire({
      title: "El cambio de estado se realizó con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se actualizó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
    });
  }

  resetear(form:string){
    if(form=='cuenta'){
      this.formCuenta.reset()
    }
    else{
      console.log("no se encontro el form")
    }
  }

}
