import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { Component } from '@angular/core';
//import { ServiciosAgricultor } from './services/serviciosAgricultor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'permisos-temporales-front';

  constructor(private servicios : ServiciosAgricultor){
    this.servicios.obtener().subscribe( resp => {
      console.log(resp)
    })
  }

  ngOninit(){
    //location.href="login"
  }


}

