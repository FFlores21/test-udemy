import { OnInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectMenu } from '../redux/layout/selectors/layout.selector';
import { LayoutState } from './interfaces/Layout.state';
// import { selectMenuSidebar } from '../redux/layout/selectors/Layout.selectors';
// import { AppState } from '../redux/layout/state/app.state';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  menu: MenuItem[] = [];

  constructor(private store: Store<LayoutState>) {}

  ngOnInit() {
    this.store.select(selectMenu).subscribe(data => {
      this.menu = data;
    });
  }
}
