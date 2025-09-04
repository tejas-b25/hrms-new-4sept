import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/auths/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService]
})
export class RegisterComponent {
  user = { username: '', email: '', role: '' };
  roles = ['HR', 'MANAGER', 'FINANCE', 'EMPLOYEE'];
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    // Ensure admin is logged in
    if (!this.authService.isLoggedIn()) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Access Denied',
        detail: 'Admin must be logged in to register users.'
      });
      return;
    }

    // Call backend API
    this.authService.register(this.user).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: 'User has been registered successfully!'
        });

        // Redirect after short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err?.error || err?.message || 'Something went wrong.';
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: this.errorMessage
        });
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
