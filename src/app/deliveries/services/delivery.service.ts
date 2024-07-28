import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery } from '../types/Delivery';
import { DeliveryFilterConfiguration } from '../types/DeliveryFilterConfiguration';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  constructor(private http: HttpClient) { }

  /**
   * Get all list of deliveries
   * @returns Observable<Delivery[]> List of deliveries
   */
  getAllDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>('/deliveries');
  }

  /**
   * Get deliveries with filters and more detailed request
   * @param param0 DeliveryFilterConfiguration
   * @returns Observable<HttpResponse<Delivery[]>> List of deliveries
   */
  getDeliveries({ name, status, page, pageSize }: DeliveryFilterConfiguration): Observable<HttpResponse<Delivery[]>> {
    return this.http.get<Delivery[]>('/deliveries', { params: { name, status, page, pageSize }, observe: 'response' })
  }
}
