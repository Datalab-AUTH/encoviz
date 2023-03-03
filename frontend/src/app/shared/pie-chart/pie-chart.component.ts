import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ChartOptions, ChartData, ChartEvent, LegendElement, LegendItem } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Observable, map, finalize } from 'rxjs';
import { DevicesColors, PieChartData } from 'src/app/api/appconfig.model';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  providers: [MessageService, LoadingService]
})
export class PieChartComponent implements OnChanges {
  @Input() data$: Observable<PieChartData[]>;
  pieOptions: ChartOptions;
  pieData$: Observable<ChartData>;

  constructor(private readonly loadingService: LoadingService, private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.messageService.clear();
    this.loadingService.showLoadingSpinner();
    this.pieData$ = changes.data$.currentValue?.pipe(
      map((res: PieChartData[]) => {
        if (res.every((r) => !r.totalConsumption || r.totalConsumption === 0)) {
          this.messageService.add({ severity: 'warn', summary: 'No Data to display for the selected inputs!' });
        }
        return this.updateChart(res);
      }),
      finalize(() => this.loadingService.hideLoadingSpinner())
    );
  }

  updateChart(data: PieChartData[]): ChartData {
    this.updateBarOptions();
    return this.updateChartData(data);
  }

  private updateChartData(data: PieChartData[]): ChartData<'pie'> {
    return {
      labels: data.map((d) => (d.deviceName.toLowerCase() === 'din' ? 'Rest devices' : d.deviceName)),
      datasets: [
        {
          type: 'pie',
          spacing: 3,
          backgroundColor: data.map((d) => DevicesColors.get(d.deviceName)),
          data: data.map((d) => {
            if (d.deviceName.toLowerCase() === 'din') {
              return (
                d.totalConsumption -
                data.filter((d) => d.deviceName.toLowerCase() !== 'din').reduce((a, b) => a + b.totalConsumption, 0)
              );
            }
            return d.totalConsumption;
          })
        }
      ]
    };
  }

  private updateBarOptions() {
    this.pieOptions = {
      plugins: {
        legend: {
          onHover: this.handleHover,
          onLeave: this.handleLeave
        }
      },
      responsive: true
    };
  }

  private handleHover(this: LegendElement<'pie'>, e: ChartEvent, legendItem: LegendItem, legend: LegendElement<'pie'>) {
    const bgColors = legend.chart.data.datasets[0].backgroundColor as string[];
    bgColors.forEach((color, index, colors) => {
      colors[index] = index === legendItem.index || color.length === 9 ? color : color + '4D';
    });
    legend.chart.update();
  }
  private handleLeave(this: LegendElement<'pie'>, e: ChartEvent, legendItem: LegendItem, legend: LegendElement<'pie'>) {
    const bgColors = legend.chart.data.datasets[0].backgroundColor as string[];
    bgColors.forEach((color, index, colors) => {
      colors[index] = color.length === 9 ? color.slice(0, -2) : color;
    });
    legend.chart.update();
  }
}
