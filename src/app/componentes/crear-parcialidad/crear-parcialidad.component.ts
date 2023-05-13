import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-parcialidad',
  templateUrl: './crear-parcialidad.component.html',
  styleUrls: ['./crear-parcialidad.component.scss']
})
export class CrearParcialidadComponent implements OnInit {

  title= "Crear parcialidad";
  //title= "Prueba";

  transportes: any = [{idTransporte:"No existen transportes registrados"}];
  transportistas: any = [{nombre:"No existen transportistas registrados."}];
  idPesaje : any;


  public formDatosParcialidad = new FormGroup({
    transporte: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
    transportista: new FormControl(null, Validators.required),
    //nitAgricultor: new FormControl(null, Validators.required),
    peso: new FormControl(null, [Validators.required, Validators.min(1)])
  });


  constructor(private servicios: ServiciosAgricultor, private router: Router, private route: ActivatedRoute,) { }


  ngOnInit(): void {

    this.idPesaje =  (this.route.snapshot.paramMap.get("idCuenta"));;
    this.obtenerTransportistas();
    this.obtenerTransportes();
  }

  regresar(){

    location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje
  }

  obtenerTransportistas(){
    /*let consulta:any = this.servicios.obtenerTransportistas('nitAgricultor');
    if (consulta?.length>0) {
      this.transportistas = consulta;
    }*/

    let consulta : any= this.servicios.obtenerTransportistas('nitAgricultor').subscribe(
      resp =>{
        console.log("transportistas", resp)
        this.transportistas = resp;
        return resp;
      }
    );

  }

  obtenerTransportes(){
    let consulta : any= this.servicios.obtenerTransportes('nitAgricultor').subscribe(
      resp =>{
        console.log("transportes", resp)
        this.transportes = resp;
        return resp;
      }
    );
    ///console.log("consulta transportees === " , consulta)
    /*if (consulta?.length>0){
      this.transportes = consulta;
    }*/

  }

  crearParcialidad(){

    let datos = {
      // "idParcialidad": 0,
      "idCuenta": this.idPesaje,
      "idTransporte": this.formDatosParcialidad.controls.transporte.value,
      "idTransportista": this.formDatosParcialidad.controls.transporte.value,
      "fechaRecepcionParcialidad": new Date().toISOString(),
      "pesoEnviado": this.formDatosParcialidad.controls.peso.value,
      "pesoBascula": 0,
      "diferenciaPeso": 0,
      "fechaPesoBascula": new Date().toISOString()
    }

    console.log("datos a enviar al servicio post ==== " , datos)
    this.servicios.crearParcialidades( datos );
    this.mensajeExito()
  }

  formValid(){
    console.log("valido peso==== " , this.formDatosParcialidad.controls.peso.valid)
    console.log("valido transporte==== " , this.formDatosParcialidad.controls.transporte.valid)
    console.log("valido transportista==== " , this.formDatosParcialidad.controls.transportista.valid)
    return true
    //return this.formDatosParcialidad.valid
  }

  mensajeExito(){
    Swal.fire({
      title: "La parcialidad se ha creado con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se creó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje
    });
    //location.href = environment.RUTA_BASE + 'bandeja-solicitudes';
  }

}
