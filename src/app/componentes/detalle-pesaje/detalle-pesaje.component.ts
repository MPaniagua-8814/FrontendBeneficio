import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { AuthService } from 'src/app/services/auth.service';

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
  nombreAgricultor:any;
  cantidadParcialidades:any;
  diferenciaTotal= 0;
  tolerancia:any;
  medidaPeso:any;
  resultadoTolerancia:any;

  //para generar el QR
  profile="";
  url=  this.router.url+'/info-qr/'  //"http://localhost:4200/bandeja-principal/detalle-pesaje/12/Cuenta%20Abierta";
  elementType=NgxQrcodeElementTypes.URL;
  errorCorrectionLevel="";
  value=this.url+this.profile;

  posiblesEstados= [ 
    {
      id : 5, 
      nombre: "Cuenta Cerrada"
    },
    {
      id : 6, 
      nombre: "Cuenta Confirmada"
    }  
  ]

  cuenta : any;
  // idParcialidadQR: any;

  usuarioActual: any;


  public formCuenta = new FormGroup({
    estadoActual: new FormControl(null),
    estadoNuevo: new FormControl(null/*, [Validators.required]*/),
    idCuenta: new FormControl(null),
  });

  constructor( private servicios: ServiciosAgricultor, private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {

    this.idCuenta =  (this.route.snapshot.paramMap.get("idCuenta"));

    //aqui se va a consultar detalle (parcialidades) por cuenta
    this.servicios.obtenerParcialidadesPorIdPesaje(this.idCuenta).subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.parcialidades = resp;
    })



    this.servicios.obtenerCuentaPorId(this.idCuenta).subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.cuenta = resp;
      this.nombreAgricultor = this.cuenta.nitAgricultor.nombre
      this.estadoActual = this.cuenta.idEstado.nombre; 
      this.diferenciaTotal = (this.cuenta.diferenciaTotal == null) ? 0 : this.cuenta.diferenciaTotal;
      this.cantidadParcialidades = this.cuenta.totalParcialidades;
      this.tolerancia = (this.cuenta.tolerancia == null) ? 0 : this.cuenta.tolerancia;
      this.medidaPeso = this.cuenta.medidaPeso.nombre;
      this.resultadoTolerancia = this.cuenta.resultadoTolerancia
    })

    // console.log("que hay === " , this.servicios.obtenerCuentaPorId(this.idCuenta) )

    // this.obtenerEstadoCuenta()

    this.usuarioActual = sessionStorage.getItem('usuarioActual')

    //para validar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

  }


  regresar(){
    location.href = 'bandeja-principal'
  }

  formValid(){
    return this.formCuenta.valid
  }
  

  formatoFecha( fecha: Date){
    if (fecha == null){
      return null;
    }
    let f2 = (fecha.toString().split('T'))[0].split('-');
    return (f2[2]+'-'+ f2[1]+ '-' + f2[0])
  }

  actualizarEstadoCuenta(){
    
    let variables = {
      "usuarioModifico": this.usuarioActual
    }
    if(this.estadoActual == 'Pesaje Finalizado'){
      this.servicios.cambiarEstadoCuenta('cerrar', this.idCuenta, variables).toPromise().then(
        data =>{
          this.mensajeExito()
        }
      ).catch(err => {
        console.log("estado al error ===== " , err.status)
        console.log("entra al error ===== " , err)
        if(err.status == 200 || err.status == 201){
          this.mensajeExito()
        }
        else{
          this.mostrarMensajeError(err.error)
        }
      });
    }
    else if(this.estadoActual == 'Cuenta Cerrada'){
      this.servicios.cambiarEstadoCuenta('confirmar', this.idCuenta, variables).toPromise().then(
        data =>{
          this.mensajeExito()
        }
      ).catch(err => {
        console.log("estado al error ===== " , err.status)
        console.log("entra al error ===== " , err)
        if(err.status == 200 || err.status == 201){
          this.mensajeExito()
        }
        else{
          this.mostrarMensajeError(err.error)
        }
      });
    }
    // this.servicios.actualizarEstadoBeneficio(Number(this.idCuenta), Number(this.formCuenta.controls.estadoNuevo.value));
    // this.mensajeExito()
  }

  mostrarEstado(estado:any){
    if(estado == 'Pesaje Finalizado'){
      return 'Cuenta Cerrada'
    }
    else if(estado == 'Cuenta Cerrada'){
      return 'Cuenta Confirmada'
    }else{
      return 'Invalido'
    }
  }

  mostrarBotonEstado(){
    if (this.estadoActual == 'Pesaje Finalizado' || this.estadoActual == 'Cuenta Cerrada'){
      return true
    }
    else{
      return false;
    }
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
      location.reload()
      // location.href = 'bandeja-principal'
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

  accionParcialidad(accion:string, idParcialidad:number){

    if(accion=='Confirmar'){

      let variables = {
        "idCuenta": this.idCuenta,
        "idParcialidad": idParcialidad,
        "usuarioModifico": this.usuarioActual
      }
      console.log("datos para confirmar=== " , variables)

      this.servicios.recibirParcialidad(variables).toPromise().then(
        data =>{
          this.mensajeExito()
        }
      ).catch(err => {
        console.log("estado al error ===== " , err.status)
        console.log("entra al error ===== " , err)
        if(err.status == 200 || err.status == 201){
          this.mensajeConfirmarParcialidad('recibida')
          sessionStorage.setItem('estadoCuenta',  'Cuenta Abierta')
        }
        else{
          this.mostrarMensajeError(err.error)
        }
      });
    }
    else if( accion= 'Rechazar'){
      console.log("se rechaza") ///

      let variables = {
        "id": idParcialidad,
        "comentario": "Se rechaza",
        "usuarioAgrego": this.usuarioActual
      }

      this.servicios.rechazarParcialidad(variables).toPromise().then(
        data =>{
          console.log("que hay en data === " , data)
          console.log("que hay en variables === " , variables)
          this.mensajeExito()
        }
      ).catch(err => {
        console.log("estado al error ===== " , err.status)
        console.log("entra al error ===== " , err)
        if(err.status == 200 || err.status == 201){
          this.mensajeConfirmarParcialidad('rechazada')
          sessionStorage.setItem('estadoCuenta',  'Cuenta Abierta')
        }
        else{
          this.mostrarMensajeError(err.error)
        }
      });

    }

  }

  mostrarMensajeError(texto:any){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: texto,
      // footer: '<a href="">Why do I have this issue?</a>'
    })
    // .then((result) => {
    //   location.href = 'bandeja-principal/detalle-pesaje/'+this.idPesaje+'/'+this.idCuenta
    // });
    
  }

  mensajeConfirmarParcialidad(accion:any){
    let texto ;
    if(accion == 'recibida'){
      texto = "Se confirma la recepción de la parcialidad"
    }
    else{
      texto = "Se rechaza la parcialidad"
    }
    Swal.fire({
      title: texto,
      icon: 'success',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      html: 'Se actualizó con éxito',
    }).then((result) => {
      location.reload()
      // location.href = 'bandeja-principal'
  });
  }


  generarQR( idCuenta:any, idParcialidad:any ){

    //console.log("holi, soy un QR")
    // this.idParcialidadQR = idParcialidad;
    // this.url = this.url + '/'+idParcialidad;

    // [routerLink]="['detalle-pesaje', dato.idCuenta, dato.idEstado.nombre]"


    //console.log("url nueva === " , this.url)
  }


  obtenerCuenta(){
    this.cuenta = this.servicios.obtenerCuentaPorId(this.idCuenta).subscribe( data=>{
      console.log("que hay en data de obtener cuenta === " , data)
    });
  }



}
