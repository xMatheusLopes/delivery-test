import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';
import { vi } from 'vitest';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should subscribe to menu click button', () => {
    component.subscribeDrawerToggle();
    expect(component.subscriptions$.length).toBeGreaterThan(0);
  })

  it('should create list of menu items', () => {
    component.setupSideNavConfiguration();
    expect(component.sidenavItems().length).toBeGreaterThan(0);

    component.sidenavItems().forEach(item => {
      expect(item.title).toBeDefined();
      expect(item.route).toBeDefined();
    })
  })

  it('should ubsubscribe eveything on destroy', () => {
    component.subscriptions$.push(new Subscription());
    expect(component.subscriptions$.length).toBe(1);

    const spy = vi.spyOn(Subscription.prototype, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledTimes(1);
  })

  it('should test if necessary routine was done on ngAfterViewInit', () => {
    const spyFns = [
      vi.spyOn(component, 'subscribeDrawerToggle')
    ]

    component.ngAfterViewInit();

    spyFns.forEach(spyFn => {
      expect(spyFn).toHaveBeenCalled();
    })
  })
  
});
