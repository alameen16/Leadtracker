import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  activeTab = 'profile';
  tabs = ['profile', 'notifications', 'security'];

  notifications = {
    emailAlerts: true,
    leadAssignment: true,
    followUpReminders: false,
    dealUpdates: true,
  };

  profile = {
    name: '',
    email: '',
    phone: '',
  };

  constructor(public authService: AuthService) {
    const user = authService.currentUser();
    if (user) {
      this.profile.name = user.name;
      this.profile.email = user.email;
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ['#7c5cfc', '#0d9488', '#d97706', '#be123c', '#1d4ed8'];
    return colors[name.charCodeAt(0) % colors.length];
  }

  logout() { this.authService.logout(); }
}
