import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="confirm-icon">
        <mat-icon color="warn">warning</mat-icon>
      </div>
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p [innerHTML]="data.message"></p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button (click)="dialogRef.close(false)">Cancel</button>
        <button
          mat-flat-button
          [color]="data.confirmColor || 'primary'"
          (click)="dialogRef.close(true)"
        >
          {{ data.confirmLabel || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 8px;
      max-width: 400px;
    }
    .confirm-icon {
      text-align: center;
      margin-bottom: 8px;
      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }
    }
    h2 { text-align: center; font-size: 18px; font-weight: 500; }
    p { color: #555; font-size: 14px; line-height: 1.6; text-align: center; }
    mat-dialog-actions { padding: 16px 0 8px; gap: 8px; }
    button { min-width: 100px; }
  `],
})
export class ConfirmDialogComponent {
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  data = inject<{ title: string; message: string; confirmLabel?: string; confirmColor?: string }>(MAT_DIALOG_DATA);
}