import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDashboardComponent } from './table.component';

describe('TableDashboardComponent', () => {
  let component: TableDashboardComponent;
  let fixture: ComponentFixture<TableDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
