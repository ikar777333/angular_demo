import { Action } from '@ngrx/store';
import * as loadAction from '../actions/loads';

import { Load } from '../../models/Load';

export interface State {
  ids: number[];
  loads: { [id: number]: Load };
  selected: number;
}
export const initialState: State = {
  ids: [1, 2, 3],
  loads: {
    1: {
      id: 1, name: 'test1',
      loads: [],
      description: 'test1',           
      },
    2: {
        id: 2, name: 'test2',
        loads: [],
        description: 'test2',   
      },
    3: {
        id: 3, name: 'test3',
        loads: [],
        description: 'test3',   
      },
    },
    selected: null,
};

export function reducer(state = initialState, 
    action: loadAction.Action) {
      switch (action.type) {
        case loadAction.ADD_ONE: {
          const newLoad: Load = action.payload;
          return {
            ...state,
            ids: [...state.ids, newLoad.id],
            loads: { ...state.loads, newLoad }
          };
        }
        case loadAction.SELECT: {
          const id = action.payload;
          return {
            ...state,
            selected: id
          };
        }
        default:
          return state;
      }
  }

export const getIds = (state: State) => state.ids;
export const getLoads = (state: State) => state.loads;
export const getSelected = (state: State) => state.selected;