import { TrainingService } from './../training.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Exercise } from '../exercise.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  @Output() trainingStart = new EventEmitter<void>();

  exercises$!: Observable<any>;
  isLoading$: Observable<boolean> | undefined;

  exercises: Exercise[] = [];

  constructor(
    private trainingService: TrainingService,
    private angularFirestore: AngularFirestore,  //as db
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit(): void {
    //this.exercises = this.trainingService.getAvailableExercises();
    // this.angularFirestore.collection('availableExercises').valueChanges().subscribe((resp: any) => {
    //   console.log(resp);
    //   this.exercises = resp;
    // })

    //this.exercises$ = this.angularFirestore.collection('availableExercises').valueChanges();

    // this.exercises$ = this.angularFirestore.collection('availableExercises').snapshotChanges().pipe(
    //   tap((resp: any) => console.log(resp)),  //compare with line45 to see the difference
    //   map((docArray: any) => {
    //     return docArray.map((doc: any) => {
    //       return{
    //         id: doc.payload.doc.id,   //how to add uid back here!!! use snapshotChanges()
    //         ...doc.payload.doc.data()
    //       };
    //     });
    //   })
    // )
    // // .subscribe((resp: any) => {
    // //   console.log(resp);
    // //   this.exercises = resp;
    // // })
    // ;

    //87
    this.trainingService.fetchAvailableExercises();
    //this.exercises$ = this.trainingService.exercisesChangedSj;
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    console.log(form.value);
    this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises(){
    this.trainingService.fetchAvailableExercises();
  }
}

