import { ActionReducerMap, createSelector, createFeatureSelector, 
    ActionReducer, MetaReducer } from '@ngrx/store';

import * as fromLoads from './loads';
import { Load } from '../../models/Load'
import { LoadTypes } from '../../models/LoadTypes.enum'

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

export const getAllLoads = createSelector(
    getLoadState,
    fromLoads.getLoads,
);

export const getNotAllocatedLoads = createSelector(
    getLoadState,
    (state) => {
        return state.loads.filter(function(element){
            return element.$isAllocated === false && element.$isBusbar === false;
        })
    },
);

export const getAllocatedLoads = createSelector(
    getLoadState,
    (state) => {
        return state.loads.filter(function(element){
            return element.$isAllocated === true && element.$isSupply === false ||
                    element.$isBusbar === true;
        })
    }
);

export const getSupplyAllocatedLoads = createSelector(
    getLoadState,
    (state) => {
        return state.loads.filter(function(element){
            return element.$isAllocated === true && element.$isSupply === true;
        })
    },
);

export const getRelatedLoads = (loadType: string, id: number) => createSelector(
    getLoadState,
    (state) => {
        let loads: Array<Load>;
        if(loadType === LoadTypes.TYPE2) {
            loads = state.loads.filter(function(element) {
                return element.$isBusbar === true;
            })
        } else {
            loads = state.loads.filter(function(element) {
                return element.$id !== id && element.$isAllocated === true && element.$isSupply === false ||
                        element.$isBusbar === true;
            })
            recursiveSearch(id, loads);
        }
        return loads.map(function(element) {
            return element.$id;
        })
    }
);

function recursiveSearch(parentId: number, loads: Array<Load>) {
    console.log(loads)
    var childrens = loads.map(function(element) {
        if(element.$parentId === parentId) {
            //recursiveSearch(element.$id, this);
            element.$id = -1;
        }
        return element;
    });

    console.log(childrens);
}
