import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { GroupsListComponent } from './groups-list.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsListComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GroupsListComponent,
  ],
})
export class GroupsModule {}
