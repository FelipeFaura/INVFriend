import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./adapters/components/login/login.component";
import { RegisterComponent } from "./adapters/components/register/register.component";

/**
 * Application routes configuration
 */
const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
    title: "Login - INVFriend",
  },
  {
    path: "register",
    component: RegisterComponent,
    title: "Register - INVFriend",
  },
  {
    path: "**",
    redirectTo: "/login",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
