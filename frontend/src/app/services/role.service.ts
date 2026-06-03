import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private authService: AuthService) {}

  get role(): string {
    return this.authService.currentUser()?.role || '';
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  get isManager(): boolean {
    return this.role === 'manager';
  }

  get isRep(): boolean {
    return this.role === 'rep';
  }

  get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }

  // Lead permissions
  get canDeleteLead(): boolean { return this.isAdmin; }
  get canUpdateLead(): boolean { return this.isAdminOrManager; }
  get canCreateLead(): boolean { return true; }

  // Contact permissions
  get canDeleteContact(): boolean { return this.isAdmin; }
  get canUpdateContact(): boolean { return this.isAdminOrManager; }

  // Deal permissions
  get canDeleteDeal(): boolean { return this.isAdmin; }
  get canUpdateDeal(): boolean { return this.isAdminOrManager; }

  // Analytics permissions
  get canViewTeamAnalytics(): boolean { return this.isAdminOrManager; }

  // Settings permissions
  get canManageTeam(): boolean { return this.isAdminOrManager; }
}
