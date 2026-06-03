import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'leads',
    loadComponent: () => import('./pages/leads/leads').then(m => m.Leads),
    canActivate: [authGuard]
  },
  {
    path: 'leads/new',
    loadComponent: () => import('./pages/lead-form/lead-form').then(m => m.LeadForm),
    canActivate: [authGuard]
  },
  {
    path: 'leads/:id',
    loadComponent: () => import('./pages/lead-detail/lead-detail').then(m => m.LeadDetail),
    canActivate: [authGuard]
  },
  {
    path: 'contacts',
    loadComponent: () => import('./pages/contacts/contacts').then(m => m.Contacts),
    canActivate: [authGuard]
  },
  {
    path: 'deals',
    loadComponent: () => import('./pages/deals/deals').then(m => m.Deals),
    canActivate: [authGuard]
  },
  {
    path: 'deals/:id',
    loadComponent: () => import('./pages/deal-detail/deal-detail').then(m => m.DealDetail),
    canActivate: [authGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics').then(m => m.Analytics),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings').then(m => m.Settings),
    canActivate: [authGuard]
  },
];