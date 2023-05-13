import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: "root"
})


export class ServiciosAgricultor {
  
  _url = 'https://beneficio-cafetito-ws.herokuapp.com';
  header = new HttpHeaders().set('Type-content', 'application/json')
  nitTemporal = "99671395";

  constructor(private http: HttpClient) {

    console.log("si llega a los servicios")

  }


  obtener(){
    let header = new HttpHeaders().set('Type-content', 'application/json')
    return this.http.get(this._url+'/beneficio/farmer/listar', { headers: header});
  }

  obtenerPesajesPorNit(nit: number) {


    return this.http.get(environment.rutaMicros+"/beneficio/count/agricultor/"+this.nitTemporal, { headers: this.header})
  
  }

  crearPesaje( variables : any){

    let head = new HttpHeaders().set('Type-content', 'application/json')

    let body=JSON.stringify({"datos":variables});
    let h = this.header;
    h = h.append('Access-Control-Allow-Origin', '*');
    h = h.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    //headers.append('Content-Type' , 'application/json');
    console.log("headers ==== " , h)
    return this.http.post(environment.rutaMicros+"/beneficio/count/create", variables).subscribe(
      data =>{
        console.log("data de crear pesaje === " , data)
      }
    )
;//, {headers: h}).subscribe(data =>{
      ////console.log("data === " , data)
    //})
    
  }

  obtenerParcialidadesPorIdPesaje( idPesaje : number){

    return this.http.get(environment.rutaMicros+"/beneficio/count/parts/"+idPesaje, { headers: this.header})
  }

  crearParcialidades( variables: any){
    return this.http.post(environment.rutaMicros+"/beneficio/count/parts/create", variables).subscribe(
      data =>{
        console.log("data de crear parcialidad === " , data)
      }
    )

  }

  getIpPublica() {
    return this.http.get(environment.serviciosPrueba + '/obtenerIp', {responseType:'text'})
  };

  obtenerDatosPrueba() {
      this.http.get(environment.rutaMicros+"/beneficio/farmer/listar", {responseType:'text'}).subscribe( resp => {
        console.log(resp)
        return resp
    })
  };
//https://beneficio-cafetito-ws.herokuapp.com/swagger-ui/index.html#/



  obtenerTransportes(nit:string){

    return this.http.get(environment.rutaMicros+"/beneficio/transport/list/"+nit, { headers: this.header})
    // return this.http.get(environment.rutaMicros+"/beneficio/transport/list/"+this.nitTemporal, { headers: this.header})

  }

  obtenerTransportistas(nit:string){

    return this.http.get(environment.rutaMicros+"/beneficio/carrier/list/"+nit, { headers: this.header})
    // return this.http.get(environment.rutaMicros+"/beneficio/carrier/list/"+this.nitTemporal, { headers: this.header})

  }

  actualizarTransporte(placa:string, variables:any){   /////beneficio
    return this.http.put(environment.rutaMicros+"/beneficio/updateTransport/"+placa , variables) ///, { headers: this.header})
  }

  actualizarTransportista(cui:number, variables:any){   /////beneficio
    return this.http.put(environment.rutaMicros+"/beneficio/updateCarrier/"+cui , variables) ///, { headers: this.header})
  }

  actualizarEstadoBeneficio(idCuenta: number, state: number){   // idCuenta , idEstado
    console.log("ruta === " , environment.rutaMicros+"/beneficio/updateState/"+idCuenta+'/'+state)
    return this.http.put(environment.rutaMicros+"/beneficio/updateState/"+idCuenta+'/'+state , { headers: this.header }).subscribe(data=>{
      console.log("que devuelve=== " ,data)
    }) ///, { headers: this.header})
  }
}
