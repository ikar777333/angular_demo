import { Action } from '@ngrx/store';
import { Load } from '../../models/Load';

export const SELECT = '[Loads] Select';
export const ADD_ONE = '[Loads] Add One';

export class Select implements Action {
    readonly type = SELECT;
    constructor(public payload: number) { }
}

export class AddOne implements Action {
    readonly type = ADD_ONE;
    constructor(public payload: Load) { }
}

export type Action = AddOne | Select;