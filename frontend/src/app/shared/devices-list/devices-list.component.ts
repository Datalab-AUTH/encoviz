import { Component, Input, OnInit } from '@angular/core';

import { Device, DevicesColors } from 'src/app/api/appconfig.model';

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss']
})
export class DevicesListComponent implements OnInit {
  @Input() devices: Device[];
  @Input() listTitle: string;
  @Input() cols: any[];

  deviceColors = DevicesColors;
  rowsPerPageOptions = [5, 10, 20];

  constructor() {}

  ngOnInit() {
    this.cols?.push({ field: 'color', header: 'Color', isSortable: false });
  }
}
