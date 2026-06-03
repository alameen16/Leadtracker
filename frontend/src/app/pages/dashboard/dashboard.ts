import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { LeadService } from '../../services/lead.service';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../shared/navbar/navbar';
import { AnalyticsSummary, Lead } from '../../models';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  loading = signal(true);
  summary = signal<AnalyticsSummary | null>(null);
  recentLeads = signal<Lead[]>([]);

  constructor(
    private analyticsService: AnalyticsService,
    private leadService: LeadService,
    public authService: AuthService
  ) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.analyticsService.getSummary().subscribe({
      next: (res) => { this.summary.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
    this.leadService.getLeads({ limit: 5 }).subscribe({
      next: (res) => { this.recentLeads.set(res.data.leads); }
    });
  }

  getStatusCount(status: string): number {
    const s = this.summary();
    if (!s) return 0;
    return s.leadsByStatus.find(x => x._id === status)?.count || 0;
  }

  getPipelinePercent(status: string): number {
    const s = this.summary();
    if (!s?.totalLeads) return 0;
    return Math.round((this.getStatusCount(status) / s.totalLeads) * 100);
  }

  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }

  getAvatarColor(name: string): string {
    const colors = ['#7c5cfc', '#0d9488', '#d97706', '#be123c', '#1d4ed8'];
    return colors[name.charCodeAt(0) % colors.length];
  }

  formatCurrency(val: number): string {
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`;
    return `₦${val}`;
  }
}