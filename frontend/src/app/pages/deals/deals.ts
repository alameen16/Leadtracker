import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealService } from '../../services/deal.service';
import { RoleService } from '../../services/role.service';
import { Navbar } from '../../shared/navbar/navbar';
import { Deal } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deals',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './deals.html',
  styleUrl: './deals.css'
})
export class Deals implements OnInit {
  deals = signal<Deal[]>([]);
  loading = signal(false);
  showForm = signal(false);
  saving = signal(false);
  error = signal('');
  stages = ['Prospect', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  newDeal = signal({ title: '', value: 0, probability: 25, stage: 'Prospect', notes: '' });

 constructor(
  private dealService: DealService,
  public roleService: RoleService,
  private router: Router  // add this
) {}

viewDeal(id: string) { this.router.navigate(['/deals', id]); }
  ngOnInit() { this.loadDeals(); }

  loadDeals() {
    this.loading.set(true);
    this.dealService.getDeals().subscribe({
      next: (res) => { this.deals.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  getDealsForStage(stage: string): Deal[] { return this.deals().filter(d => d.stage === stage); }

  getTotalValue(): number { return this.deals().filter(d => d.stage !== 'Lost').reduce((sum, d) => sum + d.value, 0); }

  updateDealField(field: string, value: any) { this.newDeal.set({ ...this.newDeal(), [field]: value }); }

  saveDeal() {
    const d = this.newDeal();
    if (!d.title || !d.value) { this.error.set('Title and value are required'); return; }
    this.saving.set(true);
    this.dealService.createDeal(d as any).subscribe({
      next: () => { this.showForm.set(false); this.newDeal.set({ title: '', value: 0, probability: 25, stage: 'Prospect', notes: '' }); this.loadDeals(); this.saving.set(false); },
      error: (err) => { this.error.set(err.error?.message || 'Failed'); this.saving.set(false); }
    });
  }

  deleteDeal(id: string, event: Event) {
    event.stopPropagation();
    if (!confirm('Delete this deal?')) return;
    this.dealService.deleteDeal(id).subscribe({ next: () => this.loadDeals() });
  }

  formatCurrency(val: number): string {
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`;
    return `₦${val}`;
  }
}
