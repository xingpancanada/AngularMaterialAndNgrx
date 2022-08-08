import { tap } from 'rxjs/operators';
// import { AppState, getIsLoading } from './../app.reducer';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TrainingService } from './training.service';
import * as fromTraining from './training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  ongoingTraining = false;
  //isLoading$?: Observable<boolean>;

  ongoingTraining$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    //private appStore: Store<AppState>
    private store: Store<fromTraining.State>
  ) {
    // this.isLoading$ = this.appStore.select(state => state.isLoading).pipe(
    //   tap(resp => console.log(resp))
    // );
  }

  ngOnInit(): void {
    // this.isLoading$ = this.appStore.select(state => state.isLoading).pipe(
    //   tap(resp => console.log(resp))
    // );

    // this.isLoading$ = this.appStore.select(getIsLoading);

    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);
  }

}
