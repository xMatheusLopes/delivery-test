import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { SuccessDeliveryData } from './types/SuccessDeliveryData';
import { FailureDeliveryData } from './types/FailureDeliveryData';
import { NeighborhoodDeliveryData } from './types/NeighborhoodDeliveryData';
import { NgxMasonryModule } from 'ngx-masonry';
import { CommonModule } from '@angular/common';
import { TableDashboardComponent } from './table/table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableDashboardComponent, NgxMasonryModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  
  public successDeliveriesTableData: WritableSignal<{ displayedColumns: string[], sourceData: SuccessDeliveryData[] } | undefined> = signal(undefined);
  public failureDeliveriesTableData: WritableSignal<{ displayedColumns: string[], sourceData: FailureDeliveryData[] } | undefined> = signal(undefined);
  public neighborhoodDeliveriesTableData: WritableSignal<{ displayedColumns: string[], sourceData: NeighborhoodDeliveryData[] } | undefined> = signal(undefined);
  public resizing = signal(false);
  public resizingDebounce: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadAllReports();
  }

  /**
   * Load all report data and than, mount the tables
   */
  loadAllReports() {
    this.dashboardService.loadAllReports().subscribe(() => {
      this.loadSuccessDeliveriesDataTable();
      this.loadFailureDeliveriesDataTable();
      this.loadNeighborhoodDeliveriesDataTable();
    })
  }

  /**
   * Mount success deliveries table data 
   */
  loadSuccessDeliveriesDataTable() {
    const displayedColumns = ['name', 'total-pending', 'total-done'];
    const sourceData = this.dashboardService.getSuccessDeliveriesData();

    this.successDeliveriesTableData.set({
      displayedColumns,
      sourceData
    })
  }

  /**
   * Mount failure deliveries table data 
   */
  loadFailureDeliveriesDataTable() {
    const displayedColumns = ['name', 'total-failured'];
    const sourceData = this.dashboardService.getFailureDeliveriesData();

    this.failureDeliveriesTableData.set({
      displayedColumns,
      sourceData
    })
  }

  /**
   * Mount neighborhood deliveries table data 
   */
  loadNeighborhoodDeliveriesDataTable() {
    const displayedColumns = ['neighborhood', 'total-done', 'total'];
    const sourceData = this.dashboardService.getNeighborhoodDeliveriesData();

    this.neighborhoodDeliveriesTableData.set({
      displayedColumns,
      sourceData
    })
  }

  /**
   * Used to better masonry integration on responsive testing 
   * @param _event 
   */
  onResize(_event: UIEvent) {
    clearTimeout(this.resizingDebounce);
    this.resizing.set(true);
    this.resizingDebounce = setTimeout(() => {
      this.resizing.set(false);
    }, 200);
  }
}
