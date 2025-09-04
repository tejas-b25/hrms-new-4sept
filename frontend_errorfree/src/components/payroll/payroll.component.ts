import { Component, OnInit } from '@angular/core';
import { AuthService, Payroll, Employee } from '../../app/auths/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css'],
})
export class PayrollComponent implements OnInit {
  form!: FormGroup;
  payroll?: Payroll;
  errorMessage: string = '';
  allEmployees: Employee[] = [];
  maxYear: number = new Date().getFullYear();

  // Short month names directly for dropdown & API
  months = [
    { name: 'Jan', value: 'Jan' },
    { name: 'Feb', value: 'Feb' },
    { name: 'Mar', value: 'Mar' },
    { name: 'Apr', value: 'Apr' },
    { name: 'May', value: 'May' },
    { name: 'Jun', value: 'Jun' },
    { name: 'Jul', value: 'Jul' },
    { name: 'Aug', value: 'Aug' },
    { name: 'Sep', value: 'Sep' },
    { name: 'Oct', value: 'Oct' },
    { name: 'Nov', value: 'Nov' },
    { name: 'Dec', value: 'Dec' }
  ];

  years: number[] = [];

  constructor(private payrollService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.populateYears();

    this.form = this.fb.group({
      employeeId: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required]
    });

    this.loadEmployees();
  }

  populateYears() {
    const startYear = 2000;
    for (let y = this.maxYear; y >= startYear; y--) {
      this.years.push(y);
    }
  }

  private loadEmployees() {
    this.payrollService.getAllEmployees().subscribe({
      next: (data) => {
        this.allEmployees = data || [];
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.message || 'Failed to load employees';
      }
    });
  }

  private isFormValid(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Please fill all fields correctly.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  generate() {
    if (!this.isFormValid()) return;

    const { employeeId, month, year } = this.form.value;
    this.payrollService.generatePayroll(employeeId, month, year).subscribe({
      next: (payroll) => {
        this.payroll = payroll;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.message || 'Error generating payroll';
        this.payroll = undefined;
      },
    });
  }

  viewPayroll() {
    if (!this.isFormValid()) return;

    const { employeeId, month, year } = this.form.value;
    this.payrollService.viewPayroll(employeeId, month, year).subscribe({
      next: (payroll) => {
        this.payroll = payroll;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.message || 'Error fetching payroll';
        this.payroll = undefined;
      },
    });
  }

  downloadPayslip() {
    if (!this.isFormValid()) return;

    const { employeeId, month, year } = this.form.value;
    this.payrollService.downloadPayslip(employeeId, month, year).subscribe({
      next: (response) => {
        const blob = new Blob([response.body!], { type: 'application/pdf' });
        let filename = '';
        const contentDisposition = response.headers.get('Content-Disposition');
        const employee = this.allEmployees.find(e => e.empId.toString() === employeeId);

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          filename = match && match[1] ? match[1] : 'payslip.pdf';
        } else if (employee) {
          const firstName = employee.firstName.replace(/\s+/g, '_');
          const lastName = employee.lastName.replace(/\s+/g, '_');
          filename = `${firstName}_${lastName}(${employeeId})_${month}_${year}.pdf`;
        } else {
          filename = `payslip_${employeeId}_${month}_${year}.pdf`;
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.message || 'Error downloading payslip';
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
