import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _sidenavOpened$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  toggleSidenav() {
    this._sidenavOpened$.next(!this._sidenavOpened$.value);
  }

  getSidenavOpenAction(): BehaviorSubject<boolean> {
    return this._sidenavOpened$;
  }
}
