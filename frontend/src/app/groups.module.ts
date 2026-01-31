/**
 * Groups Module
 * Feature module for group management functionality
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { GroupListComponent } from "./adapters/components/group-list/group-list.component";
import { GroupCreateComponent } from "./adapters/components/group-create/group-create.component";
import { AuthGuard } from "./adapters/guards/auth.guard";

const routes: Routes = [
  {
    path: "groups",
    canActivate: [AuthGuard],
    children: [
      { path: "", component: GroupListComponent },
      { path: "create", component: GroupCreateComponent },
      // Future routes:
      // { path: ':id', component: GroupDetailComponent },
    ],
  },
];

@NgModule({
  declarations: [GroupListComponent, GroupCreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [GroupListComponent, GroupCreateComponent],
})
export class GroupsModule {}
