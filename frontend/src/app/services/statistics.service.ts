import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TimeUnit } from 'chart.js';
import { Observable } from 'rxjs';

import { Statistics } from '../api/user.model';

import { BaseService } from './base.service';

@Injectable()
export class StatisticsService extends BaseService {
  constructor(private readonly http: HttpClient) {
    super('/statistics/users');
  }

  getUserConsumption(userId: string, timeUnit: TimeUnit, maxDate: string): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.url}/${userId}/energy-consumption`, {
      params: new HttpParams().appendAll({ timeUnit, maxDate })
    });
  }
}
