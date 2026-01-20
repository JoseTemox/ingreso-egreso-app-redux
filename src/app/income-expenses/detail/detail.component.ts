import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IncomeExpenses } from 'src/app/model/income-expenses.model';
import { IncomeExpensesService } from 'src/app/services/income-expenses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styles: [],
})
export class DetailComponent implements OnInit, OnDestroy {
  incomeExpense: IncomeExpenses[] = [];
  userSub: Subscription;

  constructor(
    private store: Store<AppState>,
    private incomeExpenseService: IncomeExpensesService
  ) {}
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userSub = this.store
      .select('incomeExpenses')
      .subscribe(({ items }) => (this.incomeExpense = items));
  }

  delete(item: IncomeExpenses) {
    console.log(item);
    this.incomeExpenseService
      .deleteIncomingExpenses(item.uid)
      .then(() => Swal.fire('Borrado', 'Item borrado correctamente', 'success'))
      .catch((error) => Swal.fire('Error', error.message, 'error'));
  }
}
