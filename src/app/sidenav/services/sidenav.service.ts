import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _sidenavOpened$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  toggleSidenav() {
    this._sidenavOpened$.next(!this._sidenavOpened$.value);
  }

  getSidenavOpenAction(): Observable<boolean> {
    return this._sidenavOpened$;
  }
}
