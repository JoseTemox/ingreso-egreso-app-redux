import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { User } from '../model/user.model';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscriptions: Subscription;
  constructor(
    private angularFireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.angularFireAuth.authState.subscribe((fUser) => {
      if (fUser) {
        this.userSubscriptions = this.firestore
          .doc(`${fUser.uid}/user`)
          .valueChanges()
          .subscribe((fireStoreUser: any) => {
            // console.log(fireStoreUser);
            const user = User.fromFireBase(fireStoreUser);
            // console.log(user.email);
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        this.userSubscriptions.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  createUser(name: string, email: string, password) {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new User(user.uid, name, user.email);
        return this.firestore.doc(`${user.uid}/user`).set({ ...newUser });
      });
  }
  loginUser(name: string, email: string, password) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  logOut() {
    return this.angularFireAuth.signOut();
  }

  isAuth() {
    return this.angularFireAuth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
