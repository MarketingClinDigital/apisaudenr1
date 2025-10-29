export const BACKOFFICE_STORAGE_KEY = 'backoffice-authenticated';
export const BACKOFFICE_AUTH_EVENT = 'backoffice-auth-change';
export const BACKOFFICE_PROFILE_EVENT = 'backoffice-profile-action';

export type BackofficeProfileAction =
  | 'view-profile'
  | 'edit-profile'
  | 'settings'
  | 'sign-out';

