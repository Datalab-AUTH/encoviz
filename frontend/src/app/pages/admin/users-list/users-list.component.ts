import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { MenuItem, LazyLoadEvent, ConfirmationService, Message } from 'primeng/api';
import { Observable, tap, map, finalize } from 'rxjs';
import { User } from 'src/app/api/user.model';
import { SystemUserService } from 'src/app/services/system-user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [ConfirmationService]
})
export class UsersListComponent {
  cols: { field: string; header: string }[];

  items: MenuItem[];
  lastLazyLoadEvent: LazyLoadEvent;
  loading: boolean;
  records$: Observable<User[]>;
  totalRecords: number;
  seedInfoMsg: Message[];

  constructor(
    private readonly systemUsersService: SystemUserService,
    private readonly confirmationService: ConfirmationService
  ) {
    this.cols = [
      { field: 'username', header: 'Username' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      //   { field: 'email', header: 'Email' },
      { field: 'emailVerified', header: 'Email Verified' },
      { field: 'createdTimestamp', header: 'Created Date' }
    ];
  }

  onLazyLoad(event: LazyLoadEvent) {
    if (JSON.stringify(this.lastLazyLoadEvent) === JSON.stringify(event)) {
      return;
    }

    this.lastLazyLoadEvent = event;
    this.records$ = this.systemUsersService
      .getAll({
        searchString: event.globalFilter,
        offset: event.first,
        pageSize: event.rows
      })
      .pipe(
        tap(() => (this.loading = true)),
        map((res) => {
          this.totalRecords = res.totalCount;
          return res.users;
        }),
        finalize(() => (this.loading = false))
      );
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.systemUsersService.seedDatabase().subscribe({
          next: () =>
            (this.seedInfoMsg = [{ severity: 'success', summary: 'Success', detail: 'Data succesfully inserted!' }]),
          error: (error: HttpErrorResponse) =>
            (this.seedInfoMsg = [{ severity: 'error', summary: 'Error', detail: error.message }])
        });
      }
    });
  }
}
