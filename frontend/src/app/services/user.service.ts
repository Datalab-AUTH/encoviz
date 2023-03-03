import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TimeUnit } from 'chart.js';
import { Observable } from 'rxjs';

import { ChartData, Device } from '../api/appconfig.model';

import { BaseService } from './base.service';

@Injectable()
export class UserService extends BaseService {
  constructor(private readonly http: HttpClient) {
    super('/users');
  }

  getAllUsersConsumption(timeUnit: TimeUnit, maxDate: string): Observable<ChartData> {
    return this.transformResponseToLinearArray(
      this.http.get<ChartData>(`${this.url}/energy-consumption`, {
        params: new HttpParams().appendAll({ timeUnit, maxDate })
      })
    );
  }

  getAvarageConsumption(timeUnit: TimeUnit, maxDate: string): Observable<ChartData> {
    return this.transformResponseToLinearArray(
      this.http.get<ChartData>(`${this.url}/avg-energy-consumption`, {
        params: new HttpParams().appendAll({ timeUnit, maxDate })
      })
    );
  }

  getUserConsumption(userId: string, timeUnit: TimeUnit, maxDate: string): Observable<ChartData> {
    return this.transformResponseToLinearArray(
      this.http.get<ChartData>(`${this.url}/${userId}/energy-consumption`, {
        params: new HttpParams().appendAll({ timeUnit, maxDate })
      })
    );
  }

  getUserConsumptionFromDevice(
    userId: string,
    deviceId: string,
    timeUnit: TimeUnit,
    maxDate: string
  ): Observable<ChartData> {
    return this.transformResponseToLinearArray(
      this.http.get<ChartData>(`${this.url}/${userId}/devices/${deviceId}/energy-consumption`, {
        params: new HttpParams().appendAll({ timeUnit, maxDate })
      })
    );
  }

  getUsersDevices(userId: string): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.url}/${userId}/devices`);
  }
}
