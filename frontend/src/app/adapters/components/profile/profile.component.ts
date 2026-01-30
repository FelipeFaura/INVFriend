import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AuthApplicationService } from "../../../application/services/auth-application.service";

/**
 * Profile component - placeholder for user profile management
 */
@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-container">
      <header class="profile-header">
        <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
        <h1>My Profile</h1>
      </header>

      <main class="profile-content" *ngIf="currentUser$ | async as user">
        <div class="profile-card">
          <div class="avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
          <div class="info">
            <h2>{{ user.name }}</h2>
            <p class="email">{{ user.email }}</p>
          </div>
        </div>

        <p class="placeholder">🔧 Profile editing coming soon!</p>
      </main>
    </div>
  `,
  styles: [
    `
      .profile-container {
        min-height: 100vh;
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .profile-header {
        max-width: 600px;
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

      .profile-content {
        max-width: 600px;
        margin: 2rem auto;
      }

      .profile-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
      }

      .info h2 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .info .email {
        color: #666;
        margin: 0;
      }

      .placeholder {
        margin-top: 2rem;
        text-align: center;
        color: white;
        font-size: 1.1rem;
      }
    `,
  ],
})
export class ProfileComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(private readonly authService: AuthApplicationService) {}
}
