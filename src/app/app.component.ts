import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatRadioChange } from '@angular/material/radio';
import {
  combineLatest,
  from,
  fromEvent,
  interval,
  Observable,
  of,
  Subscription,
  timer,
} from 'rxjs';
import {
  delay,
  filter,
  map,
  scan,
  startWith,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  //   title = 'currency-converter';
  array = [1, 2, 3];
  promise = new Promise((reject) => reject('rejected'));

  fromArray$ = from(this.array).pipe(tap(console.log));
  fromPromise$ = from(this.promise).pipe(tap(console.log));

  @ViewChild('sourceA') sourceA!: MatButton;
  @ViewChild('sourceB') sourceB!: MatButton;

  sourceA$!: Observable<string>;
  sourceB$!: Observable<string>;

  combineLatest$!: Observable<void>;
  withLatestFrom$!: Observable<void>;

  selectedOperator$!: Observable<string>;
  radioBtn!: FormControl;

  subscription!: Subscription;

  constructor() {}

  ngOnInit() {
    this.radioBtn = new FormControl('');

    this.fromArray$.subscribe();
    this.fromPromise$.subscribe();
  }

  ngAfterViewInit(): void {
    this.sourceA$ = fromEvent(
      this.sourceA._elementRef.nativeElement,
      'click'
    ).pipe(
      scan((acc) => acc + 1, 0),
      map((val) => {
        this.insertDOMElement(`sourceA`, `A-${val}`);
        return `A-${val}`;
      })
    );

    this.sourceB$ = fromEvent(
      this.sourceB._elementRef.nativeElement,
      'click'
    ).pipe(
      scan((acc) => acc + 1, 0),
      map((val) => {
        this.insertDOMElement(`sourceB`, `B-${val}`);
        return `B-${val}`;
      })
    );

    this.combineLatest$ = combineLatest([this.sourceA$, this.sourceB$]).pipe(
      map((val) =>
        this.insertDOMElement(
          'output-stream',
          val.reduce((acc: string, seed: string) => acc.concat(seed), '')
        )
      )
    );

    this.withLatestFrom$ = this.sourceA$.pipe(
      withLatestFrom(this.sourceB$),
      map((val) =>
        this.insertDOMElement(
          'output-stream',
          val.reduce((acc, seed) => acc.concat(seed), '')
        )
      )
    );
  }

  insertDOMElement(selector: string, value: string) {
    const source = document.getElementsByClassName(selector);
    console.log(source);
    if (source) {
      const div = document.createElement('div');
      div.style.borderRadius = '50%';
      div.style.height = '50px';
      div.style.width = '50px';
      div.style.backgroundColor = 'rgb(255, 127, 80)';
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      div.style.margin = '5px';
      div.innerHTML = value;
      // div.className = 'streams';

      source[0].appendChild(div);
    }
  }

  onSelectionChange(event: MatRadioChange) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    switch (event.value) {
      case 'combineLatest':
        this.subscription = this.combineLatest$.subscribe();
        break;

      case 'withLatestFrom':
        this.subscription = this.withLatestFrom$.subscribe();
        break;
    }
  }

  resetStreams() {
    const sourceA = document.getElementsByClassName(`sourceA`);
    const sourceB = document.getElementsByClassName(`sourceB`);
    const output = document.getElementsByClassName(`output-stream`);

    this.resetSourceA(sourceA);
    this.resetSourceA(sourceB);
    this.resetSourceA(output);
  }

  resetSourceA(sourceA: HTMLCollectionOf<Element>) {
    if (sourceA[0].hasChildNodes()) {
      const lastChild = sourceA[0].lastElementChild;

      if (lastChild) sourceA[0].removeChild(lastChild);

      if (sourceA[0].childElementCount > 0) {
        this.resetSourceA(sourceA);
      } else {
        return;
      }
    }
  }

  //   timer$ = timer(10000)

  //   source1$ = timer(0,1000).pipe(map((val) => `Source1 ${val}`))
  //   source2$ = timer(0,1000).pipe(map((val) => `Source2 ${val}`))
  //   finiteSource$ = from([0,1,2,3,4,]).pipe(map((val) => `FiniteSource ${val}`))

  //   combineLatest$ = combineLatest([this.source1$, this.source2$]).pipe(takeUntil(this.timer$), tap(console.log))

  //   withLatestFrom$ = this.source1$.pipe(withLatestFrom(this.source2$), tap(console.log), takeUntil(this.timer$))

  //   combineLatest() {
  //     this.combineLatest$.subscribe();
  //   }

  //   from() {
  //     this.fromArray$.subscribe();
  //       this.fromPromise$.subscribe();
  //   }

  //   withLatestFrom() {
  //  this.withLatestFrom$.subscribe()
  //   }
}
