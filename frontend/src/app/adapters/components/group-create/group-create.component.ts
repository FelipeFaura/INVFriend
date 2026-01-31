/**
 * Group Create Component
 * Form to create new Secret Santa groups
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { GroupHttpService } from "../../services/group-http.service";
import { CreateGroupDTO } from "../../../application/dto/group.dto";

@Component({
  selector: "app-group-create",
  templateUrl: "./group-create.component.html",
  styleUrls: ["./group-create.component.scss"],
})
export class GroupCreateComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private groupHttpService: GroupHttpService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the reactive form
   */
  private initForm(): void {
    this.form = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: ["", [Validators.maxLength(500)]],
      budgetLimit: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  /**
   * Check if a field has errors and has been touched
   */
  hasError(field: string, errorType: string): boolean {
    const control = this.form.get(field);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  /**
   * Check if field is invalid and touched
   */
  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.invalid && control.touched : false;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const dto: CreateGroupDTO = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim() || undefined,
      budgetLimit: Number(this.form.value.budgetLimit),
    };

    this.groupHttpService
      .createGroup(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (group) => {
          this.router.navigate(["/groups", group.id]);
        },
        error: (err) => {
          this.error = err.message || "Failed to create group";
          this.isSubmitting = false;
        },
      });
  }

  /**
   * Navigate back to group list
   */
  onCancel(): void {
    this.router.navigate(["/groups"]);
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormAsTouched(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsTouched();
    });
  }
}
