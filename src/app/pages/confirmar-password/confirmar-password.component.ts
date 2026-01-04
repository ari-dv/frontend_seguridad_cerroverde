import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-confirmar-password',
  standalone: false,
  templateUrl: './confirmar-password.component.html',
  styleUrls: ['./confirmar-password.component.css']
})
export class ConfirmarPasswordComponent implements OnInit {

  nuevaClave: string = '';
  confirmarClave: string = '';
  token: string = '';
  hide = true;
  hideNueva = true;
  hideConfirmar = true;
  mensajeError = '';

  constructor(
    private route: ActivatedRoute,
    private resetPasswordService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Capturamos el token de la URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  // Validar contraseña segura
  validarPassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

  // Generar contraseña segura automáticamente
  generarPassword(): void {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.nuevaClave = pass;
    this.confirmarClave = pass;
    Swal.fire('Contraseña generada', ``, 'info');
  }

  formSubmit(): void {
    this.mensajeError = '';

    // Validaciones
    if (!this.nuevaClave || !this.confirmarClave) {
      this.mensajeError = 'Ambos campos son obligatorios';
      return;
    }

    if (this.nuevaClave !== this.confirmarClave) {
      this.mensajeError = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.validarPassword(this.nuevaClave)) {
      this.mensajeError = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
      return;
    }

    // Llamada al servicio para restablecer contraseña
    this.resetPasswordService.resetPassword(this.token, this.nuevaClave).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'La contraseña ha sido actualizada con éxito',
          confirmButtonText: 'Ir al login',
        }).then(() => this.router.navigate(['/login']));
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Error al actualizar la contraseña',
        });
      }
    });
  }

}
