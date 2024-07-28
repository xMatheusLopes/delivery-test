import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, signal, WritableSignal } from '@angular/core';
import { DeliveryService } from './services/delivery.service';
import { DeliveryFilterConfiguration } from './types/DeliveryFilterConfiguration';
import { FilterComponent } from './filter/filter.component';
import { TableComponent } from '../components/table/table.component';
import { DeliveryTableSourceData } from './types/DeliveryTableSourceData';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [FilterComponent, TableComponent, MatPaginatorModule],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveriesComponent implements OnInit {
  filters: DeliveryFilterConfiguration = {
    name: '',
    status: '',
    page: 0,
    pageSize: 10
  }

  tableData: WritableSignal<{ sourceData: DeliveryTableSourceData[], displayedColumns: string[] } | undefined> = signal(undefined)
  tableTotalItems = signal(0);

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() {
    this.loadDeliveries();
  }

  /**
   * Update filters that came from external component, and than, update list
   * @param filters DeliveryFilterConfiguration
   */
  updateFilters(filters: DeliveryFilterConfiguration) {
    this.filters = filters;
    this.loadDeliveries();
  }

  /**
   * Update pagination, and than, update list
   * @param event PageEvent
   */
  updatePagination(event: PageEvent) {
    const page = event.pageIndex * 10;
    const pageSize = page + 10;
    
    this.filters.page = page;
    this.filters.pageSize = pageSize;

    this.loadDeliveries();
  }

  /**
   * Load list
   */
  loadDeliveries() {
    this.deliveryService.getDeliveries(this.filters).subscribe(res => {
      if (res.body) {

        // Get source data to populate table
        const sourceData: DeliveryTableSourceData[] = res.body.map(item => {
          return {
            driver: item.motorista.nome,
            document: item.documento.toString(),
            destinyClient: item.cliente_destino.nome,
            destinyAddress: `${item.cliente_destino.endereco} ${item.cliente_destino.bairro} ${item.cliente_destino.cidade}`,
            originClient: item.cliente_origem.nome,
            originAddress: `${item.cliente_origem.endereco} ${item.cliente_origem.bairro} ${item.cliente_origem.cidade}`,
            status: item.status_entrega
          }
        });

        // Set table items
        this.tableData.set({
          sourceData,
          displayedColumns: ['driver', 'document', 'destiny-client', 'destiny-address', 'origin-client', 'origin-address', 'status']
        })
        this.tableTotalItems.set(Number(res.headers.get('total-items')));
      }
    })
  }
}
