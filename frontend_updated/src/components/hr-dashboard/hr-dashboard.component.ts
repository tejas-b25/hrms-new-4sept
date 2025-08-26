import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { HrSidebarComponent } from '../hr-sidebar/hr-sidebar.component';
import { AuthService } from '../../app/auths/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

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
  empId!: number;
  clockedIn: boolean = false;

  clockInForm!: FormGroup;
  clockOutForm!: FormGroup;
  regularizeForm!: FormGroup;

  totalEmployees = 1245;
  newHiresThisMonth = 42;
  employeesOnLeave = 28;
  attritionRate = 8.5;

  departmentChartType: ChartType = 'doughnut';
  departmentData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations', 'Finance'],
    datasets: [{
      data: [420, 180, 250, 60, 200, 135],
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796']
    }]
  };
  departmentOptions: ChartConfiguration<'doughnut'>['options'] = { responsive: true, maintainAspectRatio: false };

  performanceChartType: ChartType = 'bar';
  performanceData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      { label: 'Exceeds Expectations', data: [25, 28, 30, 32], backgroundColor: '#1cc88a' },
      { label: 'Meets Expectations', data: [60, 58, 55, 53], backgroundColor: '#36b9cc' },
      { label: 'Needs Improvement', data: [15, 14, 15, 15], backgroundColor: '#f6c23e' }
    ]
  };
  performanceOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } };

  hiringStages = [
    { stage: 'Applied', count: 156 },
    { stage: 'Screening', count: 78 },
    { stage: 'Interview', count: 45 },
    { stage: 'Offer', count: 12 },
    { stage: 'Hired', count: 8 }
  ];

  leaveBalance = [
    { type: 'Annual Leave', balance: 12, used: 8 },
    { type: 'Sick Leave', balance: 10, used: 3 },
    { type: 'Personal Leave', balance: 5, used: 1 }
  ];

  upcomingEvents = [
    { title: 'Quarterly Review', date: new Date('2023-12-15'), type: 'meeting' },
    { title: 'HR Policy Update', date: new Date('2023-12-18'), type: 'announcement' },
    { title: 'Team Building', date: new Date('2023-12-22'), type: 'event' },
    { title: 'Payroll Processing', date: new Date('2023-12-25'), type: 'reminder' }
  ];

  trainingStatus = { completed: 65, inProgress: 23, notStarted: 12 };

  constructor(private authService: AuthService, private fb: FormBuilder, private messageService: MessageService, private http: HttpClient) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    this.empId = Number(this.authService.getEmployeeIdFromToken());

    if (currentUser && currentUser.username) {
      this.username = currentUser.username;
    } else {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) this.username = JSON.parse(storedUser).username;
    }

    this.clockInForm = this.fb.group({
      mode: ['WEB', Validators.required],
      location: ['', Validators.required],
      workFrom: ['', Validators.required],
    });

    this.clockOutForm = this.fb.group({ employeeId: [this.empId, Validators.required] });

    this.regularizeForm = this.fb.group({
      date: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  clockIn() {
    if (!this.clockInForm.valid) return;
    const { location, workFrom } = this.clockInForm.value;
    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`).subscribe({
      next: (res: any) => {
        if (!res.length) {
          this.messageService.add({ severity: 'warn', summary: 'Not Found', detail: 'Unable to get coordinates.' });
          return;
        }
        const lat = parseFloat(res[0].lat);
        const lon = parseFloat(res[0].lon);
        const payload = { mode: 'WEB', latitude: lat, longitude: lon, workFrom };
        this.authService.clockInAttendance(payload).subscribe({
          next: (res: any) => {
            this.clockedIn = true;
            const clockInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            this.messageService.add({ severity: 'success', summary: 'Clock-in Successful', detail: `${res.message} at ${clockInTime}` });
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Clock-in failed' })
        });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'API Error', detail: 'Failed to fetch coordinates' })
    });
  }

  clockOutAttendance() {
    this.authService.clockOutAttendance().subscribe({
      next: () => { this.clockedIn = false; this.messageService.add({ severity: 'success', summary: 'Clocked Out' }); },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error })
    });
  }

  submitRegularization() {
    if (!this.regularizeForm.valid) {
      this.messageService.add({ severity: 'warn', summary: 'Form Invalid', detail: 'Fill all required fields.' });
      return;
    }
    const date = this.regularizeForm.get('date')?.value;
    const reason = this.regularizeForm.get('reason')?.value;
    this.authService.requestRegularization(date, reason).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Request Submitted', detail: 'Regularization requested.' }),
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Request Failed', detail: err.error || err.message })
    });
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'meeting': return 'fa-calendar-check';
      case 'announcement': return 'fa-bullhorn';
      case 'event': return 'fa-users';
      case 'reminder': return 'fa-bell';
      default: return 'fa-calendar';
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
