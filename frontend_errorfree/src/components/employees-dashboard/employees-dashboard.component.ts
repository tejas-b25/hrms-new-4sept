import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSidebarComponent } from "../employee-sidebar/employee-sidebar.component";
import { AuthService } from '../../app/auths/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employees-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeSidebarComponent,
    FormsModule,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './employees-dashboard.component.html',
  styleUrls: ['./employees-dashboard.component.css'],
  providers: [MessageService]
})
export class EmployeesDashboardComponent implements OnInit {

  username: string = '';
  empId!: number;
  clockedIn: boolean = false;

  clockInForm!: FormGroup;
  clockOutForm!: FormGroup;
  regularizeForm!: FormGroup;

  leaveBalance = [
    { type: 'Annual Leave', total: 12, used: 5 },
    { type: 'Sick Leave', total: 8, used: 2 },
    { type: 'Casual Leave', total: 5, used: 1 }
  ];

  attendance = {
    daysPresent: 18,
    daysAbsent: 2,
    workFromHome: 3
  };

  holidays = [
    { name: 'Independence Day', date: '2025-08-15' },
    { name: 'Ganesh Chaturthi', date: '2025-09-06' },
    { name: 'Diwali', date: '2025-10-29' }
  ];

  payrollDate = '2025-06-30';

  leaveHistory = [
    { type: 'Annual Leave', from: '2025-06-10', to: '2025-06-12', status: 'Approved' },
    { type: 'Sick Leave', from: '2025-06-17', to: '2025-06-18', status: 'Pending' },
    { type: 'Casual Leave', from: '2025-05-05', to: '2025-05-06', status: 'Rejected' }
  ];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    this.empId = Number(this.authService.getEmployeeIdFromToken());
    console.log('Current empId:', this.empId);

    if (currentUser && currentUser.username) {
      this.username = currentUser.username;
    } else {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.username = JSON.parse(storedUser).username;
      }
    }

    this.clockInForm = this.fb.group({
      mode: ['WEB', Validators.required],
      location: ['', Validators.required],
      workFrom: ['', Validators.required],
    });

    this.clockOutForm = this.fb.group({
      employeeId: [this.empId, Validators.required],
    });

    this.regularizeForm = this.fb.group({
      date: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  loadAllRegularizationRequests() {
    console.log('Fetching regularization requests...');
  }

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
  logout(event?: Event) {
    if (event) event.preventDefault();
    this.authService.logout();
    window.location.href = '/login';
  }
}
