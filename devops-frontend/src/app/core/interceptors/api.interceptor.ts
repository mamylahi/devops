import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  const apiReq = req.clone({
    setHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Une erreur inattendue est survenue.';

      if (error.status === 0) {
        message = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      } else if (error.status === 404) {
        message = 'Ressource introuvable.';
      } else if (error.status === 422) {
        // Les erreurs de validation sont traitées dans les composants
        return throwError(() => error);
      } else if (error.status === 500) {
        message = 'Erreur interne du serveur.';
      } else if (error.error?.message) {
        message = error.error.message;
      }

      if (error.status !== 422) {
        toast.error(message);
      }

      return throwError(() => error);
    })
  );
};
