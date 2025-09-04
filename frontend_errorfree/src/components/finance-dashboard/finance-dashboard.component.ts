import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FinanceSidebarComponent } from "../finance-sidebar/finance-sidebar.component";
import { AuthService } from '../../app/auths/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, FinanceSidebarComponent, FormsModule, ReactiveFormsModule, ToastModule],
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.css'],
  providers: [MessageService]
})
export class FinanceDashboardComponent implements OnInit {
  clockInForm!: FormGroup;
  clockOutForm!: FormGroup;
  regularizeForm!: FormGroup;

  username: string = '';
  empId!: number;
  clockedIn: boolean = false;
  

  totalRevenue = 2450000;
  totalExpenses = 1870000;
  profitMargin = 23.5;
  pendingInvoices = 56;

  budgetChartType: ChartType = 'bar';
  budgetChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Budget', data: [400000, 380000, 420000, 450000, 460000, 440000], backgroundColor: '#4e73df' },
      { label: 'Actual', data: [390000, 370000, 430000, 440000, 450000, 430000], backgroundColor: '#1cc88a' }
    ]
  };
  budgetChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, maintainAspectRatio: false };

  expenseChartType: ChartType = 'doughnut';
  expenseChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Salaries', 'Operations', 'Marketing', 'R&D', 'Others'],
    datasets: [{ data: [750000, 450000, 300000, 250000, 120000], backgroundColor: ['#f6c23e', '#e74a3b', '#36b9cc', '#858796', '#1cc88a'] }]
  };
  expenseChartOptions: ChartConfiguration<'doughnut'>['options'] = { responsive: true, maintainAspectRatio: false };

  upcomingPayments = [
    { vendor: 'Vendor A', amount: 15000, dueDate: new Date('2025-06-25') },
    { vendor: 'Vendor B', amount: 8200, dueDate: new Date('2025-06-27') },
    { vendor: 'Consultant Z', amount: 12000, dueDate: new Date('2025-07-01') }
  ];

  constructor(private authService: AuthService, private fb: FormBuilder, private messageService: MessageService, private http: HttpClient
 ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    this.empId = Number(this.authService.getEmployeeIdFromToken());
    console.log('Current empId1:', this.empId); 
     this.loadAllRegularizationRequests();

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
    // TODO: Implement API call
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

  printTokenPayload() {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload); // Check the structure of the payload
  } else {
    console.log('No token found');
  }
}
}
