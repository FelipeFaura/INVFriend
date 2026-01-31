/**
 * Groups Module
 * Feature module for group management functionality
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { GroupListComponent } from "./adapters/components/group-list/group-list.component";
import { AuthGuard } from "./adapters/guards/auth.guard";

const routes: Routes = [
  {
    path: "groups",
    canActivate: [AuthGuard],
    children: [
      { path: "", component: GroupListComponent },
      // Future routes:
      // { path: 'create', component: GroupCreateComponent },
      // { path: ':id', component: GroupDetailComponent },
    ],
  },
];

@NgModule({
  declarations: [GroupListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [GroupListComponent],
})
export class GroupsModule {}
