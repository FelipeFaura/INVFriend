import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

/**
 * Groups list component - placeholder for Sprint 3
 */
@Component({
  selector: "app-groups-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="groups-container">
      <header class="groups-header">
        <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
        <h1>My Groups</h1>
      </header>

      <main class="groups-content">
        <p class="placeholder">🎄 Group management coming in Sprint 3!</p>
      </main>
    </div>
  `,
  styles: [
    `
      .groups-container {
        min-height: 100vh;
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .groups-header {
        max-width: 800px;
        margin: 0 auto;
        color: white;
      }

      .back-link {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        display: inline-block;
        margin-bottom: 1rem;
      }

      .back-link:hover {
        color: white;
      }

      .groups-content {
        max-width: 800px;
        margin: 2rem auto;
        background: white;
        border-radius: 12px;
        padding: 3rem;
        text-align: center;
      }

      .placeholder {
        font-size: 1.2rem;
        color: #666;
      }
    `,
  ],
})
export class GroupsListComponent {}
