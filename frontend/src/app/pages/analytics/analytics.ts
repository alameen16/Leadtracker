import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { Navbar } from '../../shared/navbar/navbar';
import { AnalyticsSummary } from '../../models';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, Navbar],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit {
  summary = signal<AnalyticsSummary | null>(null);
  loading = signal(true);

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.analyticsService.getSummary().subscribe({
      next: (res) => { this.summary.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  getStatusCount(status: string): number {
    const s = this.summary();
    if (!s) return 0;
    return s.leadsByStatus.find(x => x._id === status)?.count || 0;
  }

  getSourcePercent(count: number): number {
    const s = this.summary();
    if (!s?.totalLeads) return 0;
    return Math.round((count / s.totalLeads) * 100);
  }

  getConversionRate(): number {
    const s = this.summary();
    if (!s?.totalLeads) return 0;
    return Math.round((this.getStatusCount('Won') / s.totalLeads) * 100);
  }

  formatCurrency(val: number): string {
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`;
    return `₦${val}`;
  }
}