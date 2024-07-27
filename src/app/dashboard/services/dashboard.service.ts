import { Injectable } from '@angular/core';
import { SuccessDeliveryData } from '../types/SuccessDeliveryData';
import { FailureDeliveryData } from '../types/FailureDeliveryData';
import { NeighborhoodDeliveryData } from '../types/NeighborhoodDeliveryData';
import { DeliveryService } from '@src/app/deliveries/services/delivery.service';
import { Delivery } from '@src/app/deliveries/types/Delivery';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private deliveryService: DeliveryService) { }

  loadAllReports() {
    return new Observable(observe => {
      this.deliveryService.getAllDeliveries().subscribe({
        next: (data) => {
          this.fillSuccessDeliveriesReport(data);
          this.fillFailureDeliveriesReport(data);
          this.fillNeighborhoodDeliveriesReport(data);
          observe.complete();
        }, error: (err) => {
          console.error(err);
        }
      })
    })
  }

  fillNeighborhoodDeliveriesReport(data: Delivery[]) {
    const mapDeliveryStatusToReportField = {
      'ENTREGUE': 'totalDeliveriesDone',
      'PENDENTE': undefined,
      'INSUCESSO': undefined,
    }

    const reportDestiny = this.fillGeneric(data, this.buildNeighborhoodDriverMap, new Map<string, NeighborhoodDeliveryData>(), mapDeliveryStatusToReportField, ['cliente_destino.bairro', 'cliente_origem.bairro'], 'totalDeliveries');

    console.log('Neighborhood destino', reportDestiny);
  }

  fillFailureDeliveriesReport(data: Delivery[]) {
    const mapDeliveryStatusToReportField = {
      'ENTREGUE': undefined,
      'PENDENTE': undefined,
      'INSUCESSO': 'deliveriesFailured',
    }
    const report = this.fillGeneric(data, this.buildFailureDriverMap, new Map<string, FailureDeliveryData>(), mapDeliveryStatusToReportField, ['motorista.nome']);
    console.log('Failure', report);
  }

  fillGeneric(
    data: Delivery[], 
    mapBuilder: Function, 
    report: Map<string, FailureDeliveryData | SuccessDeliveryData | NeighborhoodDeliveryData>,
    mapDeliveryStatusToReportField: {[key: string]: string | undefined},
    keys: string[],
    totalKey: string = ''
  ) {

    data.forEach(item => {
      keys.forEach(key => {
        !report.has(this.resolvePath(item, key, {})) && mapBuilder(report, item, this.resolvePath(item, key, {}));
        const mappedData = report.get(this.resolvePath(item, key, {}))!;
        const status: string | undefined = mapDeliveryStatusToReportField[item.status_entrega]
        status && mappedData[status as keyof typeof mappedData]++;
        totalKey && mappedData[totalKey as keyof typeof mappedData]++;
        report.set(this.resolvePath(item, key, {}), mappedData!);
      })
    });

    return Array.from(report.values());
  }

  fillSuccessDeliveriesReport(data: Delivery[]) {
    const mapDeliveryStatusToReportField = {
      'ENTREGUE': 'deliveriesDone',
      'PENDENTE': 'deliveriesInProgress',
      'INSUCESSO': undefined,
    }
    const report = this.fillGeneric(data, this.buildSuccessDriverMap, new Map<string, SuccessDeliveryData>(), mapDeliveryStatusToReportField, ['motorista.nome']);

    console.log('Success', report);
  }

  getFailureDeliveriesData(): FailureDeliveryData[] {
    return [];
  }

  getNeighborhoodDeliveriesData(): NeighborhoodDeliveryData[] {
    return [];
  }

  getSuccessDeliveriesData(): SuccessDeliveryData[] {
    return [];
  }

  buildSuccessDriverMap(report: Map<string, SuccessDeliveryData>, item: Delivery, key: string) {
    report.set(key, {
      deliveriesDone: 0,
      deliveriesInProgress: 0,
      driverName: key
    });
  }

  buildFailureDriverMap(report: Map<string, FailureDeliveryData>, item: Delivery, key: string) {
    report.set(key, {
      deliveriesFailured: 0,
      driverName: key
    });
  }

  buildNeighborhoodDriverMap(report: Map<string, NeighborhoodDeliveryData>, item: Delivery, key: string) {
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
