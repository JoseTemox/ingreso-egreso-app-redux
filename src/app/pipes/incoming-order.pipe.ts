import { Pipe, PipeTransform } from '@angular/core';
import { IncomeExpenses } from '../model/income-expenses.model';

@Pipe({
  name: 'incomingOrder',
})
export class IncomingOrderPipe implements PipeTransform {
  transform(items: IncomeExpenses[]): IncomeExpenses[] {
    return items.sort((a, b) => {
      if (a.type === 'income') {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
