import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MegaMenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { Modulo } from './interfaces/Modulo.interface';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent {
  @ViewChild('menuButton') menuButton!: ElementRef;

  @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef;

  @ViewChild('searchInput') searchInput!: ElementRef;

  modulos: Modulo[] = [];
  menu: MegaMenuItem[] = [];
  subscripciones: Subscription[] = [];

  constructor(public layoutService: LayoutService, public el: ElementRef) {}

  activeItem!: number;

  get mobileTopbarActive(): boolean {
    return this.layoutService.state.topbarMenuActive;
  }

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  onRightMenuButtonClick() {
    this.layoutService.openRightSidebar();
  }

  onMobileTopbarMenuButtonClick() {
    this.layoutService.onTopbarMenuToggle();
  }

  focusSearchInput() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
  }
}
