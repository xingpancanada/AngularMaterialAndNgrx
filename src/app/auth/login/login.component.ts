import { tap } from 'rxjs/operators';
import { AppState } from './../../app.reducer';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading$?: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private appStore: Store<{app: AppState}>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.appStore.select(state => state.app.isLoading).pipe(
      tap(resp => console.log(resp))
    );

    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm!.value.email,
      password: this.loginForm!.value.password
    });
  }
}
