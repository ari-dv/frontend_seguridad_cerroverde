import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { PdfFirmaService } from '../../../service/pdf-firma-service.service';

interface Documento {
  nombre: string;
  archivo: File;          // El archivo original
  archivoFirmado?: Blob;  // Guardaremos el resultado de la firma aquí
  estado: 'Pendiente' | 'Firmado';
  fecha: Date;
}

@Component({
  selector: 'app-pdf-firma',
  templateUrl: './pdf-firma.component.html',
  styleUrl: './pdf-firma.component.css',
  standalone: false
})
export class PdfFirmaComponent {
  documentosRecientes: Documento[] = [];
  cargando: boolean = false;

  constructor(private pdfFirmaService: PdfFirmaService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.agregarAHistorial(file);
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    this.agregarAHistorial(file);
  }

  private agregarAHistorial(file: File | undefined) {
    if (!file || file.type !== 'application/pdf') {
      Swal.fire('Error', 'Debe seleccionar un archivo PDF válido', 'error');
      return;
    }

    const nuevoDoc: Documento = {
      nombre: file.name,
      archivo: file,
      estado: 'Pendiente',
      fecha: new Date()
    };

    this.documentosRecientes.unshift(nuevoDoc);
  }

  firmarDocumentoDelHistorial(doc: Documento) {
    this.cargando = true;
    
    this.pdfFirmaService.firmarPdf(doc.archivo).subscribe({
      next: (blob) => {
        this.cargando = false;
        doc.estado = 'Firmado';
        doc.archivoFirmado = blob; // Guardamos el blob firmado para descargas posteriores
        
        this.ejecutarDescarga(blob, doc.nombre.replace('.pdf', '_firmado.pdf'));
        Swal.fire('Éxito', 'Documento firmado correctamente', 'success');
      },
      error: () => {
        this.cargando = false;
        Swal.fire('Error', 'El documento supera el limite de MB', 'error');
      }
    });
  }

  // ESTA ES LA FUNCIÓN QUE SOLICITASTE
  descargarArchivo(doc: Documento) {
    if (doc.estado === 'Firmado' && doc.archivoFirmado) {
      // Si ya está firmado, descarga la versión firmada
      this.ejecutarDescarga(doc.archivoFirmado, doc.nombre.replace('.pdf', '_firmado.pdf'));
    } else {
      // Si no, descarga el original subido
      this.ejecutarDescarga(doc.archivo, doc.nombre);
    }
  }

  // Método auxiliar reutilizable para disparar la descarga
  private ejecutarDescarga(contenido: Blob | File, nombreArchivo: string) {
    const url = window.URL.createObjectURL(contenido);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  verDocumento(doc: Documento) {
    // Si hay firmado, vemos ese, sino el original
    const contenido = doc.archivoFirmado || doc.archivo;
    const fileURL = URL.createObjectURL(contenido);
    window.open(fileURL, '_blank');
  }
}