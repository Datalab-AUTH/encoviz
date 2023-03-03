import { HttpParams } from '@angular/common/http';

import { TimeUnit } from 'chart.js';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { ChartData } from '../api/appconfig.model';

export abstract class BaseService {
  protected constructor(private _resourceUrl: string) {}

  protected get url(): string {
    return environment.apiUrl + this._resourceUrl;
  }

  /**
   * @deprecated
   * This method is used to add query parameters to the request.
   * @param timeUnit - The time unit of the request.
   * @param minDate - The minimum date of the request.
   * @returns {params} - The query parameters.
   */
  protected addQueryParams(timeUnit: TimeUnit, minDate: string): { params: HttpParams } {
    let maxDate: string;
    switch (timeUnit) {
      case 'day':
        maxDate = minDate;
        break;
      case 'week':
        maxDate = DateTime.fromISO(minDate).plus({ weeks: 1 }).toISODate();
        break;
      case 'month':
        maxDate = DateTime.fromISO(minDate).plus({ month: 1 }).toISODate();
        break;
      case 'year':
        maxDate = DateTime.fromISO(minDate).plus({ year: 1 }).toISODate();
    }
    const params = new HttpParams().appendAll({ timeUnit, minDate, maxDate });
    return { params };
  }

  protected transformResponseToLinearArray(input$: Observable<ChartData>): Observable<ChartData> {
    return input$.pipe(
      map((res) => {
        return { data: res.data, minDate: res.minDate, maxDate: res.maxDate };
      })
    );
  }
}
