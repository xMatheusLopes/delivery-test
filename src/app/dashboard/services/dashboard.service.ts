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

  /**
   * Get all json file data and convert to reports
   * @returns observe when handling is finished
   */
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

  /**
   * Mount success deliveries report
   * @param data json file data
   */
  fillSuccessDeliveriesReport(data: Delivery[]) {
    // Map of status that report is interested to count
    const mapDeliveryStatusToReportField = {
      'ENTREGUE': 'deliveriesDone',
      'PENDENTE': 'deliveriesInProgress'
    }

    // Generic setup to mount report
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

  /**
   * Mount failure deliveries report
   * @param data json file data
   */
  fillFailureDeliveriesReport(data: Delivery[]) {
    // Map of status that report is interested to count
    const mapDeliveryStatusToReportField = {
      'INSUCESSO': 'deliveriesFailured',
    }

    // Generic setup to mount report
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

  /**
   * Mount neighborhood deliveries report
   * @param data json file data
   */
  fillNeighborhoodDeliveriesReport(data: Delivery[]) {
    // Map of status that report is interested to count
    const mapDeliveryStatusToReportField = {
      'ENTREGUE': 'totalDeliveriesDone'
    }

    // Generic setup to mount report
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

  /**
   * Core function that can get configuration and transform in report
   * @param param0 ReportDataConfiguration configuration setup
   * @returns report
   */
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

  /**
   * Return individual report generated before
   * @returns FailureDeliveryData 
   */
  getFailureDeliveriesData(): FailureDeliveryData[] {
    return this.reports.get(ReportType.FAILURE_DELIVERY) as FailureDeliveryData[];
  }

   /**
   * Return individual report generated before
   * @returns NeighborhoodDeliveryData 
   */
  getNeighborhoodDeliveriesData(): NeighborhoodDeliveryData[] {
    return this.reports.get(ReportType.NEIGHBORHOOD_DELIVERY) as NeighborhoodDeliveryData[];
  }

  /**
   * Return individual report generated before
   * @returns SuccessDeliveryData 
   */
  getSuccessDeliveriesData(): SuccessDeliveryData[] {
    return this.reports.get(ReportType.SUCCESS_DELIVERY) as SuccessDeliveryData[];
  }

  /**
   * Setup initial report data
   * @param report empty Map
   * @param key map identifier
   */
  buildSuccessDriverMap(report: Map<string, SuccessDeliveryData>, key: string) {
    report.set(key, {
      deliveriesDone: 0,
      deliveriesInProgress: 0,
      driverName: key
    });
  }

  /**
   * Setup initial report data
   * @param report empty Map
   * @param key map identifier
   */
  buildFailureDriverMap(report: Map<string, FailureDeliveryData>, key: string) {
    report.set(key, {
      deliveriesFailured: 0,
      driverName: key
    });
  }

  /**
   * Setup initial report data
   * @param report empty Map
   * @param key map identifier
   */
  buildNeighborhoodDriverMap(report: Map<string, NeighborhoodDeliveryData>, key: string) {
    report.set(key, {
      totalDeliveries: 0,
      totalDeliveriesDone: 0,
      neighborhood: key
    });
  }

  /**
   * Can access subitems of an object by key
   * @param object root object
   * @param path key to find on object
   * @param defaultValue return if not found
   * @returns subnode searched
   */
  resolvePath(object: any, path: string, defaultValue: unknown) {
    return path
      .split('.')
      .reduce((o: any, p: string) => o ? o[p] : defaultValue, object)
  }
}
