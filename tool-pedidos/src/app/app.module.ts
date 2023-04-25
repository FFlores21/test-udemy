import { NgModule, isDevMode } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNgModule } from './modules/prime-ng/prime-ng.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DialogService } from 'primeng/dynamicdialog';
import { NgProgressModule } from 'ngx-progressbar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgressInterceptorService } from './interceptors/progressInterceptor.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { TokenInterceptorService } from './interceptors/tokenInterceptor.service';
import { ROOT_REDUCERS_AUTH } from './redux/auth/state/auth.state';
import { EffectsModule } from '@ngrx/effects';
import { LayoutEffects } from './redux/layout/effects/layout.effects';
@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AppLayoutModule,
    PrimeNgModule,
    NgProgressModule,
    StoreModule.forRoot(ROOT_REDUCERS_AUTH),
    EffectsModule.forRoot(LayoutEffects),
    StoreDevtoolsModule.instrument({
      name: 'TOOL POLITICA COMERCIAL',
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    GoogleMapsModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService,
    DialogService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
