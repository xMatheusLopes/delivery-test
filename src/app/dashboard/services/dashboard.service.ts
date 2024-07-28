import { Injectable } from '@angular/core';
import { SuccessDeliveryData } from '../types/SuccessDeliveryData';
import { FailureDeliveryData } from '../types/FailureDeliveryData';
import { NeighborhoodDeliveryData } from '../types/NeighborhoodDeliveryData';
import { DeliveryService } from '@src/app/deliveries/services/delivery.service';
import { Delivery } from '@src/app/deliveries/types/Delivery';
import { Observable } from 'rxjs';
import { ReportDataConfiguration } from '../types/ReportDataConfiguration';
import { ReportType } from '../enums/ReportType';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  reports: Map<string, (SuccessDeliveryData | FailureDeliveryData | NeighborhoodDeliveryData)[]> = new Map();

  constructor(private deliveryService: DeliveryService) { }

  loadAllReports() {
    return new Observable(observe => {
      this.deliveryService.getAllDeliveries().subscribe({
        next: (data) => {
          this.fillSuccessDeliveriesReport(data);
          this.fillFailureDeliveriesReport(data);
          this.fillNeighborhoodDeliveriesReport(data);
          observe.next(true);
          observe.complete();
        }, error: (err) => {
          console.error(err);
        }
      })
    })
  }

  fillSuccessDeliveriesReport(data: Delivery[]) {
    const mapDeliveryStatusToReportField = {
      'ENTREGUE': 'deliveriesDone',
      'PENDENTE': 'deliveriesInProgress'
    }

    const configuration: ReportDataConfiguration = {
      data,
      mapBuilder: this.buildSuccessDriverMap,
      report: new Map<string, SuccessDeliveryData>(),
      mapDeliveryStatusToReportField,
      keys: ['motorista.nome']
    }

    const report = this.fillReportData(configuration);

    this.reports.set(ReportType.SUCCESS_DELIVERY, report);
  }

  fillFailureDeliveriesReport(data: Delivery[]) {
    const mapDeliveryStatusToReportField = {
      'INSUCESSO': 'deliveriesFailured',
    }

    const configuration: ReportDataConfiguration = {
      data,
      mapBuilder: this.buildFailureDriverMap,
      report: new Map<string, FailureDeliveryData>(),
      mapDeliveryStatusToReportField,
      keys: ['motorista.nome']
    }

    const report = this.fillReportData(configuration);

    this.reports.set(ReportType.FAILURE_DELIVERY, report);
  }

  fillNeighborhoodDeliveriesReport(data: Delivery[]) {
    const mapDeliveryStatusToReportField = {
      'ENTREGUE': 'totalDeliveriesDone'
    }

    const configuration: ReportDataConfiguration = {
      data,
      mapBuilder: this.buildNeighborhoodDriverMap,
      report: new Map<string, NeighborhoodDeliveryData>(),
      mapDeliveryStatusToReportField,
      keys: ['cliente_destino.bairro', 'cliente_origem.bairro'],
      totalKey: 'totalDeliveries'
    }

    const report = this.fillReportData(configuration);

    this.reports.set(ReportType.NEIGHBORHOOD_DELIVERY, report);
  }

  fillReportData({
    data, 
    mapBuilder, 
    report,
    mapDeliveryStatusToReportField,
    keys,
    totalKey = ''
  }: ReportDataConfiguration) {
    data.forEach(item => {
      keys.forEach(key => {
        !report.has(this.resolvePath(item, key, {})) && mapBuilder(report, this.resolvePath(item, key, {}));
        const mappedData = report.get(this.resolvePath(item, key, {}))!;
        const status: string | undefined = mapDeliveryStatusToReportField[item.status_entrega]
        status && mappedData[status as keyof typeof mappedData]++;
        totalKey && mappedData[totalKey as keyof typeof mappedData]++;
        report.set(this.resolvePath(item, key, {}), mappedData!);
      })
    });

    return Array.from(report.values());
  }

  getFailureDeliveriesData(): FailureDeliveryData[] {
    return this.reports.get(ReportType.FAILURE_DELIVERY) as FailureDeliveryData[];
  }

  getNeighborhoodDeliveriesData(): NeighborhoodDeliveryData[] {
    return this.reports.get(ReportType.NEIGHBORHOOD_DELIVERY) as NeighborhoodDeliveryData[];
  }

  getSuccessDeliveriesData(): SuccessDeliveryData[] {
    return this.reports.get(ReportType.SUCCESS_DELIVERY) as SuccessDeliveryData[];
  }

  buildSuccessDriverMap(report: Map<string, SuccessDeliveryData>, key: string) {
    report.set(key, {
      deliveriesDone: 0,
      deliveriesInProgress: 0,
      driverName: key
    });
  }

  buildFailureDriverMap(report: Map<string, FailureDeliveryData>, key: string) {
    report.set(key, {
      deliveriesFailured: 0,
      driverName: key
    });
  }

  buildNeighborhoodDriverMap(report: Map<string, NeighborhoodDeliveryData>, key: string) {
    report.set(key, {
      totalDeliveries: 0,
      totalDeliveriesDone: 0,
      neighborhood: key
    });
  }

  resolvePath(object: any, path: string, defaultValue: unknown) {
    return path
      .split('.')
      .reduce((o: any, p: string) => o ? o[p] : defaultValue, object)
  }
}
