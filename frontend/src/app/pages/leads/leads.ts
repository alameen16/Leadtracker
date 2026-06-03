import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../../services/lead.service';
import { RoleService } from '../../services/role.service';
import { Navbar } from '../../shared/navbar/navbar';
import { Lead } from '../../models';

@Component({
  selector: 'app-leads',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './leads.html',
  styleUrl: './leads.css'
})
export class Leads implements OnInit {
  leads = signal<Lead[]>([]);
  loading = signal(false);
  selectedStatus = signal('All');
  searchQuery = signal('');
  total = signal(0);
  statuses = ['All', 'New', 'Contacted', 'Qualified', 'Won', 'Lost'];

  constructor(
    private leadService: LeadService,
    private router: Router,
    public roleService: RoleService
  ) {}

  ngOnInit() { this.loadLeads(); }

  loadLeads() {
    this.loading.set(true);
    const filters: any = {};
    if (this.selectedStatus() !== 'All') filters.status = this.selectedStatus();
    if (this.searchQuery()) filters.search = this.searchQuery();
    this.leadService.getLeads(filters).subscribe({
      next: (res) => { this.leads.set(res.data.leads); this.total.set(res.data.total); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  filterBy(status: string) { this.selectedStatus.set(status); this.loadLeads(); }
  onSearch(val: string) { this.searchQuery.set(val); this.loadLeads(); }
  viewLead(id: string) { this.router.navigate(['/leads', id]); }
  addLead() { this.router.navigate(['/leads/new']); }
  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
  getAvatarColor(name: string): string {
    const colors = ['#7c5cfc', '#0d9488', '#d97706', '#be123c', '#1d4ed8'];
    return colors[name.charCodeAt(0) % colors.length];
  }
}
