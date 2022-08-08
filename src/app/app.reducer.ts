import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { START_LOADING, STOP_LOADING, AppActions } from './app.actions';
import { localStorageSync } from 'ngrx-store-localstorage';
import { routerReducer } from '@ngrx/router-store';

export interface AppState {
  isLoading: boolean,

}

const initialState: AppState = {
  isLoading: false,
}


export function appReducer(state = initialState, action: AppActions){
  switch(action.type){
    case START_LOADING:
      return {
        isLoading: true
      };
    case STOP_LOADING:
      return {
        isLoading: false
      };
    default:
      return state;
  }
}

const counterReducer = (counter = 0, action: any) => {
  switch(action.type) {
    case 'INCREMENT':
      return counter + 1;
    default:
      return counter;
  }
};

//for multiple states
export interface State
{
  app: AppState,
  counter: number,
  router: any
}

//for multiple states
export const reducers: ActionReducerMap<State> = {
  app: appReducer,
  counter: counterReducer,
  router: routerReducer
}


//22.  --> for routing
// what props we will sync to localStorage `counter`, `router`
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['counter', 'router'], rehydrate: true })(reducer)
}

//Developers can think of meta-reducers as hooks into the action->reducer pipeline.
//Meta-reducers allow developers to pre-process actions before normal reducers are invoked.
export const metaReducers: MetaReducer<any, any>[] = [localStorageSyncReducer];



