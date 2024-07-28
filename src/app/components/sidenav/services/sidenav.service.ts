import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _sidenavOpened$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  toggleSidenav() {
    this._sidenavOpened$.next(!this._sidenavOpened$.value);
  }

  getSidenavOpenAction(): BehaviorSubject<boolean> {
    return this._sidenavOpened$;
  }
}
