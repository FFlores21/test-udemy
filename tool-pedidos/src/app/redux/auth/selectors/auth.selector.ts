import { AuthState } from '../state/auth.state';

export const selectDataUser = (state: AuthState) => state.Auth.dataUser;
