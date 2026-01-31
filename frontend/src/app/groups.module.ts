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
import { GroupDetailComponent } from "./adapters/components/group-detail/group-detail.component";
import { RaffleTriggerComponent } from "./adapters/components/raffle-trigger/raffle-trigger.component";
import { SecretSantaRevealComponent } from "./adapters/components/secret-santa-reveal/secret-santa-reveal.component";
import { GroupStatusComponent } from "./adapters/components/group-status/group-status.component";
import { WishListComponent } from "./adapters/components/wish-list/wish-list.component";
import { AuthGuard } from "./adapters/guards/auth.guard";

const routes: Routes = [
  {
    path: "groups",
    canActivate: [AuthGuard],
    children: [
      { path: "", component: GroupListComponent },
      { path: "create", component: GroupCreateComponent },
      { path: ":id", component: GroupDetailComponent },
    ],
  },
];

@NgModule({
  declarations: [
    GroupListComponent,
    GroupCreateComponent,
    GroupDetailComponent,
    RaffleTriggerComponent,
    SecretSantaRevealComponent,
    GroupStatusComponent,
    WishListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    GroupListComponent,
    GroupCreateComponent,
    GroupDetailComponent,
    RaffleTriggerComponent,
    SecretSantaRevealComponent,
    GroupStatusComponent,
    WishListComponent,
  ],
})
export class GroupsModule {}
