import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject$.asObservable();

  constructor() {}

  showLoadingSpinner() {
    this.loadingSubject$.next(true);
  }

  hideLoadingSpinner() {
    this.loadingSubject$.next(false);
  }
}
