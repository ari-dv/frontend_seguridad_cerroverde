import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from '../components/helper';

@Injectable({
  providedIn: 'root'
})
export class PdfFirmaService {

  constructor(private http: HttpClient) { }

  public firmarPdf(archivo: File): Observable<Blob> {

    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http.post(
      `${baseUrl}/firma/pdf`,
      formData,
      {
        responseType: 'blob'
      }
    );
  }
}
