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
    this.loadSuccessDeliveriesData();
    this.loadFailureDeliveriesData();
    this.loadNeighborhoodDeliveriesData();
  }
  
  loadSuccessDeliveriesData() {
    this.dashboardService.getSuccessDeliveriesData().subscribe(res => {
      this.successDeliveriesTableData = signal(res);
      console.log(this.successDeliveriesTableData());
    })
  }
  loadFailureDeliveriesData() {
    this.failureDeliveriesTableData = signal(this.dashboardService.getFailureDeliveriesData());
  }
  loadNeighborhoodDeliveriesData() {
    this.neighborhoodDeliveriesTableData = signal(this.dashboardService.getNeighborhoodDeliveriesData());
  }
}
