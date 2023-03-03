export interface User {
  id: string;
  createdTimestamp: Date;
  username: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserListResource {
  users: User[];
  totalCount: number;
}

export type UserListFilters = {
  searchString?: string;
  offset: number;
  pageSize: number;
};

export type Statistics = {
  consumption: number;
  pastConsumption: {
    inPx: number; // in pixels [0, 100] range
    actual: number;
  }[];
  percent: number;
};
