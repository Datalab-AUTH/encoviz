import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DateTime } from 'luxon';
import { Device, TimeUnitConfig, ToolbarOptions } from 'src/app/api/appconfig.model';
import { User } from 'src/app/api/user.model';

@Component({
  selector: 'app-chart-toolbar',
  templateUrl: './chart-toolbar.component.html',
  styleUrls: ['./chart-toolbar.component.scss']
})
export class ChartToolbarComponent implements OnInit {
  @Input() devices?: Device[];
  @Input() users?: Partial<User>[];
  @Input() displayInRow = true;
  @Input() isDeviceMandatory = false;
  @Output() updateChartOptions: EventEmitter<ToolbarOptions> = new EventEmitter<ToolbarOptions>();

  selectedDate: string = DateTime.fromMillis(1657209600000).toISODate();
  selectedTimeUnit: TimeUnitConfig = { forApi: 'day', forChart: 'hour' };
  selectedDevice: string;
  selectedUser: string;
  //   this variables define the min and max date for the date picker
  minDate: Date = DateTime.fromMillis(1657209600000).toJSDate(); // 7th July 2022
  maxDate: Date = DateTime.fromMillis(1661961600000).toJSDate(); // 31 August 2022

  periodOptions: { label: string; value: TimeUnitConfig }[] = [
    { label: 'Day', value: { forApi: 'day', forChart: 'hour' } },
    { label: 'Week', value: { forApi: 'week', forChart: 'day' } },
    { label: 'Month', value: { forApi: 'month', forChart: 'day' } },
    { label: 'Year', value: { forApi: 'year', forChart: 'month' } }
  ];

  constructor() {}

  ngOnInit(): void {
    this.updateChartOptions.emit({
      timeUnit: this.selectedTimeUnit,
      deviceId: null,
      minDate: this.selectedDate
    });
  }

  updateChart(timeUnit?: TimeUnitConfig, deviceId?: string, userId?: string) {
    this.updateChartOptions.emit({
      timeUnit: timeUnit ?? this.selectedTimeUnit,
      minDate: this.selectedDate,
      userId: userId ?? this.selectedUser,
      deviceId: deviceId ?? this.selectedDevice,
      deviceName: this.devices?.find((d) => d.id === (deviceId ?? this.selectedDevice))?.name
    });
  }

  clearDevices() {
    this.selectedDevice = null;
    this.devices = null;
  }
}
