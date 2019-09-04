import { Action } from '@ngrx/store';
import * as loadAction from '../actions/loads';

import { Load } from '../../models/Load';
import { LoadAreas } from 'src/app/models/LoadAreas.enum';
import { LoadPurposes } from 'src/app/models/LoadPurposes.enum';
import { LoadSubPurposes } from 'src/app/models/LoadSubPurposes.enum';
import { LoadTypes } from 'src/app/models/LoadTypes.enum';

export interface State {
   loads1: Array<Load>,
   loads2: Array<Load>,
   loads3: Array<Load>,
}

export const initialState: State = {
    loads1: [ 
      new Load(1, "test1", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, null, false),
      new Load(2, "test2", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, null, false),
      new Load(3, "test3", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, null, false),
    ],
    loads2: [ 
      new Load(4, "test4", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, null, true),
      new Load(5, "test5", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, 4, false),
      new Load(6, "test6", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE1, 5, false),
    ],
    loads3: [
      new Load(7, "test7", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE2, 4, false),
      new Load(8, "test8", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE2, 4, false),
      new Load(9, "test9", LoadAreas.AREA1, LoadPurposes.PURPOSE1, 
        LoadSubPurposes.SUB_PURPOSE1, LoadTypes.TYPE2, 4, false),
    ]
};

export function reducer(
    state: State = initialState, 
    action: loadAction.Action) {
      switch (action.type) {
        case loadAction.ADD_ONE: {
          const newLoad: Load = action.payload;
          state.loads1.push(newLoad);
          return state;
        }
        case loadAction.CHANGE_POSITION1: {
          state.loads1 = action.payload;
          return state;
        }
        case loadAction.CHANGE_POSITION2: {
          state.loads2 = action.payload;
          return state;
        }
        default:
          return state;
      }
  }

export const getLoads1 = (state: State) => state.loads1;

export const getLoads2 = (state: State) => state.loads2;