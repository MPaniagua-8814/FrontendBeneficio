import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { AuthService } from 'src/app/services/auth.service';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';

@Component({
  selector: 'app-qr-parcialidad',
  templateUrl: './qr-parcialidad.component.html',
  styleUrls: ['./qr-parcialidad.component.scss']
})
export class QrParcialidadComponent implements OnInit {


  title = "QR Parcialidad"
    //para generar el QR
    profile="";
    elementType=NgxQrcodeElementTypes.URL;
    errorCorrectionLevel="";
    idCuenta:any;
    estadoActual:any;
    idParcialidad:any;
    
    //https://frontend-beneficio-fje3kl50a-mpaniagua-8814.vercel.app/bandeja-principal/detalle-pesaje/6/Cuenta Creada/qr/12/info-qr/12

    // url = '/bandeja-principal/detalle-pesaje/'+this.route.snapshot.paramMap.get("idCuenta")+'/'+this.route.snapshot.paramMap.get("estadoActual")+'/qr/'+this.route.snapshot.paramMap.get('idParcialidad')+'/info-qr/'+this.route.snapshot.paramMap.get('idParcialidad')
    //url = 'https://frontend-beneficio-fje3kl50a-mpaniagua-8814.vercel.app/bandeja-principal/detalle-pesaje/'+this.route.snapshot.paramMap.get("idCuenta")+'/'+this.route.snapshot.paramMap.get("estadoActual")+'/qr/'+this.route.snapshot.paramMap.get('idParcialidad')+'/info-qr/'+this.route.snapshot.paramMap.get('idParcialidad')
    url = '/bandeja-principal/detalle-pesaje/'+this.route.snapshot.paramMap.get("idCuenta")+'/'+this.route.snapshot.paramMap.get("estadoActual")+'/qr/'+this.route.snapshot.paramMap.get('idParcialidad')+'/info-qr/'+this.route.snapshot.paramMap.get('idParcialidad')
   
    value=this.url+this.profile;

    constructor( private servicios: ServiciosAgricultor, private router: Router, private route: ActivatedRoute, private authService: AuthService) { }


  ngOnInit(): void {

    this.idParcialidad = this.route.snapshot.paramMap.get('idParcialidad')
    this.idCuenta = Number(this.route.snapshot.paramMap.get("idCuenta"));
    this.estadoActual = this.route.snapshot.paramMap.get("estadoActual");

    // this.url = this.url + this.idParcialidad
    // this.url = 'adios'//this.url+this.idCuenta+'/'+this.estadoActual+'/info-qr/'+this.idParcialidad;  
    console.log("ruta que tenemos = " , this.url);
    //para validar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }


  regresar(){
    // this.router.
    location.href = 'bandeja-principal/detalle-pesaje/'+this.idCuenta+'/'+this.estadoActual

  }

}
