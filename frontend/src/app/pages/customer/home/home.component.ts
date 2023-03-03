import { Component, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { forkJoin, map, Observable } from 'rxjs';
import { ChartData, Device, ToolbarOptions } from 'src/app/api/appconfig.model';
import { DeviceService } from 'src/app/services/device.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  devices$: Observable<Device[]>;
  data$: Observable<ChartData>;
  selectedOptions: ToolbarOptions;
  private userId: string;

  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly userService: UserService,
    private readonly deviceService: DeviceService
  ) {}

  ngOnInit(): void {
    this.userId = this.keycloakService.getKeycloakInstance().profile.id;
    this.devices$ = this.userService.getUsersDevices(this.userId);
  }

  updateChart(options: ToolbarOptions) {
    this.selectedOptions = options;
    if (this.selectedOptions.deviceId) {
      this.data$ = forkJoin([
        this.userService.getUserConsumptionFromDevice(
          this.userId,
          this.selectedOptions.deviceId,
          this.selectedOptions.timeUnit.forApi,
          this.selectedOptions.minDate
        ),
        this.deviceService.getDeviceCategoryConsumption(
          this.selectedOptions.deviceName,
          this.selectedOptions.timeUnit.forApi,
          this.selectedOptions.minDate
        )
      ]).pipe(
        map(([userConsumption, deviceConsumption]) => {
          return {
            data: userConsumption.data,
            average: deviceConsumption.data,
            minDate: userConsumption.minDate,
            maxDate: userConsumption.maxDate
          };
        })
      );
    } else {
      this.data$ = forkJoin([
        this.userService.getUserConsumption(
          this.userId,
          this.selectedOptions.timeUnit.forApi,
          this.selectedOptions.minDate
        ),
        this.userService.getAvarageConsumption(this.selectedOptions.timeUnit.forApi, this.selectedOptions.minDate)
      ]).pipe(
        map(([userConsumption, avarageUsersConsumption]) => {
          return {
            data: userConsumption.data,
            average: avarageUsersConsumption.data,
            minDate: userConsumption.minDate,
            maxDate: userConsumption.maxDate
          };
        })
      );
    }
  }
}
