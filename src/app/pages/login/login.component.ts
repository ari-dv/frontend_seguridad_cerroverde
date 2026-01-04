import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginData = {
    correo: '',
    password: '' 
  };
  hide: any = true;

  // === Modal de código ===
  mostrarModalCodigo: boolean = false;
  codigoVerificacion: string = '';
  mensajeCodigoError: string = '';
mensajeError: any;

  constructor(private snack: MatSnackBar, private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {}

formSubmit() {
  // Validaciones básicas
  if (!this.loginData.correo.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Correo requerido',
      text: 'Debe ingresar su correo',
      confirmButtonText: 'Aceptar'
    });
    return;
  }

  if (!this.loginData.password.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Contraseña requerida',
      text: 'Debe ingresar su contraseña',
      confirmButtonText: 'Aceptar'
    });
    return;
  }

  // Paso 1: Login y enviar código
  this.loginService.loginEnviarCodigo(this.loginData).subscribe(
    (data: any) => {
      // Guardamos token temporal
      this.loginService.loginUser(data.token);

      // === ALERTA DE CÓDIGO ENVIADO ===
      Swal.fire({
        icon: 'success',
        title: 'Código enviado',
        text: 'Código de verificación enviado al correo',
        confirmButtonText: 'Ingresar código',
        allowOutsideClick: false
      }).then(() => {
        // Mostrar modal inline
        this.mostrarModalCodigo = true;
      });
    },
    error => {
      const mensaje = error.error?.error || 'Credenciales incorrectas';
      let msg = '';

      switch (mensaje) {
        case 'Correo incorrecto':
          msg = 'El correo ingresado no está registrado.';
          break;
        case 'Contraseña incorrecta':
          msg = 'La contraseña ingresada es incorrecta.';
          break;
        case 'Usuario deshabilitado':
          msg = 'Su cuenta está deshabilitada. Contacte al administrador.';
          break;
        default:
          msg = 'Los datos ingresados son incorrectos.';
          break;
      }

      // Mostrar alerta SweetAlert en vez de snack
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: msg,
        confirmButtonText: 'Aceptar'
      });
    }
  );
}


  // === Modal: cancelar ===
  cancelarCodigo() {
    this.mostrarModalCodigo = false;
    this.codigoVerificacion = '';
    this.mensajeCodigoError = '';
  }

  // === Modal: verificar código ===
verificarCodigo() {
  if (!this.codigoVerificacion.trim()) {
    this.mensajeCodigoError = 'Debe ingresar el código';
    return;
  }

  this.loginService.validarCodigoDobleFactor({
    correo: this.loginData.correo,
    codigo: this.codigoVerificacion
  }).subscribe(
    res => {
      if (res.token) this.loginService.loginUser(res.token);

      // Obtener usuario
      this.loginService.getCurrentUser().subscribe(
        (user: any) => {
          this.loginService.setUser(user);

          if (!user.enabled) {
            this.mensajeCodigoError = 'Usuario deshabilitado';
            localStorage.clear();
            return;
          }

          if (!user.rol.estado) {
            this.mensajeCodigoError = 'Rol deshabilitado';
            localStorage.clear();
            return;
          }

          // Código correcto y usuario válido
          this.mostrarModalCodigo = false;

          // === ALERTA SWEET ALERT CÓDIGO VÁLIDO ===
          Swal.fire({
            icon: 'success',
            title: 'Código válido',
            text: `¡Bienvenido ${user.nombre}!`,
            confirmButtonText: 'Continuar',
            allowOutsideClick: false
          }).then(() => {
            this.router.navigate(['admin']);
          });
        },
        err => {
          this.mensajeCodigoError = 'Error al obtener datos del usuario';
        }
      );
    },
    err => {
      this.mensajeCodigoError = 'Código inválido';
    }
  );
}

}
