import { Injectable } from '@angular/core';

interface TranportesEstados {
  name: string, 
  value: number
}

interface TranportistasEstados {
  name: string, 
  value: number
}

@Injectable({
  providedIn: 'root'
})
export class DataGraficasService {

  constructor() { }


   //variables para graficas
  // single: any[]=[];
  view: [number, number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  // dataTransportes = [{}]
  // dataTransportistas=[{}]




  dataTransportes: TranportesEstados[] = [
    {
      "name":"Activo",
      "value":0
    },
    {
      "name":"Inactivo",
      "value":0
    }
  ]
  

  dataTransportistas = [
    {
      "name":"Activo",
      "value":0
    },
    {
      "name":"Inactivo",
      "value":0
    }
  ]



}
