import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';

import { BlockableAreaComponent } from './blockable-area/blockable-area.component';
import { ChartAreaComponent } from './chart-area/chart-area.component';
import { ChartToolbarComponent } from './chart-toolbar/chart-toolbar.component';
import { ComboChartComponent } from './combo-chart/combo-chart.component';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    ChartToolbarComponent,
    BlockableAreaComponent,
    ChartAreaComponent,
    ComboChartComponent,
    PieChartComponent,
    DevicesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule,
    DropdownModule,
    CalendarModule,
    ChartModule,
    BlockUIModule,
    MessagesModule,
    TableModule,
    ButtonModule,
    InputTextModule
  ],
  exports: [FormsModule, ChartToolbarComponent, ComboChartComponent, PieChartComponent, DevicesListComponent]
})
export class SharedModule {}
