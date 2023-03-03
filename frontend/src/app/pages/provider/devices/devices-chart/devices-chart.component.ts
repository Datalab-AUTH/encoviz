import { Component, Input } from '@angular/core';

import { Observable, of } from 'rxjs';
import { ChartData, Device, ToolbarOptions } from 'src/app/api/appconfig.model';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-devices-chart',
  templateUrl: './devices-chart.component.html',
  styleUrls: ['./devices-chart.component.scss']
})
export class DevicesChartComponent {
  @Input() devices: Device[];
  data$: Observable<ChartData> = of({ data: [], minDate: '', maxDate: '' });
  selectedOptions: ToolbarOptions;

  constructor(private readonly deviceService: DeviceService) {}

  updateChart(options: ToolbarOptions) {
    this.selectedOptions = options;
    if (this.selectedOptions.deviceId) {
      this.data$ = this.deviceService.getDeviceCategoryConsumption(
        this.selectedOptions.deviceId,
        this.selectedOptions.timeUnit.forApi,
        this.selectedOptions.minDate
      );
    } else {
      this.data$ = of({ data: [], minDate: '', maxDate: '' });
    }
  }
}
