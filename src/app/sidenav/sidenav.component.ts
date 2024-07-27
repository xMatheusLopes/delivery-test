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
  public sidenavItems: WritableSignal<Array<{title: string, isActive: boolean, route: string}>> = signal([]);
  
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

  subscribeDrawerToggle() {
    const sub$ = this.sidenavOpened$.subscribe(opened => {
      opened ? this.drawer!.open() : this.drawer!.close()
    })

    this.subscriptions$.push(sub$);
  }  
  
  setupSideNavConfiguration(){
    this.sidenavItems.set([
      {
        title: 'Dashboard',
        isActive: this.isActive('dashboard'),
        route: '/dashboard'
      },
      {
        title: 'Entregas',
        isActive: this.isActive('entregas'),
        route: '/entregas'
      }
    ]);
  }

  isActive(route: string): boolean {
    const currentPath = this.location.path();
    const expression = `^/${route}`;
    return new RegExp(expression).test(`${currentPath}`);
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}

