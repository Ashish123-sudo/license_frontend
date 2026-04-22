import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrganizationService } from '../../../core/services/organization.service';
import { ContactService } from '../../../core/services/contact';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private orgService = inject(OrganizationService);
  private contactService = inject(ContactService);
  private snackbar = inject(MatSnackBar);

  contactForm!: FormGroup;
  isEditMode = false;
  contactId: string | null = null;
  isSubmitting = false;
  organizations: any[] = [];

  ngOnInit() {
    this.contactId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.contactId;

    this.contactForm = this.fb.group({
      orgId: ['', Validators.required],
      contacts: this.fb.array([this.createContact()])
    });

    // ✅ Load orgs first, then patch form
    this.orgService.getOrganizations().subscribe(res => {
      this.organizations = res;

      // Pre-fill org from query params after orgs are loaded
      const orgId = this.route.snapshot.queryParamMap.get('orgId');
      if (orgId) {
        this.contactForm.patchValue({ orgId });
      }

      // Edit mode — load contact after orgs are ready
      if (this.isEditMode && this.contactId) {
        this.contactService.getById(this.contactId).subscribe({
          next: (contact) => {
            this.contactForm.patchValue({ orgId: contact.organization?.orgId });
            this.contactsArray.at(0).patchValue({
              firstName:   contact.firstName,
              lastName:    contact.lastName,
              designation: contact.designation,
              role:        contact.role,
              officePhone: contact.officePhone,
              ext:         contact.ext,
              mobile:      contact.mobile,
              fax:         contact.fax,
              email:       contact.email,
              linkedIn:    contact.linkedIn,
              isActive:    contact.isActive
            });
          },
          error: () => this.snackbar.open('Failed to load contact', 'Close', { duration: 3000 })
        });
      }
    });
  }

  get contactsArray(): FormArray {
    return this.contactForm.get('contacts') as FormArray;
  }

  createContact(): FormGroup {
    return this.fb.group({
      firstName:   ['', Validators.required],
      lastName:    ['', Validators.required],
      designation: [''],
      role:        [''],
      officePhone: [''],
      ext:         [''],
      mobile:      [''],
      fax:         [''],
      email:       ['', Validators.email],
      linkedIn:    [''],
      isActive:    [true]
    });
  }

  addContact() { this.contactsArray.push(this.createContact()); }
  removeContact(index: number) { this.contactsArray.removeAt(index); }
  onCancel() { this.router.navigate(['/contacts']); }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    const { orgId, contacts } = this.contactForm.getRawValue();

    if (this.isEditMode && this.contactId) {
      this.contactService.update(this.contactId, contacts[0]).subscribe({
        next: () => {
          this.snackbar.open('Contact updated', 'Close', { duration: 3000 });
          this.router.navigate(['/contacts']);
        },
        error: () => {
          this.isSubmitting = false;
          this.snackbar.open('Error updating contact', 'Close', { duration: 3000 });
        }
      });
    } else {
      const requests = contacts.map((contact: any) =>
        this.contactService.create(orgId, contact)
      );

      forkJoin(requests).subscribe({
        next: () => {
          this.snackbar.open('Contacts saved', 'Close', { duration: 3000 });
          this.router.navigate(['/contacts']);
        },
        error: () => {
          this.isSubmitting = false;
          this.snackbar.open('Error saving contacts', 'Close', { duration: 3000 });
        }
      });
    }
  }
}