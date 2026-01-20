import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <div class="container">
      <h1>Welcome to INVFriend</h1>
      <p>Amigo Invisible Online</p>
    </div>
  `,
  styles: [
    `
      .container {
        text-align: center;
        padding: 2rem;
      }
    `,
  ],
})
export class AppComponent {
  title = "INVFriend";
}
