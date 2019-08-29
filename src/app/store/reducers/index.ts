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

export const getLoadstate = 
    createFeatureSelector<fromLoads.State>('loads');

export const getIds = createSelector(
    getLoadstate,
    fromLoads.getIds,
);

export const getLoads = createSelector(
    getLoadstate,
    fromLoads.getLoads,
);

export const getSelected = createSelector(
    getLoadstate,
    fromLoads.getSelected,
);

export const getSelectedLoad = createSelector(
    getSelected,
    getLoads,
    (selectedId, loads) => {
        return {
            ...loads[selectedId]
        };
    }
);

export const getAllLoads = createSelector(
    getIds,
    getLoads,
    (ids, loads) => {
        return ids.map(id => loads[id]);
    }
);