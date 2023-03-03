import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { forkJoin, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { User, UserListFilters, UserListResource } from '../api/user.model';
import { Roles } from '../auth/auth.roles';

@Injectable()
export class SystemUserService {
  keycloakUsersPath = `${environment.keycloak.baseUrl}/users`;
  keycloakRolesPath = `${environment.keycloak.baseUrl}/roles`;
  constructor(private http: HttpClient) {}

  seedDatabase(): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/insert`, null, {
      params: new HttpParams().append('folder', 'energy')
    });
  }

  getAll(filters: UserListFilters): Observable<UserListResource> {
    return forkJoin([this.getUsers(filters), this.getUsersCount(filters.searchString)]).pipe(
      map(([users, totalCount]) => {
        return {
          users,
          totalCount
        };
      })
    );
  }

  getAllCustomers(): Observable<Partial<User>[]> {
    return this.http.get<User[]>(`${this.keycloakRolesPath}/${Roles.Customer}/users`).pipe(
      map((res) =>
        res.map((u) => {
          return { id: u.id, username: u.username };
        })
      )
    );
  }

  private getUsers(filters: UserListFilters): Observable<User[]> {
    let params = new HttpParams().appendAll({
      ['briefRepresentation']: true,
      ['first']: filters.offset,
      ['max']: filters.pageSize
    });
    params = filters.searchString ? params.append('username', filters.searchString) : params;

    return this.http.get<User[]>(this.keycloakUsersPath, { params });
  }

  private getUsersCount(searchString?: string): Observable<number> {
    const params = searchString ? new HttpParams().set('username', searchString) : null;
    return this.http.get<number>(this.keycloakUsersPath + '/count', { params });
  }
}
