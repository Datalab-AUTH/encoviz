import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/auth/auth.guard';
import { Roles } from 'src/app/auth/auth.roles';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

import { DevicesChartComponent } from './devices/devices-chart/devices-chart.component';
import { DevicesComponent } from './devices/devices.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent, DevicesChartComponent, DevicesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
      {
        path: 'devices',
        component: DevicesComponent,
        data: { role: Roles.Provider },
        canActivate: [AuthGuard]
      }
    ])
  ],
  providers: [UserService]
})
export class ProviderModule {}
