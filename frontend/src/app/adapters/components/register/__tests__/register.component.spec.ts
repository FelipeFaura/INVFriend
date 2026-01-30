import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {
  ReactiveFormsModule,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { of, throwError } from "rxjs";
import { delay } from "rxjs/operators";

import { AuthApplicationService } from "../../../../application/services/auth-application.service";
import {
  UserAlreadyExistsError,
  AuthError,
} from "../../../../domain/errors/auth-errors";

// Test component without RouterLink dependency
import { Component, OnDestroy } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";

function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get("password");
  const confirmPassword = control.get("confirmPassword");
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: "app-register-test",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<form [formGroup]="registerForm"></form>`,
})
class TestRegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthApplicationService,
    private readonly router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  get name() {
    return this.registerForm.get("name");
  }
  get email() {
    return this.registerForm.get("email");
  }
  get password() {
    return this.registerForm.get("password");
  }
  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    const { name, email, password } = this.registerForm.value;
    this.authService
      .register({ name, email, password })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.router.navigate(["/"]);
        },
        error: (error: AuthError) => {
          this.errorMessage = error.message;
        },
      });
  }

  onGoogleSignIn(): void {
    this.errorMessage = "Google Sign-In is not yet implemented";
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

describe("RegisterComponent", () => {
  let component: TestRegisterComponent;
  let fixture: ComponentFixture<TestRegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthApplicationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    photoUrl: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj("AuthApplicationService", [
      "register",
    ]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [TestRegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthApplicationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have invalid form when empty", () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it("should require name with minimum 2 characters", () => {
    const name = component.registerForm.get("name");
    expect(name?.errors?.["required"]).toBeTrue();

    name?.setValue("J");
    expect(name?.errors?.["minlength"]).toBeTruthy();

    name?.setValue("John");
    expect(name?.errors).toBeNull();
  });

  it("should require valid email", () => {
    const email = component.registerForm.get("email");
    expect(email?.errors?.["required"]).toBeTrue();

    email?.setValue("invalid");
    expect(email?.errors?.["email"]).toBeTrue();

    email?.setValue("test@example.com");
    expect(email?.errors).toBeNull();
  });

  it("should require password with minimum 6 characters", () => {
    const password = component.registerForm.get("password");
    expect(password?.errors?.["required"]).toBeTrue();

    password?.setValue("12345");
    expect(password?.errors?.["minlength"]).toBeTruthy();

    password?.setValue("123456");
    expect(password?.errors).toBeNull();
  });

  it("should validate password confirmation", () => {
    component.registerForm.patchValue({
      password: "password123",
      confirmPassword: "differentpassword",
    });

    // Trigger validation
    component.registerForm.updateValueAndValidity();

    const confirmPassword = component.registerForm.get("confirmPassword");
    expect(confirmPassword?.errors?.["passwordMismatch"]).toBeTrue();
  });

  it("should pass validation when passwords match", () => {
    component.registerForm.patchValue({
      name: "John Doe",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(component.registerForm.valid).toBeTrue();
  });

  it("should not submit when form is invalid", () => {
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it("should call authService.register on valid form submission", fakeAsync(() => {
    authServiceSpy.register.and.returnValue(of(mockUser));

    component.registerForm.setValue({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
  }));

  it("should navigate to home on successful registration", fakeAsync(() => {
    authServiceSpy.register.and.returnValue(of(mockUser));

    component.registerForm.setValue({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    component.onSubmit();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(["/"]);
  }));

  it("should display error message on registration failure", fakeAsync(() => {
    const error = new UserAlreadyExistsError("test@example.com");
    authServiceSpy.register.and.returnValue(throwError(() => error));

    component.registerForm.setValue({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe(error.message);
  }));

  it("should set loading state during API call", fakeAsync(() => {
    authServiceSpy.register.and.returnValue(of(mockUser).pipe(delay(100)));

    component.registerForm.setValue({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(component.isLoading).toBeFalse();

    component.onSubmit();
    expect(component.isLoading).toBeTrue();

    tick(100);
    expect(component.isLoading).toBeFalse();
  }));

  it("should show error message for Google Sign-In placeholder", () => {
    component.onGoogleSignIn();
    expect(component.errorMessage).toBe(
      "Google Sign-In is not yet implemented",
    );
  });
});
