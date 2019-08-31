import { Action } from '@ngrx/store';
import * as loadAction from '../actions/loads';

import { Load } from '../../models/Load';

export interface State {
  readonly loads: Array<Load>,
}

export const initialState: State = {
    loads: [ {
      id: 1, name: 'test1',
      description: 'test1',          
      },
    {
        id: 2, name: 'test2',
        description: 'test2',    
      },
    {
        id: 3, name: 'test3',
        description: 'test3',   
      },
    ]
  };

export function reducer(
    state: State = initialState, 
    action: loadAction.Action) {
      switch (action.type) {
        case loadAction.ADD_ONE: {
          const newLoad: Load = action.payload;
          return {...state, ...state.loads, newLoad}
        }
        default:
          return state;
      }
  }

export const getLoads = (state: State) => state.loads;