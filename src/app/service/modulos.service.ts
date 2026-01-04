import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../components/helper';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {

  constructor(private http: HttpClient) { }

  // Listar todos los módulos
  public listarModulos(): Observable<any> {
    return this.http.get(`${baseUrl}/modulos/`);
  }

  // CAMBIO: de number a any
  public obtenerModuloPorId(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/modulos/${id}`);
  }

  public agregarModulo(modulo: any): Observable<any> {
    return this.http.post(`${baseUrl}/modulos/`, modulo);
  }

  // CAMBIO: de number a any
  public editarModulo(id: any, modulo: any): Observable<any> {
    return this.http.put(`${baseUrl}/modulos/${id}`, modulo);
  }

  // CAMBIO: de number a any
  public eliminarModulo(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/modulos/${id}`);
  }

  // CAMBIO: de number a any
  public obtenerPermisosPorModulo(idModulo: any): Observable<any> {
    return this.http.get(`${baseUrl}/modulos/${idModulo}/permisos`);
  }

  // CAMBIO: de number a any
  public obtenerSubmodulosPorModulo(idModulo: any): Observable<any> {
    return this.http.get(`${baseUrl}/submodulos/modulos/${idModulo}`);
  }

  public obtenerTodos(): Observable<any> {
    return this.http.get(`${baseUrl}/submodulos/`);
  }
}