import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  user: User = null;
  userSub: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.userSub = this.store
      .select('user')
      .pipe(filter(({ user }) => user !== null))
      .subscribe(({ user }) => {
        this.user = user;
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  logOut() {
    this.authService
      .logOut()
      .then((resp) => this.router.navigate(['/login']))
      .catch((resp) => console.log(resp));
  }
}
