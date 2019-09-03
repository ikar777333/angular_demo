import { ActionReducerMap, createSelector, createFeatureSelector, 
    ActionReducer, MetaReducer } from '@ngrx/store';

import * as fromLoads from './loads';
import { Load } from '../../models/Load'

export interface State {
    loads: fromLoads.State;
}

export const reducers: ActionReducerMap<State> = {
    loads: fromLoads.reducer
};

export function logger(reducer: ActionReducer<State>):
    ActionReducer<State> {
        return function (state: State, action: any): State {
        console.log('state', state);
        console.log('action', action);
        return reducer(state, action);
    };
}
export const metaReducers: MetaReducer<State>[] = [logger];

export const getLoadState = 
    createFeatureSelector<fromLoads.State>('loads');

export const getAllLoads1 = createSelector(
    getLoadState,
    fromLoads.getLoads1,
);

export const getAllLoads2 = createSelector(
    getLoadState,
    fromLoads.getLoads2,
);

export const getRelatedLoads = (load: Load) => createSelector(
    getLoadState,
    (state) => {
        if(load.$isSupply) {
            return state.loads2.filter(function(element) {
                element.$isBusbar !== true;
            })
        } else {
            return state.loads2.filter(function(element) {
                element.$id !== load.$id;
            })
        }
    }
);
