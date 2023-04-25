import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { PrimeNgModule } from '../../prime-ng/prime-ng.module';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    AppConfigModule,
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
