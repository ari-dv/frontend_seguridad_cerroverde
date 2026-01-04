import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../components/helper';

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  
  // CAMBIO 1: de number a any
  actualizarEstado(idRol: any, nuevoEstado: boolean) {
    return this.http.put(`${baseUrl}/roles/${idRol}/estado`, {
      estado: nuevoEstado
    });
  }

  constructor(private http: HttpClient) { }

  public listarRoles(): Observable<any> {
    return this.http.get(`${baseUrl}/roles/`);
  }

  // CAMBIO 2: de number a any
  public obtenerRolesPorId(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`); // Ojo: verifica si la ruta es correcta, en listarRoles usas /roles/
  }

  public agregarRol(rol: any) {
    return this.http.post(`${baseUrl}/roles/`, rol );
  }

   public agregarRolSinPermisos(rol: any) {
    return this.http.post(`${baseUrl}/roles-sp/`, rol );
  }

  // Este ya estaba bien
  public obtenerRol(rolId: any){
    return this.http.get(`${baseUrl}/roles/${rolId}`);
  }

  public actualizarRol(rol: any){
    return this.http.put(`${baseUrl}/roles/`, rol);
  }

  // CAMBIO 3: de number a any
  public eliminarRol(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
