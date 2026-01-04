import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { UserService } from '../../service/user.service'; // Asegúrate de la ruta
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  hide = true;

  registerData = {
    dni: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    check_terminos: false,
    email: '',
    password: '',
    confirmPassword: ''
  };

  mensajeError = '';
  mostrarModalTerminos = false;

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {}

  abrirModalTerminos() { this.mostrarModalTerminos = true; }
  cerrarModalTerminos() { this.mostrarModalTerminos = false; }

  buscarPorDni(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.registerData.dni.length === 8) {
      this.http.get<any>(`https://graphperu.daustinn.com/api/query/${this.registerData.dni}`)
        .subscribe({
          next: (res) => {
            this.registerData.nombres = res.names || '';
            this.registerData.apellidos = res.surnames || '';
          },
          error: () => Swal.fire('Error', 'No se encontraron datos para ese DNI', 'error')
        });
    }
  }

  validarPassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

  generarPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.registerData.password = pass;
    this.registerData.confirmPassword = pass;
    Swal.fire('Contraseña generada', `Tu contraseña es: ${pass}`, 'info');
  }
formSubmit() {
  this.mensajeError = '';

  if (!this.registerData.email || !this.registerData.password || !this.registerData.confirmPassword) {
    this.mensajeError = 'Todos los campos son obligatorios';
    return;
  }

  if (this.registerData.password !== this.registerData.confirmPassword) {
    this.mensajeError = 'Las contraseñas no coinciden';
    return;
  }

  if (!this.validarPassword(this.registerData.password)) {
    this.mensajeError = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
    return;
  }

  // Preparar objeto para backend
  const usuarioBackend = {
    dni: this.registerData.dni,
    nombre: this.registerData.nombres,
    apellidos: this.registerData.apellidos,
    telefono: this.registerData.telefono,
    email: this.registerData.email,
    password: this.registerData.password,
    terminosAceptados: this.registerData.check_terminos

  };

  // Llamada al servicio para guardar usuario
  this.userService.añadirUsuario(usuarioBackend).subscribe({
    next: (res: any) => {
      Swal.fire('Éxito', 'Usuario registrado correctamente', 'success');
            this.router.navigate(['/login']);

      // Limpiar formulario
      this.registerData = {
        dni: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        check_terminos: false,
        email: '',
        password: '',
        confirmPassword: ''
      };
    },
    error: (err) => {
      console.error(err);

      // Mostrar mensaje exacto que viene del backend
      let mensaje = 'No se pudo registrar el usuario';
      if (err.error) {
        // err.error puede ser un string o un objeto dependiendo de tu backend
        if (typeof err.error === 'string') {
          mensaje = err.error;
        } else if (err.error.message) {
          mensaje = err.error.message;
        }
      }

      Swal.fire('Error', mensaje, 'error');
    }
  });
}

}
