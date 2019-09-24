import { Action } from '@ngrx/store';
import lodash from 'lodash';
import * as loadAction from '../actions/loads';
import { Load } from '../../models/Load';
import { LoadAreas } from 'src/app/models/LoadAreas.enum';
import { LoadPurposes } from 'src/app/models/LoadPurposes.enum';
import { LoadSubPurposes } from 'src/app/models/LoadSubPurposes.enum';
import { LoadTypes } from 'src/app/models/LoadTypes.enum';

export interface State {
  notAllocatedLoads:    Array<Load>,
  allocatedLoads:       Array<Load>
  supplyAllocatedLoads: Array<Load>,
}

export const initialState: State = {
  notAllocatedLoads: [ 
    new Load(1, "test1", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
      LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], null, false),
    new Load(2, "test2", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
      LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], null, false),
    new Load(3, "test3", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
      LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], null, false),
  ],
  allocatedLoads: [
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
    new Load(12, "test12", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
    LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [
      new Load(13, "test13", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [
          new Load(14, "test14", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
            LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], 13, false),
        ], 12, false),
      new Load(15, "test15", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [
          new Load(16, "test16", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
            LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, [], 15, false),
        ], 12, false),
    ], null, true),
  ],
  supplyAllocatedLoads: [
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
          return state;
        }
        case loadAction.CHANGE_LOAD_STATE: {
          const newLoad: Load = action.payload.newLoad;
          const oldLoad: Load = action.payload.oldLoad;
          
          if(newLoad.$parentId !== oldLoad.$parentId || newLoad.$isSupply !== oldLoad.$isSupply) {
            removeFromOldLoad(oldLoad, state);
            moveToNewLoad(newLoad, state);
            if(newLoad.$childrenLoads.length)
              removeChildrenLoads(newLoad, state);
          } else 
            updateLoad(newLoad, state);

          return state;
        }
        default:
          return state;
      }
  }

export const getNotAllocatedLoads = (state: State) => state.notAllocatedLoads;

export const getAllocatedLoads = (state: State) => state.allocatedLoads;

export const getSupplyAllocatedLoads = (state: State) => state.supplyAllocatedLoads;

export const getAllLoads = (state: State) => {
  let allLoads: Array<Load> = []
  allLoads = allLoads.concat(state.notAllocatedLoads);
  allLoads = allLoads.concat(getLoadsRecursive(state.allocatedLoads, state));
  allLoads = allLoads.concat(state.supplyAllocatedLoads);
  return allLoads;
}

function getLoadsRecursive(loads: Array<Load>, state: State, allLoads: Array<Load> = []): Array<Load> {
  for(var i = 0; i < loads.length; i++) {
    allLoads.push(loads[i]);
    if (loads[i].$childrenLoads && loads[i].$childrenLoads.length)
        getLoadsRecursive(loads[i].$childrenLoads, state, allLoads);
  }
  return allLoads;
}

function removeFromOldLoad(load: Load, state: State) {
  console.log("removeFromOldLoad")
  if(load.$parentId === null) {
    var index = lodash.findIndex(state.notAllocatedLoads, {id: load.$id});
    state.notAllocatedLoads.splice(index, 1);
  } else if (load.$isSupply) {
    var index = lodash.findIndex(state.supplyAllocatedLoads, {id: load.$id});
    state.supplyAllocatedLoads.splice(index, 1);
  } else {
    var parent = recursiveSearch(load.$parentId, state.allocatedLoads);
    var index = lodash.findIndex(parent.$childrenLoads, {id: load.$id});
    parent.$childrenLoads.splice(index, 1);
  }
}

function moveToNewLoad(load: Load, state: State) {
  console.log("moveToNewLoad")
  if(load.$parentId === null) {
    state.notAllocatedLoads.push(load);
  } else if (load.$isSupply) {
    state.supplyAllocatedLoads.push(load);
  } else {
    recursiveSearch(load.$parentId, state.allocatedLoads)
      .$childrenLoads.push(load)
  }
}

function updateLoad(load: Load, state: State) {
  console.log("updateLoad")
  if(load.$parentId === null) {
    var index = lodash.findIndex(state.allocatedLoads, {id: load.$id});
    state.allocatedLoads.splice(index, 1, load);
  } else if (load.$isSupply) {
    var index = lodash.findIndex(state.allocatedLoads, {id: load.$id});
    state.supplyAllocatedLoads.splice(index, 1, load);
  } else {
    var parent = recursiveSearch(load.$parentId, state.allocatedLoads);
    var index = lodash.findIndex(parent.$childrenLoads, {id: load.$id});
    parent.$childrenLoads.splice(index, 1, load);
  }
}

function removeChildrenLoads(load: Load, state: State) {
  console.log("removeChildrenLoads")
  load.$childrenLoads.forEach(function(element){
    element.$parentId = null;
    state.notAllocatedLoads.push(element);
  })
  load.$childrenLoads.length = 0;
}

function recursiveSearch(id: number, loads: Array<Load>): Load {
  var load;
  for(var i = 0; i < loads.length; i++) {
      if(loads[i].$id === id) {
        load = loads[i]
        return load;
      } else if(loads[i].$childrenLoads && loads[i].$childrenLoads.length) {
        load = recursiveSearch(id, loads[i].$childrenLoads);
        if(load && load.$id === id)
          return load;
      }  
  }
  return load;
}