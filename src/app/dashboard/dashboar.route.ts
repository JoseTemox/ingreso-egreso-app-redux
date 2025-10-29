import { Routes } from '@angular/router';
import { StatisticsComponent } from '../income-expenses/statistics/statistics.component';
import { IncomeExpensesComponent } from '../income-expenses/income-expenses.component';
import { DetailComponent } from '../income-expenses/detail/detail.component';

export const dashBoardRouter: Routes = [
  { path: '', component: StatisticsComponent },
  { path: 'income-expense', component: IncomeExpensesComponent },
  { path: 'detail', component: DetailComponent },
];
