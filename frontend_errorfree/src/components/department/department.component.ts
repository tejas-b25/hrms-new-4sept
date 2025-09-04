import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService, Department, Employee, User } from "../../app/auths/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  providers: [MessageService]
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  departmentForm!: FormGroup;
  isEditMode = false;
  currentEditId: number | null = null;
  userRole = '';
  managers: Employee[] = [];
  users: User[] = [];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.initForm();

    this.authService.getManagersByEmployee().subscribe({
      next: (managers: Employee[]) => {
        this.managers = managers;
        this.loadDepartments();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: ''
        });
        if (err instanceof HttpErrorResponse) {
          console.error('HTTP Error Details:', err);
        }
        this.loadDepartments();
      }
    });

    if (this.authService.isAdmin()) {
      this.loadUsers();
    }
  }

  initForm() {
    this.departmentForm = this.fb.group({
      departmentCode: ['', [Validators.required, Validators.maxLength(8)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(100)]],
      location: ['', [Validators.maxLength(10)]],
      departmentHead: [null]
    });
  }

  // LIVE typing restrictions
  restrictDepartmentCode(event: any) {
    const regex = /^[A-Za-z0-9]*$/;
    if (!regex.test(event.key) || event.target.value.length >= 8) {
      event.preventDefault();
    }
  }

  restrictName(event: any) {
    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(event.key) || event.target.value.length >= 40) {
      event.preventDefault();
    }
  }

  restrictDescription(event: any) {
    if (event.target.value.length >= 100) {
      event.preventDefault();
    }
  }

  restrictLocation(event: any) {
    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(event.key) || event.target.value.length >= 10) {
      event.preventDefault();
    }
  }

  loadDepartments() {
    this.authService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load departments.'
        });
      }
    });
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users.'
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.departmentForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Form',
        detail: 'Please fill all required fields correctly.'
      });
      return;
    }

    const fv = this.departmentForm.value;
    const payload = {
      departmentCode: fv.departmentCode,
      name: fv.name!,
      description: fv.description,
      location: fv.location,
      departmentHead: fv.departmentHead ? { empId: fv.departmentHead.empId } : null
    } as any;

    const action$ = this.isEditMode && this.currentEditId != null
      ? this.authService.updateDepartment(this.currentEditId, payload)
      : this.authService.createDepartment(payload as Department);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Department ${this.isEditMode ? 'updated' : 'created'} successfully.`
        });
        this.resetForm();
        this.loadDepartments();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.isEditMode ? 'update' : 'create'} department.`
        });
      }
    });
  }

  editDepartment(dept: Department) {
    this.currentEditId = dept.departmentId ?? null;
    this.isEditMode = true;
    this.departmentForm.patchValue({
      departmentCode: dept.departmentCode,
      name: dept.name,
      description: dept.description,
      location: dept.location,
      departmentHead: dept.departmentHead ?? null
    });
  }

  deleteDepartment(id: number) {
    if (confirm('Delete this department?')) {
      this.authService.deleteDepartment(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Department deleted successfully.'
          });
          this.loadDepartments();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete department.'
          });
        }
      });
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.currentEditId = null;
    this.submitted = false;
    this.departmentForm.reset();
  }

  canModify(): boolean {
    return this.authService.isAdmin() || this.authService.isHR();
  }

  getManagerNameById(empId: number | null | undefined): string {
    const mgr = this.managers.find(m => m.empId === empId);
    return mgr ? `${mgr.firstName} ${mgr.lastName} (${mgr.employeeCode})` : 'N/A';
  }

  goBack(): void {
    window.history.back();
  }
}
