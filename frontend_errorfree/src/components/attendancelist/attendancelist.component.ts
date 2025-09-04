import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendancelist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendancelist.component.html',
  styleUrls: ['./attendancelist.component.css']
})
export class AttendancelistComponent implements OnInit {
  attendanceList: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAttendance();
  }

  fetchAttendance(): void {
    const token =
      'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc1Njg3NDE2MSwiZXhwIjoxNzU2OTYwNTYxfQ.wCkyR0-C7VMH6BzGokxuADEYSHy-8iEa5mvn0EiyJj4';

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http
      .get<any[]>('http://localhost:8080/api/attendance/employee/1', {
        headers
      })
      .subscribe({
        next: (data) => {
          this.attendanceList = data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load attendance records';
          this.loading = false;
          console.error(err);
        }
      });
  }
}
