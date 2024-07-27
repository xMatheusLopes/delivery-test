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

  getSuccessDeliveriesData(): Observable<SuccessDeliveryData[]> {
    return new Observable(observe => {
      this.deliveryService.getAllDeliveries().subscribe({
        next: (data) => {
          const report = this.fillSuccessDeliveriesReport(data);
          observe.next(Array.from(report.values()));
          observe.complete();
        }, error: (err) => {
          console.error(err);
        }
      })
    })
  }

  fillSuccessDeliveriesReport(data: Delivery[]): Map<string, SuccessDeliveryData> {
    const report = new Map<string, SuccessDeliveryData>();

    const mapDeliveryStatusToReportField = {
      'ENTREGUE': 'deliveriesDone',
      'PENDENTE': 'deliveriesInProgress',
      'INSUCESSO': undefined,
    }

    data.forEach(item => {
      !report.has(item.motorista.nome) && this.initSuccessDriverMap(report, item);
      const updatedData = report.get(item.motorista.nome)!;
      const status: string | undefined = mapDeliveryStatusToReportField[item.status_entrega]
      status && updatedData[status as keyof typeof updatedData]++;
      report.set(item.motorista.nome, updatedData!);
    });

    return report;
  }

  getFailureDeliveriesData(): FailureDeliveryData[] {
    return [];
  }
  getNeighborhoodDeliveriesData(): NeighborhoodDeliveryData[] {
    return [];
  }

  initSuccessDriverMap(report: Map<string, SuccessDeliveryData>, item: Delivery) {
    report.set(item.motorista.nome, {
      deliveriesDone: 0,
      deliveriesInProgress: 0,
      driverName: item.motorista.nome
    });
  }
}
