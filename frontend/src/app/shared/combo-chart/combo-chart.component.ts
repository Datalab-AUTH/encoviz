import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ScatterDataPoint, ChartOptions, ChartData } from 'chart.js';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { Observable, map, finalize } from 'rxjs';
import { ChartData as EncovizChartData, ToolbarOptions } from 'src/app/api/appconfig.model';
import 'chartjs-adapter-luxon';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-combo-chart',
  templateUrl: './combo-chart.component.html',
  styleUrls: ['./combo-chart.component.scss'],
  providers: [MessageService, LoadingService]
})
export class ComboChartComponent implements OnChanges {
  @Input() data$: Observable<EncovizChartData>;
  @Input() selectedOptions: ToolbarOptions;
  barOptions: ChartOptions;
  barData$: Observable<ChartData>;

  constructor(private readonly loadingService: LoadingService, private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.messageService.clear();
    this.loadingService.showLoadingSpinner();
    this.barData$ = changes.data$.currentValue.pipe(
      map((res: EncovizChartData) => {
        if (!res) {
          this.messageService.add({ severity: 'warn', summary: 'No Data to display for the selected inputs!' });
        }
        const data = res.data?.sort((a, b) => a.x - b.x);
        const average = res.average?.sort((a, b) => a.x - b.x);
        return this.updateChart({ data, average, minDate: res.minDate, maxDate: res.maxDate });
      }),
      finalize(() => this.loadingService.hideLoadingSpinner())
    );
  }

  updateChart(chartData: EncovizChartData): ChartData {
    this.updateBarOptions(chartData.minDate, chartData.maxDate);
    return this.updateChartData(chartData.data, chartData.average);
  }

  private updateChartData(data: ScatterDataPoint[], average?: ScatterDataPoint[]): ChartData {
    const chartData: ChartData = {
      datasets: [
        {
          type: 'line',
          label: 'Line Chart',
          borderColor: '#42A5F5',
          borderWidth: 2,
          fill: false,
          data
        },
        {
          type: 'bar',
          label: 'Personal Consumption',
          backgroundColor: '#295bac',
          data
        }
      ]
    };

    if (average) {
      chartData.datasets.push({
        type: 'bar',
        label: 'Average',
        backgroundColor: '#acd2f5',
        data: average
      });
    }

    return chartData;
  }

  private updateBarOptions(minDate: string, maxDate: string) {
    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: this.selectedOptions?.timeUnit?.forChart
          },
          min: DateTime.fromISO(minDate).valueOf(),
          max: this.selectedOptions.timeUnit?.forChart !== 'hour' ? DateTime.fromISO(maxDate).valueOf() : null,
          ticks: {
            autoSkip: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'kWh'
          }
        }
      }
    };

    if (this.selectedOptions?.timeUnit?.forApi === 'year') {
      this.barOptions.scales.x.min = DateTime.fromISO(minDate).startOf('month').valueOf();
      this.barOptions.scales.x.max = DateTime.fromISO(maxDate).startOf('month').valueOf();
    }
  }
}
