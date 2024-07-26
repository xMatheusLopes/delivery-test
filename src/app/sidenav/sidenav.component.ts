import { Component, ViewChild } from '@angular/core';
import { SidenavService } from './services/sidenav.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

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
export class SidenavComponent {
  @ViewChild('drawer', { static: true }) drawer: MatDrawer | undefined;

  public sidenavOpened$: Observable<boolean>;
  public sidenavItems: Array<{title: string, isActive: boolean}> = [];
  
  constructor(private sidenavService: SidenavService) {
    this.sidenavOpened$ = this.sidenavService.getSidenavOpenAction();
  }

  public ngAfterViewInit() {
    this.subscribeDrawerToggle();
    this.setupSideNavConfiguration();
  }

  private subscribeDrawerToggle() {
    this.sidenavOpened$.subscribe(opened => {
      opened ? this.drawer!.open() : this.drawer!.close()
    });
  }  
  
  private setupSideNavConfiguration() {
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
}
