import { ActionReducerMap, createSelector, createFeatureSelector, 
    ActionReducer, MetaReducer } from '@ngrx/store';

import * as fromLoads from './loads';

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

export const getRelatedLoads = (relatedLoad, isSupply) => createSelector(
    getLoadState,
    (state) => {
        state.loads1.forEach(function(element) {
            console.log(element + "dawd")
        })
        return state.loads1;
    }
);
