import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { Roles } from 'src/app/auth/auth.roles';
import { DeviceService } from 'src/app/services/device.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { DevicesChartComponent } from './devices/devices-chart/devices-chart.component';
import { DevicesComponent } from './devices/devices.component';
import { HomeComponent } from './home/home.component';
import { OverviewPanelComponent } from './overview-panel/overview-panel.component';

@NgModule({
  declarations: [HomeComponent, OverviewPanelComponent, DevicesChartComponent, DevicesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
      {
        path: 'devices',
        component: DevicesComponent,
        data: { role: Roles.Customer },
        canActivate: [AuthGuard]
      }
    ]),
    SharedModule,
    TooltipModule,
    ButtonModule,
    MessagesModule
  ],
  providers: [UserService, DeviceService, StatisticsService]
})
export class CustomerModule {}
