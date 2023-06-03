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
  usuarioActual: any;
  dataParcialidad: any;

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
        this.dataParcialidad = resp;
        this.parcialidad=  resp;
        this.transporte = this.parcialidad.idTransporte
        this.transportista = this.parcialidad.idTransportista
      }
    );
  }

  estado(estadoActual : any){

    return (estadoActual==true? 'Activo' : 'Inactivo')

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
          // this.mensajeExito()
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
          // this.mensajeExito()
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
    }).then((result)=>{
      location.href = 'bandeja-principal/detalle-pesaje/'+this.idCuenta+'/'+this.estadoActual

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
      // location.reload()
    location.href = 'bandeja-principal/detalle-pesaje/'+this.idCuenta+'/'+this.estadoActual
      // location.href = 'bandeja-principal'
  });
  }

}
