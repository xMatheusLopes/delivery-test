import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { SidenavService } from './services/sidenav.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

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
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements AfterViewInit, OnDestroy {
  @ViewChild('drawer', { static: true }) drawer: MatDrawer | undefined;

  public sidenavOpened$: BehaviorSubject<boolean>;
  public subscriptions$: Subscription[] = [];
  public sidenavItems: Array<{title: string, isActive: boolean}> = [];
  
  constructor(private sidenavService: SidenavService) {
    this.sidenavOpened$ = this.sidenavService.getSidenavOpenAction();
  }

  public ngAfterViewInit() {
    this.subscribeDrawerToggle();
    this.setupSideNavConfiguration();
  }

  public subscribeDrawerToggle() {
    const sub$ = this.sidenavOpened$.subscribe(opened => {
      opened ? this.drawer!.open() : this.drawer!.close()
    })

    this.subscriptions$.push(sub$);
  }  
  
  public setupSideNavConfiguration() {
    this.sidenavItems = [
      {
        title: 'Dashboard',
        isActive: true
      },
      {
        title: 'Entregas',
        isActive: false
      }
    ]
  }

  public ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }
}
