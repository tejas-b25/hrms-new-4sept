import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { HrSidebarComponent } from '../hr-sidebar/hr-sidebar.component';
import { AuthService } from '../../app/auths/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, HrSidebarComponent, FormsModule, ReactiveFormsModule, ToastModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css'],
  providers: [MessageService]
})
export class HrDashboardComponent implements OnInit {
  username: string = '';
  clockedIn: boolean = false;

  clockInForm!: FormGroup;
  clockOutForm!: FormGroup;
  regularizeForm!: FormGroup;

  totalEmployees = 1245;
  newHiresThisMonth = 42;
  employeesOnLeave = 28;
  attritionRate = 8.5;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.username) {
      this.username = currentUser.username;
    } else {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.username = JSON.parse(storedUser).username;
      }
    }

    this.clockInForm = this.fb.group({
      workFrom: ['', Validators.required],
      mode: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.clockOutForm = this.fb.group({}); // employeeId not needed anymore

    this.regularizeForm = this.fb.group({
      date: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  // ✅ Clock In - employeeId not required, backend takes it from JWT
  clockIn() {
    if (!this.clockInForm.valid) {
      this.messageService.add({ severity: 'warn', summary: 'Form Invalid', detail: 'Fill all required fields.' });
      return;
    }

    const { workFrom, mode } = this.clockInForm.value;

    const payload = {
      workFrom,
      mode,
      latitude: -90,
      longitude: -180
    };

    this.authService.clockInAttendance(payload).subscribe({
      next: (res: any) => {
        this.clockedIn = true;
        const clockInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.messageService.add({

                severity: 'success',

                summary: 'Clock-in Successful',

                detail: `${res} at ${clockInTime}. Have a great day!`, // res is plain text now

              });
 
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Clock-in failed'
        });
      }
    });
  }

  // ✅ Clock Out
 clockOutAttendance() {
  this.authService.clockOutAttendance().subscribe({
    next: (res: any) => {
      this.clockedIn = false;
      const clockOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.messageService.add({
        severity: 'success',
        summary: 'Clock-out Successful',
        detail: `${res || 'You clocked out'} at ${clockOutTime}. Have a nice day!`
      });
    },
    error: (err) =>
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message || 'Clock-out failed'
      })
  });
}
  // ✅ Regularize
submitRegularization() {
  if (!this.regularizeForm.valid) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Form Invalid',
      detail: 'Fill all required fields.'
    });
    return;
  }

  const date = this.regularizeForm.get('date')?.value;
  const reason = this.regularizeForm.get('reason')?.value;

  this.authService.requestRegularization(date, reason).subscribe({
    next: (res: any) => {
      const requestTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.messageService.add({
        severity: 'success',
        summary: 'Regularization Submitted',
        detail: `${res || 'Request submitted'} on ${date} at ${requestTime}.`
      });
    },
    error: (err) =>
      this.messageService.add({
        severity: 'error',
        summary: 'Request Failed',
        detail: err.error?.message || err.message
      })
  });
}
  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
