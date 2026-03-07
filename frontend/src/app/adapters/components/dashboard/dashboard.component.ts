import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthApplicationService } from "../../../application/services/auth-application.service";

/**
 * Dashboard component - main landing page for authenticated users
 * Navigation is handled by the Layout sidebar
 */
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Welcome to INVFriend</h1>
        <p *ngIf="currentUser$ | async as user">Hello, {{ user.name }}!</p>
      </header>

      <main class="dashboard-content">
        <section class="placeholder-message">
          <p>🎄 Secret Santa features coming soon!</p>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .dashboard-header {
        text-align: center;
        color: white;
        margin-bottom: 2rem;
      }

      .dashboard-header h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .dashboard-content {
        flex: 1;
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
      }

      .placeholder-message {
        margin-top: 2rem;
        text-align: center;
        color: white;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class DashboardComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(private readonly authService: AuthApplicationService) {}
}
