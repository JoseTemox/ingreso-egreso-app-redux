import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from './../../shared/ui.actions';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      console.log(ui);
      this.loading = ui.isLoading;
    });
  }

  login() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { name, email, password } = this.form.value;
    this.authService
      .loginUser(name, email, password)
      .then((credentials) => {
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
        console.log(credentials);
      })
      .catch((error) => {
        this.store.dispatch(ui.stopLoading());
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      });
  }
}
