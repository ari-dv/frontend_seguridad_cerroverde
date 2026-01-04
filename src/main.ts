import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import '@angular/compiler'; // <-- Asegura que esté disponible

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
