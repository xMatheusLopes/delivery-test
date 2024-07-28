import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { firstValueFrom } from 'rxjs';
import { HttpTestingController } from '@angular/common/http/testing';

import deliveries from '@src/mocks/data/deliveries.json';
import { ReportType } from '../enums/ReportType';
import { FailureDeliveryData } from '../types/FailureDeliveryData';
import { SuccessDeliveryData } from '../types/SuccessDeliveryData';
import { NeighborhoodDeliveryData } from '../types/NeighborhoodDeliveryData';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load all reports', async () => {
    const httpTesting = TestBed.inject(HttpTestingController);
    const loadReports = firstValueFrom(service.loadAllReports());

    const req = httpTesting.expectOne('/deliveries', 'Request to load deliveries');
    req.flush(deliveries);

    await loadReports;
    expect(service.reports.size).toBe(3);
    expect(service.reports.has(ReportType.SUCCESS_DELIVERY)).toBe(true);
    expect(service.reports.has(ReportType.FAILURE_DELIVERY)).toBe(true);
    expect(service.reports.has(ReportType.NEIGHBORHOOD_DELIVERY)).toBe(true);
  })

  it('should return success delivery report', () => {
    service.reports.set(ReportType.SUCCESS_DELIVERY, [
      {
        driverName: 'mock',
        deliveriesInProgress: 1,
        deliveriesDone: 0
      }
    ]);

    expect(service.getSuccessDeliveriesData()).toBeDefined();
    expect(service.getSuccessDeliveriesData()[0].driverName).toEqual('mock');
  })

  it('should return failure delivery report', () => {
    service.reports.set(ReportType.FAILURE_DELIVERY, [
      {
        driverName: 'mock',
        deliveriesFailured: 1
      }
    ]);

    expect(service.getFailureDeliveriesData()).toBeDefined();
    expect(service.getFailureDeliveriesData()[0].driverName).toEqual('mock');
  })

  it('should return neighborhood delivery report', () => {
    service.reports.set(ReportType.NEIGHBORHOOD_DELIVERY, [
      {
        neighborhood: 'mock',
        totalDeliveries: 0,
        totalDeliveriesDone: 0
      }
    ]);

    expect(service.getNeighborhoodDeliveriesData()).toBeDefined();
    expect(service.getNeighborhoodDeliveriesData()[0].neighborhood).toEqual('mock');
  })

  it('should return a report initialization', () => {
    let failureReport = new Map<string, FailureDeliveryData>();
    service.buildFailureDriverMap(failureReport, 'failure');
    expect(failureReport.has('failure')).toBeDefined();

    let successReport = new Map<string, SuccessDeliveryData>();
    service.buildSuccessDriverMap(successReport, 'success');
    expect(successReport.has('success')).toBeDefined();

    let neighborhoodReport = new Map<string, NeighborhoodDeliveryData>();
    service.buildNeighborhoodDriverMap(neighborhoodReport, 'neighborhood');
    expect(neighborhoodReport.has('neighborhood')).toBeDefined();
  })

  it('should get a subnode by string key', () => {
    const obj = {
      driver: {
        name: 'mock'
      }
    }
    const key = 'driver.name';
    expect(service.resolvePath(obj, key, null)).toEqual('mock');
  })
});
