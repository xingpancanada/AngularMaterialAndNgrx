import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training',
  templateUrl: './stop-training.component.html',
  styleUrls: ['./stop-training.component.scss']
})
export class StopTrainingComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any   ////52.passing data to the dialog
  ) { }

  ngOnInit(): void {
  }

}
