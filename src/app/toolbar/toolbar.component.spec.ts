import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import { SidenavService } from '../sidenav/services/sidenav.service';
import { vi } from 'vitest';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open fire sidenav event', () => {
    const sidenavService = TestBed.inject(SidenavService);
    const toggleSidenavSpy = vi.spyOn(sidenavService, 'toggleSidenav');
    component.openSideNav();
    expect(toggleSidenavSpy).toHaveBeenCalled();
  })
});
