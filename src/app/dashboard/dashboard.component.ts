import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { concatMap, filter, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { IncomeExpensesService } from '../services/income-expenses.service';
import * as incomeExpenseActions from '../income-expenses/income-expense.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  constructor(
    private store: Store<AppState>,
    private incomeExpensesService: IncomeExpensesService
  ) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select('user')
      .pipe(
        filter((auth) => auth.user !== null),
        concatMap(({ user }) =>
          this.incomeExpensesService.initIncomeExpenseListener(user.uid).pipe(
            tap((incomeExpenseFB) => {
              this.store.dispatch(
                incomeExpenseActions.setItems({ items: incomeExpenseFB })
              );
            })
          )
        )
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
