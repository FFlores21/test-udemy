import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProgressService } from '../services/progress/progress.service';

@Injectable({
  providedIn: 'root',
})
export class ProgressInterceptorService implements HttpInterceptor {
  cantidadPeticiones = 0;

  constructor(private sProgress: ProgressService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.sProgress.startLoading('principal');
    this.cantidadPeticiones++;
    return next.handle(req).pipe(
      finalize(() => {
        this.cantidadPeticiones--;
        if (this.cantidadPeticiones === 0) {
          this.sProgress.completeLoading('principal');
        }
      })
    );
  }
}
