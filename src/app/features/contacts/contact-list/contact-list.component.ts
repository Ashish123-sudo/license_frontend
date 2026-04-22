import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactService, Contact } from '../../../core/services/contact';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatTableModule, MatSnackBarModule
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  displayedColumns: string[] = ['name', 'email', 'designation', 'organization', 'actions'];


  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.loading = true;
    this.contactService.getAll().subscribe({
      next: data => {
        this.contacts = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.snackbar.open('Failed to load contacts', 'Close', { duration: 3000 });
      }
    });
  }

  selectContact(contact: Contact) {
    this.selectedContact = this.selectedContact?.contactId === contact.contactId ? null : contact;
  }

  closeDetail() {
    this.selectedContact = null;
  }

  navigateToAdd() {
    this.router.navigate(['/contacts/new']);
  }

  deleteContact(contact: Contact) {
    if (confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) {
      this.contactService.delete(contact.contactId!).subscribe({
        next: () => {
          this.snackbar.open('Contact deleted', 'Close', { duration: 3000 });
          if (this.selectedContact?.contactId === contact.contactId) {
            this.selectedContact = null;
          }
          this.loadContacts();
        },
        error: () => this.snackbar.open('Failed to delete contact', 'Close', { duration: 3000 })
      });
    }
  }
}