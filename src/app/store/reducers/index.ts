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
    fromLoads.getAllLoads
);

export const getNotAllocatedLoads = createSelector(
    getLoadState,
    fromLoads.getNotAllocatedLoads
);

export const getAllocatedLoads = createSelector(
    getLoadState,
    fromLoads.getAllocatedLoads
);

export const getSupplyAllocatedLoads = createSelector(
    getLoadState,
    fromLoads.getSupplyAllocatedLoads
);

export const getRelatedLoads = (loadType: string, id: number) => createSelector(
    getAllocatedLoads,
    (loads) => {
        let relatedLoads;
        if(loadType === LoadTypes.TYPE2) {
            relatedLoads = loads.filter(function(element) {
                return element.$isBusbar === true;
            })
        } else {
            relatedLoads = loads.filter(function(element) {
                return element.$isBusbar === true;})
            relatedLoads = recursiveSearch(id, relatedLoads);
        }
        relatedLoads = relatedLoads.map(function(element){
            return {
                loadName: element.$name,
                loadId:   element.$id,
            }
        })
        relatedLoads.push({loadName: "",loadId: null,});
        return relatedLoads;
    }
);

function recursiveSearch(parentId: number, loads: Array<Load>, loadIds: Array<Load> = []): Array<Load> {
    for(var i = 0; i < loads.length; i++) {
        if (loads[i].$id !== parentId) {
          loadIds.push(loads[i]);
          if (loads[i].$childrenLoads && loads[i].$childrenLoads.length)
            recursiveSearch(parentId, loads[i].$childrenLoads, loadIds);
        }
    }
    return loadIds;
}
export interface RelatedLoad {
    loadName: string,
    loadId:   number,
  }