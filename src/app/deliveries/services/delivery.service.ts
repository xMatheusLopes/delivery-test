import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery } from '../types/Delivery';
import { Status } from '../types/Status';
import { DeliveryFilterConfiguration } from '../types/DeliveryFilterConfiguration';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  constructor(private http: HttpClient) { }

  getAllDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>('/deliveries');
  }

  getDeliveries({ name, status, page, pageSize }: DeliveryFilterConfiguration): Observable<HttpResponse<Delivery[]>> {
    return this.http.get<Delivery[]>('/deliveries', { params: { name, status, page, pageSize }, observe: 'response' })
  }
}
