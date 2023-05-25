import { DataGraficasService } from './../../services/data-graficas.service';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ServiciosAgricultor } from 'src/app/services/serviciosAgricultor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

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
  tab4= false;
  nitTemporal:any = sessionStorage.getItem("nitAgricultor");
  idTransporteActualizar = '';
  idTransportistaActualizar = 0;
  pesajes2 : any;
  transportes2: any=[]
  transportistas2: any=[]
  agricultores:any=[]
  agricultores2: any = []

  detalleAgricultor:any;

  usuarioActual : any;

  //variables para graficas
  // single: any[]=[];
  view: [number, number] = [170, 150];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  // dataTransportes = []
  // dataTransportistas=[]

  dataTransportes=[
    {
      "name":"Activos",
      "value":0
    },
    {
      "name":"Inactivos",
      "value":0
    }
  ];

  dataTransportistas=[
    {
      "name":"Activos",
      "value":0
    },
    {
      "name":"Inactivos",
      "value":0
    }
  ];


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

  public formNoCuenta=new FormGroup({
    idCuenta: new FormControl(null, Validators.required)
  })

  public formFechaCuenta=new FormGroup({
    fecha: new FormControl(null, Validators.required)
  })

  public formEstadoCuenta=new FormGroup({
    estado: new FormControl(null, [Validators.required, Validators.maxLength(10)])
  })

  public formPlaca=new FormGroup({
    placa: new FormControl(null, Validators.required)
  })

  public formEstadoTransporte=new FormGroup({
    estado: new FormControl(null, Validators.required)
  })

  public formCUI=new FormGroup({
    cui: new FormControl(null, Validators.required)
  })

  public formEstadoTransportista=new FormGroup({
    estado: new FormControl(null, Validators.required)
  })


  public formNitAgricultor=new FormGroup({
    nit: new FormControl(null, Validators.required)
  })

  public formEstadoAgricultor=new FormGroup({
    estado: new FormControl(null, Validators.required)
  })

  constructor( private servicios: ServiciosAgricultor, private router: Router, 
    private authService: AuthService, private datagrafica:DataGraficasService) { }

  ngOnInit(): void {
   
    //aqui se va a consultar pesajes por agricultor
    let nit:any = sessionStorage.getItem('nitAgricultor');
    this.servicios.obtenerPesajesPorNit(nit).subscribe(resp =>{
      console.log("Respuesta ==== " , resp)
      this.pesajes = resp;
      this.pesajes2 = resp;
    })
    
    this.obtenerTransportes()
    this.obtenerTransportistas()
    this.obtenerAgricultores();

    this.usuarioActual = sessionStorage.getItem("usuarioActual")

        //para validar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
          this.router.navigate(['/login']);
    }
  }

  mostrar(tab:string){
    let a = document.getElementById("pesajes")?.className;
    let b = document.getElementById("transportes")?.className;
    let c = document.getElementById("transportistas")?.className;
    let d = document.getElementById("agricultores")?.className;

    if(tab == 'pesajes'){
      console.log("tab 1")
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
    }
    else if(tab == 'transportes'){
      console.log("tab 2")
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tab4 = false;
    }
    else if(tab == 'transportistas'){
      console.log("tab 3")
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;
      this.tab4 = false;
    }
    else if(tab == 'agricultores'){
      console.log("tab 4")
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = true;
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
        this.transportes = resp;
        this.transportes2 = resp;
        return resp;
      }
    );
  }

  obtenerTransportistas(){
    let consulta : any= this.servicios.obtenerTransportistas(this.nitTemporal).subscribe(
      resp =>{
        this.transportistas = resp;
        this.transportistas2 = resp;
        console.log("respuesta transportistas", resp)
        return resp;
      }
    );
  }

  estado(dato:any){
    // console.log("dato == " , dato)
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
        "usuarioModifico": this.usuarioActual
      }
      this.servicios.actualizarTransporte(this.idTransporteActualizar, variables).toPromise().then(
        data =>{
          console.log("data ==== " , data)
        }
      ).catch(err => {
        console.log("entra al error ===== " , err.status)
        if(err.status == 200 || err.status == 201){
          // this.mensajeExitoTransportista()
          this.mensajeExitoTransporte()
          // this.mensajeExito()
        }
        else{
          this.mostrarMensajeError(err.error)
        }
      });
    }else if(form=='transportista'){
      let estado = (this.formDatosTransportista.controls.estado.value =='1' ) ? true: false;

      let variables = {
        "activo": estado,
        "observaciones" : this.formDatosTransportista.controls.observaciones.value,
        "usuarioModifico": this.usuarioActual
      }

      console.log("variables === " , variables)

      this.servicios.actualizarTransportista(this.idTransportistaActualizar, variables).toPromise().then(
        data =>{
          console.log("data ==== " , data)
        }
      ).catch(err => {
        console.log("entra al error ===== " , err.status)
        if(err.status == 200 || err.status == 201){
          this.mensajeExitoTransportista();
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
    })
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


  asignarNombreAgricultor(nombre : string, cantidad:any){
    console.log("esto es el nombre del agricultor === " , nombre)
    localStorage.setItem('nombreAgricultor', nombre)
    localStorage.setItem('cantidadParcialidades', cantidad)
  }

  buscarPorEstado(){
    this.formNoCuenta.reset()
    this.formFechaCuenta.reset()

    // let pesajesTemporal = this.pesajes;
    this.pesajes = []
    let temp: any[] = [];
    this.pesajes2.filter( (data: any) => {
      if( ( (String(data.idEstado.nombre)).toLowerCase()).includes((this.formEstadoCuenta.controls.estado.value).toLowerCase())){
        temp.push(data)
      }
    })
    this.pesajes = temp;
  }

  buscarPorNoCuenta(){
    // let pesajesTemporal = this.pesajes;
    this.formEstadoCuenta.reset()
    this.formFechaCuenta.reset()

    this.pesajes = []
    this.pesajes = this.pesajes2.filter( (data: any) => {
      if(data.idCuenta == this.formNoCuenta.controls.idCuenta.value){
        return data;
      }
    })
  }

  buscarPorFechaCuenta(){
    this.formEstadoCuenta.reset()
    this.formNoCuenta.reset()

    let fecha = this.formatoFecha(this.formFechaCuenta.controls.fecha.value);
    this.pesajes = []
    this.pesajes = this.pesajes2.filter( (data: any) => {
      
      if(this.formatoFecha(data.fechaCreacion) == fecha){
        return data;
      }
    })

  }

  limpiarFiltroCuentas(){
    this.formNoCuenta.reset()
    this.formEstadoCuenta.reset()
    this.formFechaCuenta.reset()

    this.pesajes = this.pesajes2;
  }


  // BUSCADORES TRANSPORTE----------------------------------------------------------
  buscarTransportePlaca(){
    this.formEstadoTransporte.reset()
    this.transportes = []
    let temp: any[] = [];

    this.transportes = this.transportes2.filter( (data: any) => {
      if(String(data.idTransporte).toLowerCase().includes((this.formPlaca.controls.placa.value).toLowerCase())){
        console.log("data que coincide=== " , data)
        temp.push(data)
      }
    })
    this.transportes = temp;
  }

  buscarTransporteEstado(){
    this.formPlaca.reset()
    this.transportes = []
    let temp: any[] = [];
    let est = this.formEstadoTransporte.controls.estado.value == "true" ? true : false;
    this.transportes = this.transportes2.filter( (data: any) => {
      if(data.activo == est){
        temp.push(data)
      }
    })
    this.transportes = temp;
  }

  limpiarFiltroTransportes(){
    this.formPlaca.reset()
    this.formEstadoTransporte.reset()

    this.transportes = this.transportes2;
  }


  // BUSCADORES TRANSPORTISTA----------------------------------------------------------

  buscarTransportistaCUI(){
    this.formEstadoTransportista.reset()
    this.transportistas = []
    let temp: any[] = [];

    this.transportistas = this.transportistas2.filter( (data: any) => {
      if(String(data.idTransportista).includes((this.formCUI.controls.cui.value))){
        console.log("data que coincide=== " , data)
        temp.push(data)
      }
    })
    this.transportistas = temp;
  }

  buscarTransportistaEstado(){
    this.formCUI.reset()
    this.transportistas = []
    let temp: any[] = [];
    let est = this.formEstadoTransportista.controls.estado.value == "true" ? true : false;
    this.transportistas = this.transportistas2.filter( (data: any) => {
      if(data.activo == est){
        temp.push(data)
      }
    })
    this.transportistas = temp;
  }

  limpiarFiltroTransportistas(){
    this.formCUI.reset()
    this.formEstadoTransportista.reset()

    this.transportistas = this.transportistas2;
  }


  /////////////////////////////////////////////////////////////////////////////////

  obtenerAgricultores(){
    this.servicios.obtener().subscribe( data => {
      this.agricultores = data;
      this.agricultores2 = data;
      console.log("agricultores actuales === " , data)
    })
  }


  buscarAgricultorNIT(){
    this.formEstadoAgricultor.reset()
    this.agricultores = []
    let temp: any[] = [];

    this.agricultores = this.agricultores2.filter( (data: any) => {
      if(String(data.nitAgricultor).includes((this.formNitAgricultor.controls.nit.value))){
        console.log("data que coincide=== " , data)
        temp.push(data)
      }
    })
    this.agricultores = temp;
  }


  buscarAgricultoresEstado(){
    this.formNitAgricultor.reset()
    this.agricultores = []
    let temp: any[] = [];
    let est = this.formEstadoAgricultor.controls.estado.value == "true" ? true : false;
    this.agricultores = this.agricultores2.filter( (data: any) => {
      if(data.activo == est){
        temp.push(data)
      }
    })
    this.agricultores = temp;
  }

  limpiarFiltrosAgricultores(){
    this.formNitAgricultor.reset()
    this.formEstadoAgricultor.reset()

    this.agricultores = this.agricultores2;
  }


  async detallarAgricultor(nit:any){

    let transportes :any; 
    let cuentas:any;
    let transportistas:any
    let cantCuentas:number = 0;
    let cantTransportistas:number = 0
    let cantTransportes:number = 0;
    

    let variables={
      "nit":nit,
      "cantidadCuentas":0,
      "cuentas":0,
      "cantidadTransportistas": 0,
      "transportistas":0,
      "cantidadTransportes": 0,
      "transportes":0
    }



    this.dataTransportistas=[
      {
        "name":"Activo",
        "value":2
      },
      {
        "name":"Inactivo",
        "value":1
      }
    ];

    this.servicios.obtenerTransportes(nit).subscribe(
       resp =>  {
        let activos = 0;
        let inactivos = 0;
        transportes = resp;
        variables.transportes = transportes
        transportes.map((data: any)=>{
          if(data.activo){
            activos++
          }
          else{
            inactivos++
          }
          cantTransportes++;
          this.datagrafica.dataTransportes;
        })
        variables.cantidadTransportes = cantTransportes
        this.dataTransportes=[
          {
            "name":"Activos",
            "value":activos
          },
          {
            "name":"Inactivos",
            "value":inactivos
          }
        ];
        console.log("res === " , resp)
      }
    );
	
	
	
this.servicios.obtenerTransportistas(nit).subscribe(
      resp =>{
        let activos = 0;
        let inactivos = 0;
        transportistas = resp;
        variables.transportistas = transportistas
        transportistas.map((data:any)=>{
          if(data.activo){
            activos++
          }
          else{
            inactivos++
          }
          cantTransportistas++
        })
        variables.cantidadTransportistas = cantTransportistas
        this.dataTransportistas=[
          {
            "name":"Activos",
            "value":activos
          },
          {
            "name":"Inactivos",
            "value":inactivos
          }
        ];
      }
    );
	

this.servicios.obtenerPesajesPorNit(nit).subscribe(resp =>{
    cuentas = resp;
    variables.cuentas = cuentas;
    cuentas.map((data:any) =>{
      cantCuentas++
    })
    variables.cantidadCuentas = cantCuentas
})

  
this.detalleAgricultor = variables;


    console.log("que datos tengo === " , variables)

  }

}


