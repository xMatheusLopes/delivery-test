import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery } from '../types/Delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) { }

  getAllDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>('/deliveries');
  }
}
