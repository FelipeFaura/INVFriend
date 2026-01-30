import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthApplicationService } from '../../../application/services/auth-application.service';

/**
 * Dashboard component - main landing page for authenticated users
 * Placeholder implementation for Sprint 2
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Welcome to INVFriend</h1>
        <p *ngIf="currentUser$ | async as user">Hello, {{ user.name }}!</p>
      </header>

      <main class="dashboard-content">
        <section class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-cards">
            <a routerLink="/groups" class="action-card">
              <span class="icon">👥</span>
              <span class="label">My Groups</span>
            </a>
            <a routerLink="/profile" class="action-card">
              <span class="icon">👤</span>
              <span class="label">Profile</span>
            </a>
          </div>
        </section>

        <section class="placeholder-message">
          <p>🎄 Secret Santa features coming soon!</p>
        </section>
      </main>

      <footer class="dashboard-footer">
        <button class="logout-btn" (click)="onLogout()">Logout</button>
      </footer>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
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

    .quick-actions h2 {
      color: white;
      margin-bottom: 1rem;
    }

    .action-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      text-decoration: none;
      color: #333;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    .action-card .icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .action-card .label {
      font-weight: 600;
    }

    .placeholder-message {
      margin-top: 2rem;
      text-align: center;
      color: white;
      font-size: 1.2rem;
    }

    .dashboard-footer {
      text-align: center;
      margin-top: 2rem;
    }

    .logout-btn {
      padding: 0.75rem 2rem;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid white;
      color: white;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .logout-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `],
})
export class DashboardComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(private readonly authService: AuthApplicationService) {}

  onLogout(): void {
    this.authService.logout();
  }
}
