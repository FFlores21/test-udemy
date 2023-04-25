import { Injectable } from '@angular/core';
import { NgProgress, NgProgressRef } from 'ngx-progressbar';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  progressPrincipal: NgProgressRef;

  constructor(private progress: NgProgress) {
    this.progressPrincipal = this.progress.ref('ProgressPrincipal'); //Se encuentra en app.main.component.html
  }

  startLoading(componente: 'principal') {
    switch (componente) {
      case 'principal':
        this.progressPrincipal.start();
        break;
    }
  }

  completeLoading(componente: 'principal') {
    switch (componente) {
      case 'principal':
        this.progressPrincipal.complete();
    }
  }
}
