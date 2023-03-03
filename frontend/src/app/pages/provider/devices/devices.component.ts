import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Device } from 'src/app/api/appconfig.model';
import { DeviceService } from 'src/app/services/device.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  providers: [DeviceService]
})
export class DevicesComponent {
  devices$: Observable<Device[]> = this.deviceService.getAllCategories();
  cols = [{ field: 'name', header: 'Category', isSortable: true }];

  constructor(private deviceService: DeviceService) {}
}
