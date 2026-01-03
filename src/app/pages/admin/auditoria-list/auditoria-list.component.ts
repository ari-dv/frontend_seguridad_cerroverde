import { Component, OnInit } from '@angular/core';
import { AuditoriaService, Auditoria } from '../../../service/auditoria.service';

@Component({
  selector: 'app-auditoria-list',
  templateUrl: './auditoria-list.component.html',
  styleUrls: ['./auditoria-list.component.css'],
  standalone: false
})
export class AuditoriaListComponent implements OnInit {

  auditorias: Auditoria[] = [];
  loading = true;
  error = '';

  filtroGeneral: string = '';
  filtroMetodo: string = '';
  filtroEstado: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private auditoriaService: AuditoriaService) { }

  ngOnInit(): void {
    this.cargarAuditorias();
  }

  cargarAuditorias(): void {
    this.loading = true;
    this.error = '';

    this.auditoriaService.getAuditorias().subscribe({
      next: (data) => {
        this.auditorias = data;
        this.currentPage = 1;
        this.loading = false;
        console.log("Datos recibidos:", data);
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar las auditorías. Verifique el Backend.';
        this.loading = false;
      }
    });
  }

  // GETTER FILTRADO (Actualizado a camelCase)
  get auditoriasFiltradas(): Auditoria[] {
    const term = this.filtroGeneral.toLowerCase();
    const metodoFiltro = this.filtroMetodo;
    const estadoFiltro = this.filtroEstado;

    return this.auditorias.filter(audit => {
      // Validamos nulls para evitar errores
      const usuario = audit.usuario?.toLowerCase() || '';
      const url = audit.url?.toLowerCase() || '';
      const ip = audit.ip?.toLowerCase() || '';
      const metodo = audit.metodo || '';
      
      // CAMBIO: usamos audit.codigoEstado (camelCase)
      const estado = audit.codigoEstado?.toString() || ''; 
      
      // CAMBIO: usamos audit.fecha (camelCase)
      const fecha = audit.fecha || '';

      const coincideTexto = term === '' || 
                            usuario.includes(term) || 
                            url.includes(term) || 
                            ip.includes(term) ||
                            fecha.includes(term);

      const coincideMetodo = metodoFiltro === '' || metodo === metodoFiltro;
      const coincideEstado = estadoFiltro === '' || estado === estadoFiltro;

      return coincideTexto && coincideMetodo && coincideEstado;
    });
  }

  get totalPages(): number {
    const total = Math.ceil(this.auditoriasFiltradas.length / this.itemsPerPage);
    return total === 0 ? 1 : total;
  }

  get auditoriasPaginadas(): Auditoria[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.auditoriasFiltradas.slice(start, start + this.itemsPerPage);
  }

  changePage(delta: number): void {
    const nextPage = this.currentPage + delta;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
    }
  }

  limpiarFiltros(): void {
    this.filtroGeneral = '';
    this.filtroMetodo = '';
    this.filtroEstado = '';
    this.currentPage = 1;
  }


  // Método para traducir el código a texto legible
  getTextoEstado(status: number): string {
    if (status >= 200 && status < 300) return 'ÉXITO';
    if (status === 401 || status === 403) return 'DENEGADO';
    if (status >= 400 && status < 500) return 'ERROR CLIENTE';
    if (status >= 500) return 'ERROR SERVIDOR';
    return 'DESCONOCIDO';
  }
  
  getEstadoClass(status: number): string {
    if (status >= 200 && status < 300) return 'badge-success';
    if (status >= 400 && status < 500) return 'badge-warning';
    return 'badge-danger';
  }
}