import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IncomeExpenses } from '../model/income-expenses.model';
import { IncomeExpensesService } from '../services/income-expenses.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { uiReducer } from '../shared/ui.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

export enum btnType {
  income = 'income',
  expense = 'expense',
}

@Component({
  selector: 'app-income-expenses',
  templateUrl: './income-expenses.component.html',
  styles: [],
})
export class IncomeExpensesComponent implements OnInit, OnDestroy {
  incomeExpenseForm = this.fb.group({
    description: ['', Validators.required],
    amount: ['', Validators.required],
  });

  type = btnType.income;
  btnType = btnType;
  loading = false;
  unSubscribe: Subscription;

  constructor(
    private fb: FormBuilder,
    private incomeExpenseService: IncomeExpensesService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.unSubscribe = this.store
      .select('ui')
      .subscribe((ui) => (this.loading = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.unSubscribe.unsubscribe();
  }

  save() {
    console.log(this.type);
    console.log(this.incomeExpenseForm.value);

    this.store.dispatch(ui.isLoading());
    this.incomeExpenseForm.markAllAsTouched();
    if (this.incomeExpenseForm.invalid) {
      return;
    }

    const { amount, description } = this.incomeExpenseForm.value;
    const incomeExpense = new IncomeExpenses(
      description,
      amount,
      this.type,
      null
    );
    console.log(incomeExpense);

    this.incomeExpenseService
      .createIncomeExpense(incomeExpense)
      .then(() => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Registro Creado', description, 'success');
        this.incomeExpenseForm.reset();
      })
      .catch((error) => {
        this.store.dispatch(ui.stopLoading);
        Swal.fire('Error', error.message, 'error');
      });
  }
}
