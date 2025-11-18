import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { User } from '../model/user.model';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.angularFireAuth.authState.subscribe((resp) => {
      resp?.uid;
      resp?.email;
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
