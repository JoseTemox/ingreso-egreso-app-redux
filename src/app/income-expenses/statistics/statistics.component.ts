import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IncomeExpenses } from 'src/app/model/income-expenses.model';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styles: [],
})
export class StatisticsComponent implements OnInit {
  incomes = 0;
  expenses = 0;
  totalIncomes = 0;
  totalExpenses = 0;

  labels: Label[] = ['Incomes', 'Expenses'];
  data: MultiDataSet = [[]];
  chartType: ChartType = 'doughnut';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select('incomeExpenses').subscribe(({ items }) => {
      this.generateStatics(items);
    });
  }

  generateStatics(items: IncomeExpenses[]) {
    this.totalExpenses = 0;
    this.totalIncomes = 0;
    this.incomes = 0;
    this.expenses = 0;
    for (const item of items) {
      if (item.type === 'expense') {
        this.totalExpenses += item.amount;
        this.expenses++;
      } else {
        console.log(item.amount);
        this.totalIncomes += item.amount;
        this.incomes++;
      }
    }

    this.data = [[this.totalIncomes, this.totalExpenses]];
  }

  get netBalance(): number {
    return this.totalIncomes - this.totalExpenses;
  }
}
