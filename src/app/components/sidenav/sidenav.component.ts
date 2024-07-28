import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, signal, ViewChild, WritableSignal } from '@angular/core';
import { SidenavService } from './services/sidenav.service';
import { CommonModule, Location } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSidenavModule, RouterOutlet, MatListModule, MatIconModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements AfterViewInit, OnDestroy {
  @ViewChild('drawer', { static: true }) drawer: MatDrawer | undefined;

  public sidenavOpened$: BehaviorSubject<boolean>;
  public subscriptions$: Subscription[] = [];
  public sidenavItems: WritableSignal<Array<{title: string, route: string}>> = signal([]);
  
  constructor(
    private sidenavService: SidenavService, 
    private location: Location
  ) {
    this.sidenavOpened$ = this.sidenavService.getSidenavOpenAction();
  }

  ngAfterViewInit() {
    this.subscribeDrawerToggle();
    this.setupSideNavConfiguration();
  }

  /**
   * Drawer toggler handler
   */
  subscribeDrawerToggle() {
    const sub$ = this.sidenavOpened$.subscribe(opened => {
      opened ? this.drawer!.open() : this.drawer!.close()
    })

    this.subscriptions$.push(sub$);
  }  
  
  /**
   * Just setup sidenav items
   */
  setupSideNavConfiguration(){
    this.sidenavItems.set([
      {
        title: 'Dashboard',
        route: '/dashboard'
      },
      {
        title: 'Entregas',
        route: '/entregas'
      }
    ]);
  }

  /**
   * Match current route with sidenav item
   * @param route string route to compare
   * @returns boolean if is active or not
   */
  isActive(route: string): boolean {
    const currentPath = this.location.path();
    const expression = `^${route}`;
    return new RegExp(expression).test(`${currentPath}`);
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}

