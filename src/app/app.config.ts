import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideToastr(),
    provideRouter(routes),

    provideClientHydration(withEventReplay()),

    // ✅ IMPORTANT (AJOUT MANQUANT)
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    )
  ]
};
