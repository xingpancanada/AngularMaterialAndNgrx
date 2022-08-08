import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, Subscription, take} from 'rxjs';
import { Exercise } from './exercise.model';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import { StartLoading, StopLoading } from '../app.actions';
import { SetAvailableTrainings, SetFinishedTrainings, StartTraining, StopTraining } from './training.actions';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  exerciseChangedSj = new Subject<Exercise | null>();
  exercisesChangedSj = new Subject<Exercise[] | null>();
  finishedExercisesChangedSj = new Subject<Exercise[] | null>();

  private availableExercises: Exercise[] = [
    // { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    // { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    // { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    // { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private runningExercise?: Exercise | null;
  private exercises: Exercise[] = [];
  private finishedExercises: Exercise[] = [];

  private fbSubs: Subscription[] = [];

  constructor(
    private afs: AngularFirestore, //as db
    private store: Store<fromTraining.State>
  ) { }

  getRunningExercises(){
    return {...this.runningExercise};
  }

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  fetchAvailableExercises(){
    this.store.dispatch(new StartLoading());
    this.fbSubs.push(  //96
      this.afs.collection('availableExercises').snapshotChanges().pipe(
        tap((resp: any) => console.log(resp)),  //compare with line47 to see the difference
        map((docArray: any) => {
          return docArray.map((doc: any) => {
            return{
              id: doc.payload.doc.id,   //how to add uid back here!!! use snapshotChanges()
              ...doc.payload.doc.data()
            };
          });
        })
      ).subscribe((resp: any) => {
        console.log(resp);
        this.availableExercises = resp;
        // this.exercisesChangedSj.next([...this.availableExercises]);
        this.store.dispatch(new StopLoading());
        this.store.dispatch(new SetAvailableTrainings([...this.availableExercises]));
      })
    )
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(  //96
      this.afs.collection('finishedExercises').snapshotChanges().pipe(
        tap((resp: any) => console.log(resp)),
        map((docArray: any) => {
          return docArray.map((doc: any) => {
            return{
              id: doc.payload.doc.id,   //how to add uid back here!!! use snapshotChanges()
              ...doc.payload.doc.data()
            };
          });
        })
      ).subscribe((resp: any) => {
        console.log(resp);
        this.finishedExercises = resp;
        //this.finishedExercisesChangedSj.next([...this.finishedExercises]);
        this.store.dispatch(new SetFinishedTrainings([...this.finishedExercises]));
      })
    )
  }

  startExercise(name: string){
    //simple update to add a property in afs
    //this.afs.doc('availableExercises/' + name).update({lastUpdatedData: new Date()});

    // const selectedExercise = this.availableExercises.find(ex => ex.name === name);
    // if(selectedExercise){
    //   console.log(selectedExercise);
    //   this.runningExercise = selectedExercise;
    //   this.exerciseChangedSj.next({...this.runningExercise});
    // }

    this.store.dispatch(new StartTraining(name));
  }

  completeExercise(){
    //this.exercises.push({...this.runningExercise!, date: new Date(), state: 'completed'});
    // if(this.runningExercise){
    //   this.addDataToDatabase({...this.runningExercise!, date: new Date(), state: 'completed'});
    // }

    // this.runningExercise = null;
    // this.exerciseChangedSj.next(null);

    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe((ex: any) => {
      this.addDataToDatabase({
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new StopTraining());
    });
  }

  cancelExercise(progress: number){
    // if(this.runningExercise){
    //   // this.exercises.push({...this.runningExercise,
    //   //   date: new Date(),
    //   //   duration: this.runningExercise.duration * progress / 100,
    //   //   calories: this.runningExercise.duration * progress / 100,
    //   //   state: 'cancelled'});
    //   this.addDataToDatabase({...this.runningExercise,
    //     date: new Date(),
    //     duration: this.runningExercise.duration * progress / 100,
    //     calories: this.runningExercise.duration * progress / 100,
    //     state: 'cancelled'});
    //   this.runningExercise = null;
    //   this.exerciseChangedSj.next(null);
    // }

    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new StopTraining());
    });
  }

  addDataToDatabase(exercise: Exercise) {
    this.afs.collection('finishedExercises').add(exercise);
  }

  cancelSubscription(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
