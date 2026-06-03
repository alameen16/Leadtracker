import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../../services/lead.service';
import { RoleService } from '../../services/role.service';
import { Navbar } from '../../shared/navbar/navbar';
import { Lead } from '../../models';

@Component({
  selector: 'app-lead-detail',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './lead-detail.html',
  styleUrl: './lead-detail.css'
})
export class LeadDetail implements OnInit {
  lead = signal<Lead | null>(null);
  loading = signal(false);
  saving = signal(false);
  statuses: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leadService: LeadService,
    public roleService: RoleService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading.set(true);
      this.leadService.getLeadById(id).subscribe({
        next: (res) => { this.lead.set(res.data); this.loading.set(false); },
        error: () => this.router.navigate(['/leads'])
      });
    }
  }

  updateStatus(status: Lead['status']) {
    const l = this.lead();
    if (!l) return;
    this.leadService.updateStatus(l._id, status).subscribe({
      next: (res) => { this.lead.set(res.data); }
    });
  }

  saveNotes() {
    const l = this.lead();
    if (!l) return;
    this.saving.set(true);
    this.leadService.updateLead(l._id, { notes: l.notes }).subscribe({
      next: () => { this.saving.set(false); }
    });
  }

  updateNotes(val: string) {
    const l = this.lead();
    if (l) this.lead.set({ ...l, notes: val });
  }

  deleteLead() {
    const l = this.lead();
    if (!l || !confirm('Delete this lead?')) return;
    this.leadService.deleteLead(l._id).subscribe({
      next: () => this.router.navigate(['/leads'])
    });
  }

  goBack() { this.router.navigate(['/leads']); }
  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
  getAvatarColor(name: string): string {
    const colors = ['#7c5cfc', '#0d9488', '#d97706', '#be123c', '#1d4ed8'];
    return colors[name.charCodeAt(0) % colors.length];
  }
}
