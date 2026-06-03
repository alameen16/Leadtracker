import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealService } from '../../services/deal.service';
import { RoleService } from '../../services/role.service';
import { Navbar } from '../../shared/navbar/navbar';
import { Deal } from '../../models';

@Component({
  selector: 'app-deal-detail',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './deal-detail.html',
  styleUrl: './deal-detail.css'
})
export class DealDetail implements OnInit {
  deal = signal<Deal | null>(null);
  loading = signal(false);
  saving = signal(false);
  stages = ['Prospect', 'Proposal', 'Negotiation', 'Won', 'Lost'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dealService: DealService,
    public roleService: RoleService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading.set(true);
      this.dealService.getDealById(id).subscribe({
        next: (res) => { this.deal.set(res.data); this.loading.set(false); },
        error: () => this.router.navigate(['/deals'])
      });
    }
  }

  updateStage(stage: string) {
    const d = this.deal();
    if (!d) return;
    this.dealService.updateDeal(d._id, { stage: stage as any }).subscribe({
      next: (res) => { this.deal.set(res.data); }
    });
  }

  updateNotes(val: string) {
    const d = this.deal();
    if (d) this.deal.set({ ...d, notes: val });
  }

  saveNotes() {
    const d = this.deal();
    if (!d) return;
    this.saving.set(true);
    this.dealService.updateDeal(d._id, { notes: d.notes }).subscribe({
      next: (res) => { this.deal.set(res.data); this.saving.set(false); }
    });
  }

  deleteDeal() {
    const d = this.deal();
    if (!d || !confirm('Delete this deal?')) return;
    this.dealService.deleteDeal(d._id).subscribe({
      next: () => this.router.navigate(['/deals'])
    });
  }

  goBack() { this.router.navigate(['/deals']); }

  formatCurrency(val: number): string {
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`;
    return `₦${val}`;
  }

  getStageColor(stage: string): string {
    const map: Record<string, string> = {
      'Prospect': 'bg-blue-500/10 text-blue-400',
      'Proposal': 'bg-amber-500/10 text-amber-400',
      'Negotiation': 'bg-violet-500/10 text-violet-400',
      'Won': 'bg-emerald-500/10 text-emerald-400',
      'Lost': 'bg-red-500/10 text-red-400',
    };
    return map[stage] || 'bg-white/10 text-white/40';
  }
}
