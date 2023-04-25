import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TOKEN } from '../config/config';
import { AuthService } from '../modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.verificarToken();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.verificarToken();
  }

  verificarToken() {
    const token = sessionStorage.getItem(TOKEN) || '';

    if (!token) return false;

    const tokenValido = this.authService.validarToken(token);

    return tokenValido;
  }
}
