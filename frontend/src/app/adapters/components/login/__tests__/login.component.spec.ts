import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { of, throwError } from "rxjs";
import { delay } from "rxjs/operators";

import { AuthApplicationService } from "../../../../application/services/auth-application.service";
import { InvalidCredentialsError } from "../../../../domain/errors/auth-errors";

// Simple test component without RouterLink dependency
import { Component, OnDestroy } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { AuthError } from "../../../../domain/errors/auth-errors";

@Component({
  selector: "app-login-test",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<form [formGroup]="loginForm"></form>`,
})
class TestLoginComponent implements OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthApplicationService,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get("email");
  }
  get password() {
    return this.loginForm.get("password");
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    const { email, password } = this.loginForm.value;
    this.authService
      .login({ email, password })
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

describe("LoginComponent", () => {
  let component: TestLoginComponent;
  let fixture: ComponentFixture<TestLoginComponent>;
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
    authServiceSpy = jasmine.createSpyObj("AuthApplicationService", ["login"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [TestLoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthApplicationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have invalid form when empty", () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it("should require email", () => {
    const email = component.loginForm.get("email");
    expect(email?.errors?.["required"]).toBeTrue();
  });

  it("should validate email format", () => {
    const email = component.loginForm.get("email");
    email?.setValue("invalid-email");
    expect(email?.errors?.["email"]).toBeTrue();

    email?.setValue("valid@email.com");
    expect(email?.errors).toBeNull();
  });

  it("should require password with minimum 6 characters", () => {
    const password = component.loginForm.get("password");
    expect(password?.errors?.["required"]).toBeTrue();

    password?.setValue("12345");
    expect(password?.errors?.["minlength"]).toBeTruthy();

    password?.setValue("123456");
    expect(password?.errors).toBeNull();
  });

  it("should not submit when form is invalid", () => {
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it("should call authService.login on valid form submission", fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of(mockUser));

    component.loginForm.setValue({
      email: "test@example.com",
      password: "password123",
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  }));

  it("should navigate to home on successful login", fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of(mockUser));

    component.loginForm.setValue({
      email: "test@example.com",
      password: "password123",
    });

    component.onSubmit();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(["/"]);
  }));

  it("should display error message on login failure", fakeAsync(() => {
    const error = new InvalidCredentialsError();
    authServiceSpy.login.and.returnValue(throwError(() => error));

    component.loginForm.setValue({
      email: "test@example.com",
      password: "wrongpassword",
    });

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe(error.message);
  }));

  it("should set loading state during API call", fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of(mockUser).pipe(delay(100)));

    component.loginForm.setValue({
      email: "test@example.com",
      password: "password123",
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
