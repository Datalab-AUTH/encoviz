import { Component, Input, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { forkJoin, map, Observable } from 'rxjs';
import { Device, PieChartData, ToolbarOptions } from 'src/app/api/appconfig.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-devices-chart',
  templateUrl: './devices-chart.component.html',
  styleUrls: ['./devices-chart.component.scss']
})
export class DevicesChartComponent implements OnInit {
  @Input() devices: Device[];
  private userId: string;
  data$: Observable<PieChartData[]>;

  constructor(private readonly keycloakService: KeycloakService, private readonly userService: UserService) {}

  ngOnInit(): void {
    this.userId = this.keycloakService.getKeycloakInstance().profile.id;
  }

  updateChart(options: ToolbarOptions) {
    this.data$ = forkJoin(
      this.devices?.map((d) =>
        this.userService.getUserConsumptionFromDevice(this.userId, d.id, options.timeUnit.forApi, options.minDate).pipe(
          map((res) => {
            return {
              deviceName: d.name,
              totalConsumption: res.data?.map((p) => p.y).reduce((pr, curr) => pr + curr)
            };
          })
        )
      )
    );
  }
}
