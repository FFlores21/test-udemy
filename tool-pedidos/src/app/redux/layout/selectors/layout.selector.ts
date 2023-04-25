import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayoutState, NOMBRE_LAYOUT_STATE } from '../state/layout.state';

export const selectFeature =
  createFeatureSelector<LayoutState>(NOMBRE_LAYOUT_STATE);

export const selectMenu = createSelector(selectFeature, state => [
  ...state.menuSidebar.menu,
]);
