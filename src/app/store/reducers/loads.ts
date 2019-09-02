import { Action } from '@ngrx/store';
import * as loadAction from '../actions/loads';

import { Load } from '../../models/Load';

export interface State {
   loads1: Array<Load>,
   loads2: Array<Load>,
}

export const initialState: State = {
    loads1: [ {
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
    ],
    loads2: [ {
      id: 4, name: 'test1',
      description: 'test1',          
      },
    {
        id: 5, name: 'test2',
        description: 'test2',    
      },
    {
        id: 6, name: 'test3',
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