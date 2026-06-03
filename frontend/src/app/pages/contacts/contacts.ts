import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { RoleService } from '../../services/role.service';
import { Navbar } from '../../shared/navbar/navbar';
import { Contact } from '../../models';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css'
})
export class Contacts implements OnInit {
  contacts = signal<Contact[]>([]);
  loading = signal(false);
  showForm = signal(false);
  saving = signal(false);
  error = signal('');
  newContact = signal({ fullName: '', email: '', phone: '', company: '', position: '' });

  constructor(
    private contactService: ContactService,
    public roleService: RoleService
  ) {}

  ngOnInit() { this.loadContacts(); }

  loadContacts() {
    this.loading.set(true);
    this.contactService.getContacts().subscribe({
      next: (res) => { this.contacts.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  updateField(field: string, value: string) {
    this.newContact.set({ ...this.newContact(), [field]: value });
  }

  saveContact() {
    const c = this.newContact();
    if (!c.fullName || !c.email || !c.phone) { this.error.set('Please fill in required fields'); return; }
    this.saving.set(true);
    this.contactService.createContact(c).subscribe({
      next: () => {
        this.showForm.set(false);
        this.newContact.set({ fullName: '', email: '', phone: '', company: '', position: '' });
        this.loadContacts();
        this.saving.set(false);
      },
      error: (err) => { this.error.set(err.error?.message || 'Failed'); this.saving.set(false); }
    });
  }

  deleteContact(id: string, event: Event) {
    event.stopPropagation();
    if (!confirm('Delete this contact?')) return;
    this.contactService.deleteContact(id).subscribe({ next: () => this.loadContacts() });
  }

  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
  getAvatarColor(name: string): string {
    const colors = ['#7c5cfc', '#0d9488', '#d97706', '#be123c', '#1d4ed8'];
    return colors[name.charCodeAt(0) % colors.length];
  }
}
