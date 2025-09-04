import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService, LeaveType } from '../../app/auths/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-leave-type',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class LeaveTypeComponent implements OnInit {
  leaveTypeForm!: FormGroup;

  leaveTypeNames: string[] = [
    'SICK_LEAVE',
    'CASUAL_LEAVE',
    'ANNUAL_LEAVE',
    'MATERNITY_LEAVE',
    'PATERNITY_LEAVE',
    'COMP_OFF',
    'LOP',
    'EARNED_LEAVE'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.leaveTypeForm = this.fb.group({
      leaveTypeId: [undefined],
      name: ['', Validators.required],
      description: ['', Validators.required],
      maxDaysPerYear: [
        0,
        [Validators.required, Validators.min(0)] // ✅ No negative numbers
      ],
      carryForward: [false],
      encashable: [false],
       approvalFlow: [''] 
    });
  }

  // Prevent negative input in UI
  preventNegative(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (parseInt(input.value) < 0) {
      input.value = '0';
      this.leaveTypeForm.get('maxDaysPerYear')?.setValue(0);
    }
  }

  confirmSave(): void {
    if (this.leaveTypeForm.invalid) {
      this.show('Please complete all required fields.', 'warn');
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to save this leave type?',
      header: 'Confirm Save',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onSubmit();
      }
    });
  }

  onSubmit(): void {
    const formValue = { ...this.leaveTypeForm.value } as any;

  // force approvalFlow to string before splitting
  const approvalFlowStr: string = formValue.approvalFlow ?? '';

  formValue.approvalFlow = formValue.approvalFlow
  ? (formValue.approvalFlow as string).trim()
  : '';
 

    if (!formValue.leaveTypeId) {
      const { leaveTypeId, ...createPayload } = formValue;
      this.authService.addLeaveType(createPayload as LeaveType).subscribe({
        next: () => {
          this.show('Leave type added successfully', 'success');
          this.leaveTypeForm.reset();
        },
        error: () => this.show(' add leave type', 'error')
      });
    } else {
      this.authService.updateLeaveType(formValue.leaveTypeId, formValue).subscribe({
        next: () => {
          this.show('Leave type updated successfully', 'success');
          this.leaveTypeForm.reset();
        },
        error: () => this.show('update leave type', 'error')
      });
    }
  }

  fetchById(): void {
    const id = this.leaveTypeForm.get('leaveTypeId')?.value;
    if (!id) {
      this.show('Please enter Leave Type ID to fetch', 'warn');
      return;
    }

    this.authService.getLeaveTypeById(id).subscribe({
      next: (data: LeaveType) => this.leaveTypeForm.patchValue(data),
      error: () => this.show('Leave type not found', 'error')
    });
  }

  deleteById(): void {
    const id = this.leaveTypeForm.get('leaveTypeId')?.value;
    if (!id) {
      this.show('Please enter Leave Type ID to delete', 'warn');
      return;
    }

    this.authService.deleteLeaveType(id).subscribe({
      next: () => {
        this.show('Leave type deleted successfully', 'warn');
        this.leaveTypeForm.reset();
      },
      error: () => this.show('delete leave type', 'error')
    });
  }

  private show(detail: string, severity: 'success' | 'info' | 'warn' | 'error') {
    this.messageService.add({
      severity,
      summary: 'Leave Type',
      detail
    });
  }

  goBack(): void {
    window.history.back();
  }
}
