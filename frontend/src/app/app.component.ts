import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <main id="main-content" role="main">
      <router-outlet></router-outlet>
    </main>
    <app-notification></app-notification>
  `,
  styles: [],
})
export class AppComponent {
  title = "INVFriend";
}
