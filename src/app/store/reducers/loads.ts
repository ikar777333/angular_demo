import { Action } from '@ngrx/store';
import lodash from 'lodash';
import * as loadAction from '../actions/loads';
import { Load } from '../../models/Load';
import { LoadAreas } from 'src/app/models/LoadAreas.enum';
import { LoadPurposes } from 'src/app/models/LoadPurposes.enum';
import { LoadSubPurposes } from 'src/app/models/LoadSubPurposes.enum';
import { LoadTypes } from 'src/app/models/LoadTypes.enum';

export interface State {
   loads: Array<Load>,
}

export const initialState: State = {
    loads: [ 
      new Load(1, "test1", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], null, false),
      new Load(2, "test2", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], null, false),
      new Load(3, "test3", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], null, false),

      new Load(4, "test4", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [
          new Load(5, "test5", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
            LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [
              new Load(6, "test6", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
                LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], 5, false),
            ], 4, false),
          new Load(10, "test10", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
            LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [
              new Load(11, "test11", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
                LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], 10, false),
            ], 4, false),
        ], null, true),

      new Load(7, "test7", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE2, [], 4, false),
      new Load(8, "test8", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE2, [], 4, false),
      new Load(9, "test9", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE2, [], 4, false),
    ]
};

export function reducer(
    state: State = initialState, 
    action: loadAction.Action) {
      switch (action.type) {
        case loadAction.ADD_ONE: {
          const newLoad: Load = action.payload;
          state.loads.push(newLoad);
          return state;
        }
        case loadAction.CHANGE_LOAD: {
          const newLoad: Load = action.payload;
          var index = lodash.findIndex(state.loads, {id: newLoad.$id});
          state.loads.splice(index, 1, newLoad);
          return state;
        }
        default:
          return state;
      }
  }

export const getLoads = (state: State) => state.loads;

export const getNotAllocatedLoads = (loads: Array<Load>) => {
    return loads.filter(function(element){
        return element.$isAllocated === false && element.$isBusbar === false;
    })
}

export const getAllocatedLoads = (loads: Array<Load>) => {
    var loads = loads.filter(function(element) {
        return element.$isBusbar === true;})
    return recursiveSearch(loads);
}

export const getSupplyAllocatedLoads = (loads: Array<Load>) => {
    return loads.filter(function(element){
        return element.$isAllocated === true && element.$isSupply === true;})
}

function recursiveSearch(loads: Array<Load>, loadIds: Array<Load> = []): Array<Load> {
  for(var i = 0; i < loads.length; i++) {
      loadIds.push(loads[i]);
      if (loads[i].$childrenLoads && loads[i].$childrenLoads.length)
          recursiveSearch(loads[i].$childrenLoads, loadIds);
  }
  return loadIds;
}