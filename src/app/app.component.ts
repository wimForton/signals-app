import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe, CommonModule } from '@angular/common';
import { Person } from './model/person';

import { interval, Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { timeComponents } from './model/timeComponents';
import { calcDateDiff } from './functions/calcDateDiff';

import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    JsonPipe,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  disabled = false;
  max = 100;
  min = 1;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 1;
  play = false;

  title = 'signals-app';
  counterTwoWay = 0;
  counterSignal = signal(0); //initialisatie

  colors = signal(['rood', 'groen']); //initialisatie
  readOnlyColors = this.colors.asReadonly();//Readonly signal
  numbersArray = signal([0]);

  personSignal = signal<Person>(new Person(1, 'Jo', 1));//Een object in een signal

  persons = [new Person(1, 'Jo', 0),
  new Person(2, 'Marie', 0),
  new Person(3, 'Mo', 0)];
  personsSignal = signal<Person[]>(this.persons);//array in een signal


  public timeLeft$: Observable<timeComponents>;
  public countertest$: Observable<number>;
  public counter = 0;
  /**
   *
   */
  constructor() {
    this.timeLeft$ = interval(1000).pipe(
      map(x => calcDateDiff()),
      shareReplay(1)
    );
    this.countertest$ = interval(10).pipe(
      map(y => this.loopNumber()),
      shareReplay(1)
    );
  }

  loopNumber(): number {
    if (this.play) {
      this.value++;
      if (this.value > 100) {
        this.value = 1;
      }
    }
    return this.value;
  }
  onPlay() {
    this.play = true;
  }
  onStop() {
    this.play = false;
  }

  change() {
    this.counterTwoWay++;
    this.counterSignal.update(value => value + 1);
    //Een signal kan ook een array bevatten
    this.colors.update(values => [...values, 'blauw']);
    this.numbersArray.update(values => [...values, this.counterSignal()]);
    this.personSignal.update(value => ({ ...value, points: value.points + 1 }));//Een object in een signal
  }
  raisePoints(id: number) {
    this.personsSignal.update(items => items.map(item => item.id == id ?
      { ...item, points: item.points + 1 } : item));
  }
}
