import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
// import { selectMenuSidebar } from 'src/app/redux/layout/selectors/Layout.selectors';
// import { AppState } from 'src/app/redux/layout/state/app.state';

export interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  componentTheme: string;
  ripple: boolean;
  menuMode: string;
  scale: number;
  menuTheme: string;
  topbarTheme: string;
  menuProfilePosition: string;
}

interface LayoutState {
  staticMenuMobileActive: boolean;
  overlayMenuActive: boolean;
  staticMenuDesktopInactive: boolean;
  configSidebarVisible: boolean;
  menuHoverActive: boolean;
  rightMenuActive: boolean;
  topbarMenuActive: boolean;
  menuProfileActive: boolean;
  revealMenuActive: boolean;
  anchored: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  config: AppConfig = {
    ripple: true,
    inputStyle: 'outlined',
    menuMode: 'slim',
    // menuMode: 'overlay',
    colorScheme: 'light',
    componentTheme: 'indigo',
    scale: 14,
    menuTheme: 'indigo',
    topbarTheme: 'indigo',
    menuProfilePosition: 'end',
  };

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    rightMenuActive: false,
    topbarMenuActive: false,
    menuProfileActive: false,
    revealMenuActive: false,
    anchored: false,
  };

  private configUpdate = new Subject<AppConfig>();

  private overlayOpen = new Subject<any>();

  private topbarMenuOpen = new Subject<any>();

  private menuProfileOpen = new Subject<any>();

  configUpdate$ = this.configUpdate.asObservable();

  overlayOpen$ = this.overlayOpen.asObservable();

  topbarMenuOpen$ = this.topbarMenuOpen.asObservable();

  menuProfileOpen$ = this.menuProfileOpen.asObservable();

  onMenuToggle() {
    if (this.isOverlay()) {
      this.state.overlayMenuActive = !this.state.overlayMenuActive;

      if (this.state.overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive =
        !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  onTopbarMenuToggle() {
    this.state.topbarMenuActive = !this.state.topbarMenuActive;
    if (this.state.topbarMenuActive) {
      this.topbarMenuOpen.next(null);
    }
  }

  onOverlaySubmenuOpen() {
    this.overlayOpen.next(null);
  }

  showConfigSidebar() {
    this.state.configSidebarVisible = true;
  }

  isOverlay() {
    return this.config.menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isSlim() {
    return this.config.menuMode === 'slim';
  }

  isHorizontal() {
    return this.config.menuMode === 'horizontal';
  }

  isMobile() {
    return !this.isDesktop();
  }

  onConfigUpdate() {
    this.configUpdate.next(this.config);
  }

  isRightMenuActive(): boolean {
    return this.state.rightMenuActive;
  }

  openRightSidebar(): void {
    this.state.rightMenuActive = true;
  }

  onMenuProfileToggle() {
    this.state.menuProfileActive = !this.state.menuProfileActive;
    if (
      this.state.menuProfileActive &&
      this.isHorizontal() &&
      this.isDesktop()
    ) {
      this.menuProfileOpen.next(null);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  replaceThemeLink(href: string, onComplete: Function) {
    const id = 'theme-link';
    const themeLink = <HTMLLinkElement>document.getElementById(id);
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
      onComplete();
    });
  }

  onColorSchemeChange(colorScheme: string) {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-link');
    const themeLinkHref = themeLink.getAttribute('href');
    const currentColorScheme = 'theme-' + this.config.colorScheme;
    const newColorScheme = 'theme-' + colorScheme;
    const newHref = themeLinkHref!.replace(currentColorScheme, newColorScheme);
    this.replaceThemeLink(newHref, () => {
      this.config.colorScheme = colorScheme;
      if (colorScheme === 'dark') {
        this.config.menuTheme = 'dark';
      }
      this.onConfigUpdate();
    });
  }
}
