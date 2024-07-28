import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './services/dashboard.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all reports', () => {
    const dashboardService = TestBed.inject(DashboardService);
    dashboardService.loadAllReports = () => of(true);
    dashboardService.getSuccessDeliveriesData = () => {
      return [{
        driverName: 'mock',
        deliveriesInProgress: 1,
        deliveriesDone: 2
      }]
    };
    dashboardService.getFailureDeliveriesData = () => {
      return [{
        driverName: 'mock',
        deliveriesFailured: 2
      }]
    };
    dashboardService.getNeighborhoodDeliveriesData = () => {
      return [{
        neighborhood: 'mock',
        totalDeliveries: 2,
        totalDeliveriesDone: 0
      }]
    };

    component.loadAllReports();

    expect(component.successDeliveriesTableData()?.sourceData[0].driverName).toBe('mock');
    expect(component.failureDeliveriesTableData()?.sourceData[0].driverName).toBe('mock');
    expect(component.neighborhoodDeliveriesTableData()?.sourceData[0].neighborhood).toBe('mock');
  })

  it('should handle on resize', () => {
    component.onResize(new UIEvent('mock'));
    expect(component.resizing()).toBe(true);
  })
});
