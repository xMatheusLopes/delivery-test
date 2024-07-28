import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveriesComponent } from './deliveries.component';
import { DeliveryService } from './services/delivery.service';
import { DeliveryFilterConfiguration } from './types/DeliveryFilterConfiguration';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Status } from './types/Status';

describe('DeliveriesComponent', () => {
  let component: DeliveriesComponent;
  let fixture: ComponentFixture<DeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load deliveries', () => {
    const deliveryService = TestBed.inject(DeliveryService);
    const mockHttpResponse = new HttpResponse({
      body: [
        {
          "id": "5",
          "documento": "01025",
          "motorista": {
            "nome": "Carlos Pereira"
          },
          "cliente_origem": {
            "nome": "Empresa ABC",
            "endereco": "Rua dos Pinheiros, 789",
            "bairro": "Bela Vista",
            "cidade": "S\u00e3o Paulo"
          },
          "cliente_destino": {
            "nome": "Carlos Lima",
            "endereco": "Rua Paulista, 101",
            "bairro": "Moema",
            "cidade": "S\u00e3o Paulo"
          },
          "status_entrega": Status.ENTREGUE
        }
      ],
      headers: new HttpHeaders({
        'total-items': '1'
      })
    })

    deliveryService.getDeliveries = ({ name, status, page, pageSize }: DeliveryFilterConfiguration) => of(mockHttpResponse);

    component.loadDeliveries();

    expect(component.tableTotalItems()).toBe(1);
    expect(component.tableData()?.sourceData[0].driver).toBe('Carlos Pereira');
  })

  it('should update pagination', () => {
    component.updatePagination({
      pageIndex: 2,
      pageSize: 10,
      length: 40
    })

    expect(component.filters.page).toBe(20);
    expect(component.filters.pageSize).toBe(30);
  })

  it('should update filters', () => {
    component.updateFilters({
      name: 'mock',
      status: Status.ENTREGUE,
      page: 0,
      pageSize: 10
    })

    expect(component.filters.name).toBe('mock');
    expect(component.filters.status).toBe(Status.ENTREGUE);
    expect(component.filters.page).toBe(0); 
    expect(component.filters.pageSize).toBe(10); 
  })
});
