import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="logout-dialog">
      <div class="dialog-icon">
        <mat-icon>logout</mat-icon>
      </div>
      <h2>Sign out</h2>
      <p>Are you sure you want to sign out of LicenseHub?</p>
      <div class="dialog-actions">
        <button mat-stroked-button (click)="ref.close(false)">Cancel</button>
        <button mat-flat-button class="confirm-btn" (click)="ref.close(true)">Sign out</button>
      </div>
    </div>
  `,
  styles: [`
    .logout-dialog {
      padding: 32px 28px 24px;
      text-align: center;
      max-width: 320px;
    }
    .dialog-icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #fef2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      mat-icon {
        color: #dc2626;
        font-size: 22px;
        width: 22px;
        height: 22px;
      }
    }
    h2 {
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 8px;
    }
    p {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 28px;
      line-height: 1.5;
    }
    .dialog-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      button { flex: 1; height: 40px; border-radius: 8px !important; font-size: 14px; }
    }
    .confirm-btn {
      background-color: #dc2626 !important;
      color: #fff !important;
      &:hover { background-color: #b91c1c !important; }
    }
  `]
})
export class LogoutDialogComponent {
  constructor(public ref: MatDialogRef<LogoutDialogComponent>) {}
}