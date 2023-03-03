import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TimeUnit } from 'chart.js';
import { map, Observable } from 'rxjs';

import { ChartData, Device } from '../api/appconfig.model';

import { BaseService } from './base.service';

@Injectable()
export class DeviceService extends BaseService {
  constructor(private readonly http: HttpClient) {
    super('/devices');
  }

  getAllCategories(): Observable<Device[]> {
    return this.http.get<string[]>(this.url).pipe(
      map((res) =>
        res.map((r) => {
          return { name: r, id: r };
        })
      )
    );
  }

  /**
   * @deprecated
   *
   * @param deviceCategory
   * @param timeUnit
   * @param maxDate
   * @returns
   */
  getDeviceCategoryConsumption(deviceCategory: string, timeUnit: TimeUnit, maxDate: string): Observable<ChartData> {
    return this.transformResponseToLinearArray(
      this.http.get<ChartData>(`${this.url}/${deviceCategory}/energy-consumption`, {
        params: new HttpParams().appendAll({ timeUnit, maxDate })
      })
    );
  }
}
