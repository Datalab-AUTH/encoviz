import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { forkJoin, map, Observable } from 'rxjs';
import { Statistics } from 'src/app/api/user.model';
import { StatisticsService } from 'src/app/services/statistics.service';

type CardOverview = {
  label: string;
  allEntries: {
    inPx: number;
    actual: number;
  }[];
  totalConsumption: number;
  percentage: number;
  increase: boolean;
};

@Component({
  selector: 'app-overview-panel',
  templateUrl: './overview-panel.component.html',
  styleUrls: ['./overview-panel.component.scss']
})
export class OverviewPanelComponent implements OnChanges {
  @Input() selectedDate = '';
  private cardTitles = ['Day', 'Week', 'Month'];
  private userId = this.keycloakService.getKeycloakInstance().profile.id;
  private todaysCons$: Observable<Statistics>;
  private weekCons$: Observable<Statistics>;
  private monthCons$: Observable<Statistics>;
  data$: Observable<CardOverview[]>;
  noDataMsg = [{ severity: 'warn', summary: 'No Data to display' }];

  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly statisticsService: StatisticsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDate.currentValue !== changes.selectedDate.previousValue) {
      this.data$ = this.getCardOverviewData(changes.selectedDate.currentValue);
    }
  }

  private getCardOverviewData(selectedDate: string): Observable<CardOverview[]> {
    this.todaysCons$ = this.statisticsService.getUserConsumption(this.userId, 'day', selectedDate);
    this.weekCons$ = this.statisticsService.getUserConsumption(this.userId, 'week', selectedDate);
    this.monthCons$ = this.statisticsService.getUserConsumption(this.userId, 'month', selectedDate);

    return forkJoin([this.todaysCons$, this.weekCons$, this.monthCons$]).pipe(
      map((res) => {
        const temp: CardOverview[] = [];
        res.forEach((dataset, index) => {
          temp.push({
            label: this.cardTitles[index],
            allEntries: dataset.pastConsumption,
            totalConsumption: dataset.consumption,
            percentage: Number(dataset.percent.toFixed(2)),
            increase: dataset.percent > 0
          });
        });
        return temp;
      })
    );
  }
}
