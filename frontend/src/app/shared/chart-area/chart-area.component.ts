import { Component, Input } from '@angular/core';

import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.scss']
})
export class ChartAreaComponent {
  @Input() title: string;
  loading$ = this.loadingService.loading$;

  constructor(private readonly loadingService: LoadingService) {}
}
