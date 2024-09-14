import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';  
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FilterByBibPipe } from './actions/filter-by-bib';
import { Punch } from './actions/punch.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    MatTableModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSortModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule,
    FilterByBibPipe
  ],
  providers: [FilterByBibPipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'deviceId', 'timingPoint', 'bib', 'timestamp', 'actions'];
  dataSource: MatTableDataSource<Punch>;
  originalData: Punch[];
  filterValue: string = '';

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private filterByBibPipe: FilterByBibPipe) {
    this.originalData = [ 
      {id: 1, deviceId: 15, timingPoint: 'START', bib: 101, timestamp: '2024-01-01 12:00:00'},
      {id: 2, deviceId: 15, timingPoint: 'START', bib: 102, timestamp: '2024-01-01 12:00:01'},
      {id: 3, deviceId: 15, timingPoint: 'START', bib: 103, timestamp: '2024-01-01 12:00:02'},
      {id: 4, deviceId: 16, timingPoint: 'FINISH', bib: 201, timestamp: '2024-01-01 13:30:00'},
      {id: 5, deviceId: 16, timingPoint: 'FINISH', bib: 202, timestamp: '2024-01-01 13:30:01'},
      {id: 6, deviceId: 16, timingPoint: 'FINISH', bib: 203, timestamp: '2024-01-01 13:30:02'},
    ];
    this.dataSource = new MatTableDataSource(this.originalData);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.data = this.filterByBibPipe.transform(this.originalData, this.filterValue);
  }

  importCSV(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const contents = e.target.result;
      const lines = contents.split('\n');
      const headers = lines[0].split(',');
      const newData: Punch[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
          newData.push({
            id: parseInt(values[0]),
            deviceId: parseInt(values[1]),
            timingPoint: values[2],
            bib: parseInt(values[3]),
            timestamp: values[4]
          });
        }
      }

      this.originalData = newData;
      this.dataSource.data = newData;
    };
    reader.readAsText(file);
  }
}