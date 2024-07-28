import { Component, Input } from '@angular/core';
import { SuccessDeliveryData } from '../types/SuccessDeliveryData';
import { FailureDeliveryData } from '../types/FailureDeliveryData';
import { NeighborhoodDeliveryData } from '../types/NeighborhoodDeliveryData';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [MatTableModule, MatCardModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() sourceData: (SuccessDeliveryData | FailureDeliveryData | NeighborhoodDeliveryData)[] | undefined;
  @Input() displayedColumns: string[] | undefined;
  @Input() bindDisplayedColumnWithElement!: { def: string, elementName: string, displayColumnName: string}[];
}
