import { Action } from '@ngrx/store';
import { Load } from '../../models/Load';
 
export const CHANGE_LOAD_STATE = '[Loads] Change load state';
export const ADD_ONE = '[Loads] Add One';

export class ChangeLoadState implements Action {
    readonly type = CHANGE_LOAD_STATE;
    constructor(public payload: {oldLoad: Load, newLoad: Load }) { }
}
export class AddOne implements Action {
    readonly type = ADD_ONE;
    constructor(public payload: Load) { }
}

export type Action = AddOne | ChangeLoadState;