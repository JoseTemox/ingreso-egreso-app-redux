import { createAction, props } from '@ngrx/store';
import { IncomeExpenses } from '../model/income-expenses.model';

export const unSetItems = createAction('[IncomeExpense] Unset Items');

export const setItems = createAction(
  '[IncomeExpense] Set Items',
  props<{ items: IncomeExpenses[] }>()
);
