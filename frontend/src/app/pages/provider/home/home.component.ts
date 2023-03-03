import { Component } from '@angular/core';

import 'chartjs-adapter-luxon';
import { forkJoin, map, Observable } from 'rxjs';
import { ChartData, Device, ToolbarOptions } from 'src/app/api/appconfig.model';
import { User } from 'src/app/api/user.model';
import { SystemUserService } from 'src/app/services/system-user.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SystemUserService]
})
export class HomeComponent {
  data$: Observable<ChartData>;
  selectedOptions: ToolbarOptions;
  devices$: Observable<Device[]>;
  customers$: Observable<Partial<User>[]>;
  private selectedUserId: string;

  constructor(private readonly userService: UserService, private readonly sytemUsersService: SystemUserService) {
    this.customers$ = this.sytemUsersService.getAllCustomers();
  }

  updateChart(options: ToolbarOptions) {
    this.selectedOptions = options;
    const userId = this.selectedOptions.userId;
    const deviceId = this.selectedOptions.deviceId;
    if (userId && deviceId) {
      this.data$ = this.userService.getUserConsumptionFromDevice(
        userId,
        deviceId,
        this.selectedOptions.timeUnit.forApi,
        this.selectedOptions.minDate
      );
    } else if (userId) {
      this.fetchUserDevices(userId);
      this.data$ = this.transformData(
        forkJoin([
          this.userService.getUserConsumption(
            userId,
            this.selectedOptions.timeUnit.forApi,
            this.selectedOptions.minDate
          ),
          this.userService.getAvarageConsumption(this.selectedOptions.timeUnit.forApi, this.selectedOptions.minDate)
        ])
      );
    } else {
      this.data$ = this.transformData(
        forkJoin([
          this.userService.getAllUsersConsumption(this.selectedOptions.timeUnit.forApi, this.selectedOptions.minDate),
          this.userService.getAvarageConsumption(this.selectedOptions.timeUnit.forApi, this.selectedOptions.minDate)
        ])
      );
    }
  }

  private transformData(data$: Observable<[ChartData, ChartData]>): Observable<ChartData> {
    return data$.pipe(
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

  private fetchUserDevices(newUserId: string) {
    if (this.selectedUserId !== newUserId) {
      this.selectedUserId = newUserId;
      this.devices$ = this.userService.getUsersDevices(newUserId);
    }
  }
}
