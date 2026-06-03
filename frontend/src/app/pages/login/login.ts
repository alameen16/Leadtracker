import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  credentials = { email: '', password: '' };
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) { this.error = 'Please fill in all fields'; return; }
    this.loading = true; this.error = '';
    this.authService.login(this.credentials).subscribe({ next: () => this.router.navigate(['/dashboard']), error: (err) => { this.error = err.error?.message || 'Login failed'; this.loading = false; } });
  }
}
