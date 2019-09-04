import { Action } from '@ngrx/store';
import { Load } from '../../models/Load';
 
export const CHANGE_LOAD = '[Loads] Change load';
export const ADD_ONE = '[Loads] Add One';

export class ChangeLoad implements Action {
    readonly type = CHANGE_LOAD;
    constructor(public payload: Load) { }
}
export class AddOne implements Action {
    readonly type = ADD_ONE;
    constructor(public payload: Load) { }
}

export type Action = AddOne | ChangeLoad;