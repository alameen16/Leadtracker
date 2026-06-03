import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../services/lead.service';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-lead-form',
  imports: [FormsModule, CommonModule, Navbar],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.css'
})
export class LeadForm {
  lead = { fullName: '', email: '', phone: '', company: '', source: '', status: 'New' as const, notes: '' };
  sources = ['Instagram', 'Website', 'Referral', 'LinkedIn', 'Other'];
  loading = false;
  error = '';

  constructor(private leadService: LeadService, private router: Router) {}

  onSubmit() {
    if (!this.lead.fullName || !this.lead.email || !this.lead.phone || !this.lead.source) { this.error = 'Please fill in all required fields'; return; }
    this.loading = true; this.error = '';
    this.leadService.createLead(this.lead).subscribe({ next: () => this.router.navigate(['/leads']), error: (err) => { this.error = err.error?.message || 'Failed'; this.loading = false; } });
  }

  onCancel() { this.router.navigate(['/leads']); }
}
