import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { SuccessDeliveryData } from './types/SuccessDeliveryData';
import { FailureDeliveryData } from './types/FailureDeliveryData';
import { NeighborhoodDeliveryData } from './types/NeighborhoodDeliveryData';
import { take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  public successDeliveriesTableData: WritableSignal<Array<SuccessDeliveryData>> = signal([]);
  public failureDeliveriesTableData: WritableSignal<Array<FailureDeliveryData>> = signal([]);
  public neighborhoodDeliveriesTableData: WritableSignal<Array<NeighborhoodDeliveryData>> = signal([]);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadAllReports();
    
  }

  loadAllReports() {
    this.dashboardService.loadAllReports().subscribe(res => {
      this.loadSuccessDeliveriesDataTable();
      this.loadFailureDeliveriesDataTable();
      this.loadNeighborhoodDeliveriesDataTable();
    })
  }

  loadSuccessDeliveriesDataTable() {
    this.dashboardService.getSuccessDeliveriesData();
  }
  loadFailureDeliveriesDataTable() {
    this.dashboardService.getFailureDeliveriesData();
  }
  loadNeighborhoodDeliveriesDataTable() {
    this.dashboardService.getNeighborhoodDeliveriesData();
  }
}
