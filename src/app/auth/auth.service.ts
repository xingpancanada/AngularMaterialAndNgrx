import { StartLoading, StopLoading } from './../app.actions';

import { TrainingService } from './../training/training.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChangeSj = new Subject<boolean>()
  private user?: User | null;
  isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackBar: MatSnackBar,
    private appStore: Store<{app:AppState}>
  ) { }

  initAuthListener(){
    this.afAuth.authState.subscribe(user => {
      if(user){
        this.isAuthenticated = true;
        this.authChangeSj.next(true);
        this.router.navigate(['/training']);
      }else{
        this.afAuth.signOut();
        this.authChangeSj.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    })
  }

  registerUser(authData: AuthData){
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    this.appStore.dispatch({type: 'START_LOADING'});
    this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(resp => {
      console.log(resp);
      // this.authChangeSj.next(true);
      // this.router.navigate(['/training']);
      this.appStore.dispatch({type: 'STOP_LOADING'});
      this.authSuccessfully();
    }).catch(error => {
      console.log(error);
      this.appStore.dispatch({type: 'STOP_LOADING'});
      this.snackBar.open(error.message, '', {duration: 3000});
    });

  }

  login(authData: AuthData){
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    //this.appStore.dispatch({type: 'START_LOADING'});
    this.appStore.dispatch(new StartLoading());
    this.afAuth.signInWithEmailAndPassword(authData.email, authData.password).then(resp => {
      console.log(resp);
      // this.authChangeSj.next(true);
      // this.router.navigate(['/training']);
      //this.appStore.dispatch({type: 'STOP_LOADING'});
      this.appStore.dispatch(new StopLoading());
      this.authSuccessfully();
    }).catch(error => {
      console.log(error);
      //this.appStore.dispatch({type: 'STOP_LOADING'});
      this.appStore.dispatch(new StopLoading());
      this.snackBar.open(error.message, '', {duration: 3000});
    });
  }

  logout(){
    //this.user = null;
    this.trainingService.cancelSubscription(); //96
    this.afAuth.signOut();
    this.authChangeSj.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  getUser(){
    return { ...this.user };
  }

  isAuth(){
    return this.isAuthenticated;
  }

  authSuccessfully(){
    this.isAuthenticated = true;
    this.authChangeSj.next(true);
    this.router.navigate(['/training']);
  }
}
