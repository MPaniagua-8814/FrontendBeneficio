import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bandeja-principal',
  templateUrl: './bandeja-principal.component.html',
  styleUrls: ['./bandeja-principal.component.scss']
})
export class BandejaPrincipalComponent implements OnInit {

  title = 'Bandeja Principal'
  pesajes : any= []
  transportes: any=[]
  transportistas: any=[]
  tab1 = true;
  tab2 = false;
  tab3 = false;
  nitTemporal = "99671395";
  idTransporteActualizar = '';
  idTransportistaActualizar = 0;

  public formDatosPesaje = new FormGroup({
    // idEstado: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
    estado: new FormControl(null),
    peso: new FormControl(null, [Validators.required]),
    tipoMercancia: new FormControl(null, Validators.required)
  });

  public formDatosTransporte = new FormGroup({
    placa: new FormControl(null),
    estado: new FormControl(null, [Validators.required]),
    observaciones: new FormControl(null, [Validators.required]),
  });

  public formDatosTransportista = new FormGroup({
    cui: new FormControl(null),
    // idTransporte: new FormControl(null, [Validators.required]),
    // nombre: new FormControl(null, [Validators.required]),
    estado: new FormControl(null, [Validators.required]),
    observaciones: new FormControl(null, [Validators.required]),
  });

  

  constructor( private servicios: ServiciosAgricultor, private router: Router) { }

  ngOnInit(): void {
   
    //aqui se va a consultar pesajes por agricultor
    this.servicios.obtenerPesajesPorNit(0).subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.pesajes = resp;
    })
    
    this.obtenerTransportes()
    this.obtenerTransportistas()

  }

  mostrar(tab:string){
    let a = document.getElementById("pesajes")?.className;
    let b = document.getElementById("transportes")?.className;
    let c = document.getElementById("transportistas")?.className;

    if(tab == 'pesajes'){
      console.log("tab 1")
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;

      a += " active";
      b = document.getElementById("transportes")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )
      c = document.getElementById("transportistas")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )

    }
    else if(tab == 'transportes'){
      console.log("tab 2")
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;

      b += " active";
      a = document.getElementById("transportes")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )
      c = document.getElementById("transportistas")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )

    }
    else if(tab == 'transportistas'){
      console.log("tab 3")
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;

      c += " active";
      a = document.getElementById("transportes")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )
      b = document.getElementById("transportistas")?.className.replace( /(?:^|\s)active(?!\S)/g , '' )

    }

  }

  crearPesaje(){
    let data = { 
      "nitAgricultor": "99671395",
      "idCuenta": 4, 
      "idPesaje": 1,
      "idEstado": 0, //this.formDatosPesaje.controls.estado.value,
      //"fechaCreacion": new Date().toISOString(),

      //para enviar tipo mercancia (crear campo en bd)
      //"tipoMercancia": this.formDatosPesaje.controls.tipoMercancia.value, 

      "pesoEnviado": this.formDatosPesaje.controls.peso.value,
      "pesoTotalObtenido": 0,  //este dato se llena con  lo de peso cabal
      "diferenciaTotal": 0  //este dato se llena con lo de peso cabal
    }

    console.log("datos a enviar al servicio post ==== " , data)
    this.mensajeExito()
    this.servicios.crearPesaje(data);
  }

  formValid(){
    return this.formDatosPesaje.valid
  }

  formValidTransporte(){
    return this.formDatosTransporte.valid
  }

  formValidTransportista(){
    return this.formDatosTransportista.valid
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
      location.href = 'bandeja-principal'
      // location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje
    });
    //location.href = environment.RUTA_BASE + 'bandeja-solicitudes';
  }

  obtenerCantidadParcialidades( idCuenta: number){
//     console.log("id Cuenta enviado === " , idCuenta)
//     //let parcialidades = //this.servicios.obtenerParcialidadesPorIdPesaje(idCuenta).subscribe
//     let parcialidades ;
//     console.log("parcialidades = " , parcialidades)
//     //return parcialidades.length
// //return parcialidades
  }

  formatoFecha( fecha: Date){
    let f2 = (fecha.toString().split('T'))[0].split('-');
    return (f2[2]+'-'+ f2[1]+ '-' + f2[0])
  }

  contarParcialidades(idCuenta: number){
    let parcialidades = this.servicios.obtenerParcialidadesPorIdPesaje(idCuenta).subscribe;
    return parcialidades.length
  }


  obtenerTransportes(){
    let consulta : any= this.servicios.obtenerTransportes(this.nitTemporal).subscribe(
      resp =>{
        console.log("transportes", resp)
        this.transportes = resp;
        return resp;
      }
    );
  }

  obtenerTransportistas(){
    let consulta : any= this.servicios.obtenerTransportistas(this.nitTemporal).subscribe(
      resp =>{
        console.log("transportistas", resp)
        this.transportistas = resp;
        return resp;
      }
    );
  }

  estado(dato:any){
    console.log("dato == " , dato)
    if (dato){
      return "Activo"
    }
    else{
      return "Inactivo"
    }
  }


  cambiarEstado(form:string){   //
    if(form=='transporte'){
      let estado = (this.formDatosTransporte.controls.estado.value =='1' ) ? true: false;
      let variables = {
        "activo": estado,
        "observaciones" : this.formDatosTransporte.controls.observaciones.value,
        "usuarioModifico": "localhost"
      }
      this.servicios.actualizarTransporte(this.idTransporteActualizar, variables).subscribe(
        resp => {
          console.log("actualizar transporte ===== " , resp);
        }
        )
        this.mensajeExitoTransporte();
    }else if(form=='transportista'){
      let estado = (this.formDatosTransportista.controls.estado.value =='1' ) ? true: false;

      let variables = {
        "activo": estado,
        "observaciones" : this.formDatosTransportista.controls.observaciones.value,
        "usuarioModifico": "localhost"
      }

      console.log("variables === " , variables)

      this.servicios.actualizarTransportista(this.idTransportistaActualizar, variables).subscribe(
        resp => {
          console.log("actualizar transportista ===== " , resp);
        }
        )
        this.mensajeExitoTransportista();
    }
  }

  asignarIdTransporte(placa:string){
    this.idTransporteActualizar = placa;
    console.log("placa === " , this.idTransporteActualizar)
  }

  asignarIdTransportista(cui:number){
    this.idTransportistaActualizar = cui;
    console.log("cui === " , this.idTransportistaActualizar)
  }

  resetear(form:string){
    if(form=='transporte'){
      this.formDatosTransporte.reset()
    }else if(form=='transportista'){
      this.formDatosTransportista.reset()
    }
  }

  mensajeExitoTransporte(){
    Swal.fire({
      title: "El estado del transporte se actualizó con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se actualizó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
    });
  }

  mensajeExitoTransportista(){
    Swal.fire({
      title: "El estado del transportista se actualizó con éxito.",
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se actualizó con éxito',
    }).then((result) => {
      location.href = 'bandeja-principal'
    });
  }

}
