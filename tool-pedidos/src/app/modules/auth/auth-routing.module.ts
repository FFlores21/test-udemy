import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('./login/login.module').then(m => m.LoginModule),
      },
      {
        path: 'access',
        loadChildren: () =>
          import('./accessdenied/accessdenied.module').then(
            m => m.AccessdeniedModule
          ),
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then(m => m.LoginModule),
      },
      {
        path: 'verification',
        loadChildren: () =>
          import('./verification/verification.module').then(
            m => m.VerificationModule
          ),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
