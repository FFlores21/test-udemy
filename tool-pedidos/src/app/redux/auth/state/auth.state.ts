import { ActionReducerMap } from '@ngrx/store';
import { DataUser } from 'src/app/modules/auth/interfaces/data-user.interface';
import { authReducer } from '../reducers/auth.reducer';

export interface DataUserState {
  dataUser: Readonly<DataUser>;
}

export interface AuthState {
  Auth: DataUserState;
}

export const ROOT_REDUCERS_AUTH: ActionReducerMap<AuthState> = {
  Auth: authReducer,
};
