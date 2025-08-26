import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ManagerSidebarComponent } from "../manager-sidebar/manager-sidebar.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../app/auths/auth.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    ManagerSidebarComponent,
    FormsModule,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
  providers: [MessageService]
})
export class ManagerDashboardComponent implements OnInit {

username: string = ''; 

  teamSize = 48;
  pendingApprovals = 5;
  activeProjects = 7;
  escalations = 2;

  taskDistributionData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Completed', 'In Progress', 'Pending', 'Blocked'],
    datasets: [{
      data: [60, 25, 10, 5],
      backgroundColor: ['#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
    }]
  };

  projectStatusData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Alpha', 'Beta', 'Gamma', 'Delta'],
    datasets: [{ label: 'Progress (%)', data: [80, 65, 90, 55], backgroundColor: '#4e73df' }]
  };

  projectStatusOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true, max: 100 } }
  };

  clockInForm!: FormGroup;
  clockOutForm!: FormGroup;
  regularizeForm!: FormGroup;
  empId: string = '';
  clockedIn: boolean = false;
  attendanceRequests: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private http: HttpClient
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


    this.empId = this.authService.getEmployeeIdFromToken();
    this.loadAllRegularizationRequests();

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

  clockIn() {
    if (!this.clockInForm.valid) return;

    const { location, workFrom } = this.clockInForm.value;

    this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
      .subscribe({
        next: (res: any) => {
          if (res.length > 0) {
            const lat = parseFloat(res[0].lat);
            const lon = parseFloat(res[0].lon);
            const payload = { mode: 'WEB', latitude: lat, longitude: lon, workFrom };

            this.authService.clockInAttendance(payload).subscribe({
              next: (res: any) => {
                this.clockedIn = true;
                const clockInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                this.messageService.add({
                  severity: 'success',
                  summary: 'Clock-in Successful',
                  detail: `${res.message} at ${clockInTime}. Have a great day!`,
                });
              },
              error: (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: err.error?.message || 'Clock-in failed.',
                });
              },
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Not Found',
              detail: 'Unable to get coordinates for the given location.',
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'API Error',
            detail: 'Failed to fetch coordinates from location.',
          });
        },
      });
  }

  clockOutAttendance() {
    this.authService.clockOutAttendance().subscribe({
      next: (res: any) => {
        this.clockedIn = false;
        const clockOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.messageService.add({
          severity: 'success',
          summary: 'Clock-out Successful',
          detail: `${res.message} at ${clockOutTime}.`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Clock-out failed.',
        });
      }
    });
  }

  submitRegularization() {
    if (!this.regularizeForm.valid) {
      this.messageService.add({ severity: 'warn', summary: 'Form Invalid', detail: 'Please fill in all required fields.' });
      return;
    }

    const { date, reason } = this.regularizeForm.value;
    this.authService.requestRegularization(date, reason).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Request Submitted', detail: 'Regularization requested.' });
        this.regularizeForm.reset();
        this.loadAllRegularizationRequests();
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Request Failed', detail: err.error?.message || err.message });
      }
    });
  }

  loadAllRegularizationRequests() {
    this.authService.getAllRegularizationRequests().subscribe({
      next: (data) => this.attendanceRequests = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load regularization requests' })
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  goBack() {
    window.history.back();
  }
}
