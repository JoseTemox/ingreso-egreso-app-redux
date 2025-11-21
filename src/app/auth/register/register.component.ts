import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from './../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
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

  ngOnInit(): void {
    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.loading = ui.isLoading));
  }
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  save() {
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
    this.store.dispatch(ui.isLoading());

    const { name, email, password } = this.form.value;
    console.log(this.form.value);
    this.authService
      .createUser(name, email, password)
      .then((credentials) => {
        this.store.dispatch(ui.stopLoading());

        console.log(credentials);
        // Swal.close();
        this.router.navigate(['/']);
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
