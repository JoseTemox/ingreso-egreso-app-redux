import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { IncomeExpenses } from '../model/income-expenses.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IncomeExpensesService {
  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService
  ) {}

  createIncomeExpense(incomeExpense: IncomeExpenses) {
    return this.angularFirestore
      .doc(`${this.authService.user?.uid}/income-expense`)
      .collection('items')
      .add({ ...incomeExpense });
  }

  initIncomeExpenseListener(ui: string) {
    return this.angularFirestore
      .collection(`${ui}/income-expense/items`)
      .snapshotChanges()
      .pipe(
        map((resp) => {
          return resp.map((doc) => {
            return {
              ...(doc.payload.doc.data() as any),
              uid: doc.payload.doc.id,
            };
          });
        })
      );
  }

  deleteIncomingExpenses(uid: string) {
    return this.angularFirestore
      .doc(`${this.authService.user?.uid}/income-expense/items/${uid}`)
      .delete();
  }
}
