import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employeelist',
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css'],
  providers: [MessageService]
})
export class EmployeelistComponent implements OnInit {
  employeelist: any[] = [];
  expandedBankEmployeeId: string | null = null;
  userRole = 'ADMIN'; // mock role (can be ADMIN / HR / USER)

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  // Mock employees list
  getAllEmployees(): void {
    this.employeelist = [
      {
        empId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        department: 'IT',
        bank: {
          accountHolderName: 'John Doe',
          bankName: 'HDFC Bank',
          accountNumber: '1234567890',
          ifscCode: 'HDFC0001234',
          branch: 'Mumbai',
          accountType: 'Savings'
        }
      },
      {
        empId: 'EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        department: 'HR',
        bank: {
          accountHolderName: 'Jane Smith',
          bankName: 'SBI',
          accountNumber: '9876543210',
          ifscCode: 'SBIN0004567',
          branch: 'Pune',
          accountType: 'Current'
        }
      }
    ];
  }

  getBankTooltip(bank: any): string {
    if (!bank) return 'No bank details available';
    return `Account Holder: ${bank.accountHolderName || 'N/A'}
Bank: ${bank.bankName || 'N/A'}
Account #: ${bank.accountNumber || 'N/A'}
IFSC: ${bank.ifscCode || 'N/A'}
Branch: ${bank.branch || 'N/A'}
Type: ${bank.accountType || 'N/A'}`;
  }

  canModify(): boolean {
    return this.userRole === 'ADMIN' || this.userRole === 'HR';
  }

  editEmployeeList(emp: any): void {
    console.log('Edit employee:', emp);
    this.messageService.add({
      severity: 'info',
      summary: 'Edit',
      detail: `Editing employee: ${emp.firstName} ${emp.lastName}`
    });
  }

  deleteEmployee(empId: string): void {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.employeelist = this.employeelist.filter(emp => emp.empId !== empId);

    this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: 'Employee deleted successfully.'
    });
  }

  toggleBankDetails(empId: string): void {
    this.expandedBankEmployeeId = this.expandedBankEmployeeId === empId ? null : empId;
  }

  isBankExpanded(empId: string): boolean {
    return this.expandedBankEmployeeId === empId;
  }
}
