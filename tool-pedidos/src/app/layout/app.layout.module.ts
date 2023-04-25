import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { AppConfigModule } from './config/app.config.module';
import { AppLayoutComponent } from './app.layout.component';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { AppMenuProfileComponent } from './app.menuprofile.component';
import { AppTopbarComponent } from './app.topbar.component';
import { AppRightMenuComponent } from './app.rightmenu.component';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppSidebarComponent } from './app.sidebar.component';
import { AppFooterComponent } from './app.footer.component';
import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { StyleClassModule } from 'primeng/styleclass';

import { PrimeNgModule } from '../modules/prime-ng/prime-ng.module';
import { NgProgressModule } from 'ngx-progressbar';
import { StoreModule } from '@ngrx/store';
import { AppHomeComponent } from './app.home.component';
import {
  NOMBRE_LAYOUT_STATE,
  ROOT_REDUCERS_LAYOUT,
} from '../redux/layout/state/layout.state';

@NgModule({
  declarations: [
    AppLayoutComponent,
    AppBreadcrumbComponent,
    AppMenuProfileComponent,
    AppTopbarComponent,
    AppRightMenuComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppMenuitemComponent,
    AppFooterComponent,
    AppHomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StyleClassModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    TooltipModule,
    MegaMenuModule,
    RippleModule,
    RouterModule,
    ButtonModule,
    MenuModule,
    AppConfigModule,
    PrimeNgModule,
    NgProgressModule,
    StoreModule.forFeature(NOMBRE_LAYOUT_STATE, ROOT_REDUCERS_LAYOUT),
  ],
})
export class AppLayoutModule {}
