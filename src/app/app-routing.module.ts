import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { BandejaPrincipalComponent } from './componentes/bandeja-principal/bandeja-principal.component';
import { DetallePesajeComponent } from './componentes/detalle-pesaje/detalle-pesaje.component';
import { CrearParcialidadComponent } from './componentes/crear-parcialidad/crear-parcialidad.component';
import { InfoParcialidadQRComponent } from './componentes/info-parcialidad-qr/info-parcialidad-qr.component';
import { QrParcialidadComponent } from './componentes/qr-parcialidad/qr-parcialidad.component';

const routes: Routes = [

{
  path: '',
  component: LoginComponent
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'bandeja-principal',
  component: BandejaPrincipalComponent
},
{
  path: 'bandeja-principal/detalle-pesaje/:idCuenta/:estado',
  component: DetallePesajeComponent
},
{
  path: 'bandeja-principal/detalle-pesaje/:idCuenta/crearParcialidad',
  component: CrearParcialidadComponent
},
{  ////nueva ruta para ver detalle
  path: 'https://frontend-beneficio-fje3kl50a-mpaniagua-8814.vercel.app/bandeja-principal/detalle-pesaje/:idCuenta/:estadoActual/qr/:idParcialidad/info-qr/:idParcialidad', 
  component: InfoParcialidadQRComponent
}
,
{
  path: 'bandeja-principal/detalle-pesaje/:idCuenta/:estadoActual/qr/:idParcialidad',
  component: QrParcialidadComponent
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
