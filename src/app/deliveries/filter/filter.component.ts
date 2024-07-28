import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Status } from '../types/Status';

@Component({
  selector: 'app-deliveries-filter',
  standalone: true,
  imports: [MatExpansionModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  @Output() loadDeliveries = new EventEmitter();

  readonly panelOpenState = signal(false);
  public statusOptions = signal(Object.values(Status));
  public filterForm = new FormGroup({
    name: new FormControl<string>(''),
    status: new FormControl<Status | ''>(''),
    page: new FormControl<number>(0),
    pageSize: new FormControl<number>(10),
  });

  submit() {
    this.loadDeliveries.emit(this.filterForm.getRawValue());
  }
}
