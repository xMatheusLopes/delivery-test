import { Component, Input } from '@angular/core';
import { SuccessDeliveryData } from '../../dashboard/types/SuccessDeliveryData';
import { FailureDeliveryData } from '../../dashboard/types/FailureDeliveryData';
import { NeighborhoodDeliveryData } from '../../dashboard/types/NeighborhoodDeliveryData';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatCardModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() sourceData: any[] | undefined;
  @Input() displayedColumns: string[] | undefined;
  @Input() bindDisplayedColumnWithElement!: { def: string, elementName: string, displayColumnName: string}[];
}
