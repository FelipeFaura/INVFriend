import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LayoutComponent } from "./adapters/components/layout/layout.component";
import { AuthGuard } from "./adapters/guards/auth.guard";
import { GuestGuard } from "./adapters/guards/guest.guard";

/**
 * Application routes configuration
 * - Public routes: /login, /register (protected by GuestGuard)
 * - Protected routes: /dashboard, /groups, /profile (protected by AuthGuard, wrapped in Layout)
 */
const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  // Auth routes (no layout)
  {
    path: "login",
    loadComponent: () =>
      import("./adapters/components/login/login.component").then(
        (m) => m.LoginComponent,
      ),
    canActivate: [GuestGuard],
    title: "Login - INVFriend",
  },
  {
    path: "register",
    loadComponent: () =>
      import("./adapters/components/register/register.component").then(
        (m) => m.RegisterComponent,
      ),
    canActivate: [GuestGuard],
    title: "Register - INVFriend",
  },
  // Authenticated routes (with layout)
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        title: "Dashboard - INVFriend",
        loadChildren: () =>
          import("./adapters/components/dashboard/dashboard.module").then(
            (m) => m.DashboardModule,
          ),
      },
      {
        path: "groups",
        title: "Groups - INVFriend",
        loadChildren: () =>
          import("./groups.module").then((m) => m.GroupsModule),
      },
      {
        path: "profile",
        title: "Profile - INVFriend",
        loadChildren: () =>
          import("./adapters/components/profile/profile.module").then(
            (m) => m.ProfileModule,
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
