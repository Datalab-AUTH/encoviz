import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { SystemUserService } from 'src/app/services/system-user.service';

import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  declarations: [UsersListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsersListComponent,
        data: { role: 'Admin' },
        canActivate: [AuthGuard]
      }
    ]),
    TableModule,
    InputTextModule,
    ButtonModule,
    ConfirmPopupModule,
    MessagesModule
  ],
  providers: [SystemUserService]
})
export class AdminModule {}
