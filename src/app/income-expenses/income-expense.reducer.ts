import { createReducer, on } from '@ngrx/store';
import { setItems, unSetItems } from './income-expense.actions';
import { IncomeExpenses } from '../model/income-expenses.model';

export interface State {
  items: IncomeExpenses[];
}

export const initialState: State = {
  items: [],
};

const _incomeExpenseReducer = createReducer(
  initialState,

  on(setItems, (state, { items }) => ({ ...state, items: [...items] })),
  on(unSetItems, (state) => ({ ...state, items: [] }))
);

export function incomeExpenseReducer(state, action) {
  return _incomeExpenseReducer(state, action);
}
