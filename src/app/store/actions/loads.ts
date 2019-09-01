import { Action } from '@ngrx/store';
import { Load } from '../../models/Load';
 
export const CHANGE_POSITION1 = '[Loads] Change Position1';
export const CHANGE_POSITION2 = '[Loads] Change Position2';
export const ADD_ONE = '[Loads] Add One';

export class ChangePosition1 implements Action {
    readonly type = CHANGE_POSITION1;
    constructor(public payload: unknown[]) { }
}

export class ChangePosition2 implements Action {
    readonly type = CHANGE_POSITION2;
    constructor(public payload: unknown[]) { }
}

export class AddOne implements Action {
    readonly type = ADD_ONE;
    constructor(public payload: Load) { }
}

export type Action = AddOne | ChangePosition1 | ChangePosition2;