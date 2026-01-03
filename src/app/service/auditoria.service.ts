import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Auditoria {
  id: number;              // Coincide con: private Long id;
  fecha: string;           // Coincide con: private LocalDateTime fecha;
  usuario: string;
  metodo: string;
  url: string;
  ip: string;
  codigoEstado: number;    // Coincide con: private Integer codigoEstado;
  tiempoEjecucion: number; // Coincide con: private Long tiempoEjecucion;
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  // Verifica que esta URL sea la correcta de tu backend
  private apiUrl = 'http://localhost:8080/cerro-verde/auditoria';

  constructor(private http: HttpClient) { }

  getAuditorias(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(this.apiUrl);
  }
}