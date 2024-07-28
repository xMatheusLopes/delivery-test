import { TestBed } from '@angular/core/testing';

import { SidenavService } from './sidenav.service';
import { Observable } from 'rxjs';

describe('SidenavService', () => {
  let service: SidenavService;

  beforeEach(() => {
    service = TestBed.inject(SidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return action Observable', () => {
    expect(service.getSidenavOpenAction()).toBeInstanceOf(Observable);
  })

  it('should toggle sidenav action', () => {
    const oldState = service.getSidenavOpenAction().getValue();
    service.toggleSidenav();
    const newState = service.getSidenavOpenAction().getValue();
    expect(newState).toBe(!oldState);
  })
});
