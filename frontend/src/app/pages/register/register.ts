import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  payload = { name: '', email: '', password: '', role: 'rep' as const };
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.payload.name || !this.payload.email || !this.payload.password) { this.error = 'Please fill in all fields'; return; }
    this.loading = true; this.error = '';
    this.authService.register(this.payload).subscribe({ next: () => this.router.navigate(['/dashboard']), error: (err) => { this.error = err.error?.message || 'Registration failed'; this.loading = false; } });
  }
}
