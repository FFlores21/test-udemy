import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { SessionGuard } from './guards/session.guard';
import { AppLayoutComponent } from './layout/app.layout.component';
import { PedidosModuleLinks } from './modules/pedidos/shared/Pedidos.ModuleLinks';

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
};

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'acceso-denegado',
    loadChildren: () =>
      import('./modules/auth/accessdenied/accessdenied.module').then(
        m => m.AccessdeniedModule
      ),
  },
  {
    path: 'recurso-no-encontrado',
    loadChildren: () =>
      import('./modules/auth/error/error.module').then(m => m.ErrorModule),
  },
  {
    path: 'home',
    component: AppLayoutComponent,
    canLoad: [SessionGuard],
    canActivate: [SessionGuard],
    children: [
      {
        path: '',
        redirectTo: PedidosModuleLinks.MODULE_BASE_URL,
        pathMatch: 'full',
      },
      {
        path: PedidosModuleLinks.MODULE_BASE_URL,
        canLoad: [SessionGuard],
        canActivate: [SessionGuard],
        data: {
          breadcrumb: 'Pedidos',
        },
        loadChildren: () =>
        import('./modules/pedidos/pedidos.module').then(
          m => m.PedidosModule
        ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/recurso-no-encontrado',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
