import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  @Input() user: User | null = null;
  constructor(private authService: AuthService) {}
  logout() { this.authService.logout(); }
  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
  getAvatarColor(name: string): string {
    const colors = ['#7c5cfc', '#0d9488', '#d97706', '#be123c', '#1d4ed8'];
    return colors[name.charCodeAt(0) % colors.length];
  }
}
