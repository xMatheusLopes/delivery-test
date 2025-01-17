import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TableComponent } from '@src/app/components/table/table.component';

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [TableComponent, MatCardModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableDashboardComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() sourceData: any[] | undefined;
  @Input() displayedColumns: string[] | undefined;
  @Input() bindDisplayedColumnWithElement!: { def: string, elementName: string, displayColumnName: string}[];
}
