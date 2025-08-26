import {
  AuthService,
  CommonModule,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  InputNumberModule,
  InputTextModule,
  MessageService,
  NgControlStatus,
  NgControlStatusGroup,
  NgForOf,
  NgIf,
  NgSelectOption,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Toast,
  ToastModule,
  Validators,
  __objRest,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate3
} from "./chunk-XFH5NMLG.js";

// src/components/banking/banking.component.ts
function BankingComponent_option_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emp_r1 = ctx.$implicit;
    \u0275\u0275property("value", emp_r1.empId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3(" ", emp_r1.firstName, " ", emp_r1.lastName, " (", emp_r1.employeeCode, ") ");
  }
}
function BankingComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1, " Employee is required. ");
    \u0275\u0275elementEnd();
  }
}
function BankingComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1, " Account holder name is required. ");
    \u0275\u0275elementEnd();
  }
}
function BankingComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1, " Bank name is required. ");
    \u0275\u0275elementEnd();
  }
}
function BankingComponent_div_30_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1, "Account number is required.");
    \u0275\u0275elementEnd();
  }
}
function BankingComponent_div_30_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1, "Account number must be numeric.");
    \u0275\u0275elementEnd();
  }
}
function BankingComponent_div_30_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1, "Account number must be at least 8 digits.");
    \u0275\u0275elementEnd();
  }
}
function BankingComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275template(1, BankingComponent_div_30_div_1_Template, 2, 0, "div", 22)(2, BankingComponent_div_30_div_2_Template, 2, 0, "div", 22)(3, BankingComponent_div_30_div_3_Template, 2, 0, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_1_0 = ctx_r1.bankForm.get("accountNumber")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r1.bankForm.get("accountNumber")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["pattern"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_3_0 = ctx_r1.bankForm.get("accountNumber")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["minlength"]);
  }
}
function BankingComponent_div_35_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1, "IFSC code is required.");
    \u0275\u0275elementEnd();
  }
}
function BankingComponent_div_35_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1, "Enter a valid IFSC code.");
    \u0275\u0275elementEnd();
  }
}
function BankingComponent_div_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275template(1, BankingComponent_div_35_div_1_Template, 2, 0, "div", 22)(2, BankingComponent_div_35_div_2_Template, 2, 0, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_1_0 = ctx_r1.bankForm.get("ifscCode")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r1.bankForm.get("ifscCode")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["pattern"]);
  }
}
function BankingComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1, " Branch name is required. ");
    \u0275\u0275elementEnd();
  }
}
function BankingComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1, " Account type is required. ");
    \u0275\u0275elementEnd();
  }
}
var BankingComponent = class _BankingComponent {
  constructor(fb, authService, messageService) {
    this.fb = fb;
    this.authService = authService;
    this.messageService = messageService;
    this.allEmployees = [];
  }
  ngOnInit() {
    this.buildForm();
    this.loadEmployees();
  }
  buildForm() {
    this.bankForm = this.fb.group({
      employeeId: ["", Validators.required],
      accountHolderName: ["", Validators.required],
      bankName: ["", Validators.required],
      accountNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.minLength(8)
        ]
      ],
      ifscCode: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        ]
      ],
      branch: ["", Validators.required],
      accountType: ["", Validators.required]
    });
  }
  loadEmployees() {
    this.authService.getAllEmployees().subscribe({
      next: (employees) => {
        this.allEmployees = employees;
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load employees."
        });
      }
    });
  }
  onSubmit() {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      this.messageService.add({
        severity: "warn",
        summary: "Incomplete Form",
        detail: "Please fill all required fields correctly."
      });
      return;
    }
    const _a = this.bankForm.value, { employeeId } = _a, payload = __objRest(_a, ["employeeId"]);
    this.authService.createBankDetails(employeeId, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Bank details saved successfully."
        });
        this.bankForm.reset();
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to save bank details."
        });
      }
    });
  }
  goBack() {
    window.history.back();
  }
  static {
    this.\u0275fac = function BankingComponent_Factory(t) {
      return new (t || _BankingComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(MessageService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BankingComponent, selectors: [["app-banking"]], standalone: true, features: [\u0275\u0275ProvidersFeature([MessageService]), \u0275\u0275StandaloneFeature], decls: 55, vars: 10, consts: [[1, "top-button-wrapper"], [1, "action-button", 3, "click"], [1, "container", "mt-4"], [3, "ngSubmit", "formGroup"], [1, "form-group"], ["formControlName", "employeeId", 1, "form-control"], ["value", "", "disabled", ""], [3, "value", 4, "ngFor", "ngForOf"], ["class", "text-danger", 4, "ngIf"], [1, "form-group", "mt-3"], ["type", "text", "placeholder", "Enter account holder name", "formControlName", "accountHolderName", 1, "form-control"], ["type", "text", "placeholder", "Enter bank name", "formControlName", "bankName", 1, "form-control"], ["type", "text", "placeholder", "Enter account number", "formControlName", "accountNumber", 1, "form-control"], ["type", "text", "placeholder", "e.g. SBIN0001234", "formControlName", "ifscCode", 1, "form-control"], ["type", "text", "placeholder", "Enter branch name", "formControlName", "branch", 1, "form-control"], ["formControlName", "accountType", 1, "form-control"], ["value", "SAVINGS"], ["value", "CURRENT"], [1, "mt-4"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [3, "value"], [1, "text-danger"], [4, "ngIf"]], template: function BankingComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275element(0, "p-toast");
        \u0275\u0275elementStart(1, "div", 0)(2, "button", 1);
        \u0275\u0275listener("click", function BankingComponent_Template_button_click_2_listener() {
          return ctx.goBack();
        });
        \u0275\u0275text(3, "\xD7");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(4, "div", 2)(5, "h2");
        \u0275\u0275text(6, "Add Bank Details");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "form", 3);
        \u0275\u0275listener("ngSubmit", function BankingComponent_Template_form_ngSubmit_7_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(8, "div", 4)(9, "label");
        \u0275\u0275text(10, "Employee");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "select", 5)(12, "option", 6);
        \u0275\u0275text(13, "Select Employee");
        \u0275\u0275elementEnd();
        \u0275\u0275template(14, BankingComponent_option_14_Template, 2, 4, "option", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275template(15, BankingComponent_div_15_Template, 2, 0, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "div", 9)(17, "label");
        \u0275\u0275text(18, "Account Holder Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(19, "input", 10);
        \u0275\u0275template(20, BankingComponent_div_20_Template, 2, 0, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "div", 9)(22, "label");
        \u0275\u0275text(23, "Bank Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(24, "input", 11);
        \u0275\u0275template(25, BankingComponent_div_25_Template, 2, 0, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "div", 9)(27, "label");
        \u0275\u0275text(28, "Account Number");
        \u0275\u0275elementEnd();
        \u0275\u0275element(29, "input", 12);
        \u0275\u0275template(30, BankingComponent_div_30_Template, 4, 3, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "div", 9)(32, "label");
        \u0275\u0275text(33, "IFSC Code");
        \u0275\u0275elementEnd();
        \u0275\u0275element(34, "input", 13);
        \u0275\u0275template(35, BankingComponent_div_35_Template, 3, 2, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "div", 9)(37, "label");
        \u0275\u0275text(38, "Branch");
        \u0275\u0275elementEnd();
        \u0275\u0275element(39, "input", 14);
        \u0275\u0275template(40, BankingComponent_div_40_Template, 2, 0, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(41, "div", 9)(42, "label");
        \u0275\u0275text(43, "Account Type");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(44, "select", 15)(45, "option", 6);
        \u0275\u0275text(46, "Select Type");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(47, "option", 16);
        \u0275\u0275text(48, "Savings");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(49, "option", 17);
        \u0275\u0275text(50, "Current");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(51, BankingComponent_div_51_Template, 2, 0, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(52, "div", 18)(53, "button", 19);
        \u0275\u0275text(54, "Save Bank Details");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        let tmp_2_0;
        let tmp_3_0;
        let tmp_4_0;
        let tmp_5_0;
        let tmp_6_0;
        let tmp_7_0;
        let tmp_8_0;
        \u0275\u0275advance(7);
        \u0275\u0275property("formGroup", ctx.bankForm);
        \u0275\u0275advance(7);
        \u0275\u0275property("ngForOf", ctx.allEmployees);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ((tmp_2_0 = ctx.bankForm.get("employeeId")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx.bankForm.get("employeeId")) == null ? null : tmp_2_0.touched));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ((tmp_3_0 = ctx.bankForm.get("accountHolderName")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.bankForm.get("accountHolderName")) == null ? null : tmp_3_0.touched));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ((tmp_4_0 = ctx.bankForm.get("bankName")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx.bankForm.get("bankName")) == null ? null : tmp_4_0.touched));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ((tmp_5_0 = ctx.bankForm.get("accountNumber")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx.bankForm.get("accountNumber")) == null ? null : tmp_5_0.touched));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ((tmp_6_0 = ctx.bankForm.get("ifscCode")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx.bankForm.get("ifscCode")) == null ? null : tmp_6_0.touched));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ((tmp_7_0 = ctx.bankForm.get("branch")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx.bankForm.get("branch")) == null ? null : tmp_7_0.touched));
        \u0275\u0275advance(11);
        \u0275\u0275property("ngIf", ((tmp_8_0 = ctx.bankForm.get("accountType")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx.bankForm.get("accountType")) == null ? null : tmp_8_0.touched));
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.bankForm.invalid);
      }
    }, dependencies: [
      CommonModule,
      NgForOf,
      NgIf,
      FormsModule,
      \u0275NgNoValidate,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      SelectControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      ReactiveFormsModule,
      FormGroupDirective,
      FormControlName,
      ToastModule,
      Toast,
      InputTextModule,
      InputNumberModule
    ], styles: ["\n\n.bank-form[_ngcontent-%COMP%], .bank-list[_ngcontent-%COMP%] {\n  max-width: 800px;\n  margin: 20px auto;\n  padding: 20px;\n  background: #f0f4f8;\n  border-radius: 8px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n}\n.bank-form[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .bank-list[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  text-align: center;\n}\nform[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  margin-bottom: 15px;\n}\ninput[_ngcontent-%COMP%], select[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 8px;\n  box-sizing: border-box;\n}\n.action-button[_ngcontent-%COMP%] {\n  padding: 8px 16px;\n  background-color: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: background-color 0.3s;\n}\n.action-button[_ngcontent-%COMP%]:hover {\n  background-color: #0056b3;\n}\nbutton[_ngcontent-%COMP%]:last-child, .action-button.cancel[_ngcontent-%COMP%] {\n  background-color: #0066ff;\n}\n.top-button-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  margin-bottom: 1rem;\n}\n.bottom-button-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  margin-top: 1.5rem;\n}\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  margin-top: 20px;\n}\ntable[_ngcontent-%COMP%], th[_ngcontent-%COMP%], td[_ngcontent-%COMP%] {\n  border: 1px solid #ccc;\n}\nth[_ngcontent-%COMP%], td[_ngcontent-%COMP%] {\n  padding: 10px;\n  text-align: center;\n}\n/*# sourceMappingURL=banking.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BankingComponent, { className: "BankingComponent", filePath: "src\\components\\banking\\banking.component.ts", lineNumber: 25 });
})();
export {
  BankingComponent
};
//# sourceMappingURL=chunk-ZHOHBE64.js.map
