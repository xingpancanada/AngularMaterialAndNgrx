import { Action } from '@ngrx/store';

export const START_LOADING = '[APP] Start Loading';
export const STOP_LOADING = '[APP] Stop Loading';

export class StartLoading implements Action {
  readonly type = START_LOADING;
}

export class StopLoading implements Action {
  readonly type = STOP_LOADING;
}

export type AppActions = StartLoading | StopLoading;
