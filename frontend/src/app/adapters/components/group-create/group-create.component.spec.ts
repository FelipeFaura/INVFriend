/**
 * Group Create Component Tests
 */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { GroupCreateComponent } from './group-create.component';
import { GroupHttpService } from '../../services/group-http.service';
import { Group } from '../../../domain/models/group.model';

describe('GroupCreateComponent', () => {
  let component: GroupCreateComponent;
  let fixture: ComponentFixture<GroupCreateComponent>;
  let mockGroupService: jasmine.SpyObj<GroupHttpService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockGroup: Group = {
    id: 'group-123',
    name: 'Test Group',
    description: 'A test group',
    adminId: 'user-1',
    members: ['user-1'],
    budgetLimit: 50,
    raffleStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockGroupService = jasmine.createSpyObj('GroupHttpService', ['createGroup']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [GroupCreateComponent],
      providers: [
        { provide: GroupHttpService, useValue: mockGroupService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Form Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('description')?.value).toBe('');
      expect(component.form.get('budgetLimit')?.value).toBeNull();
    });

    it('should mark form as invalid when empty', () => {
      expect(component.form.invalid).toBeTrue();
    });

    it('should have submit button disabled when form is invalid', () => {
      const submitBtn = fixture.nativeElement.querySelector('[data-testid="submit-btn"]');
      expect(submitBtn.disabled).toBeTrue();
    });
  });

  describe('Name Validation', () => {
    it('should show error for name less than 3 characters', () => {
      const nameControl = component.form.get('name');
      nameControl?.setValue('AB');
      nameControl?.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('[data-testid="name-minlength-error"]');
      expect(errorEl).toBeTruthy();
    });

    it('should show error for name more than 100 characters', () => {
      const nameControl = component.form.get('name');
      nameControl?.setValue('A'.repeat(101));
      nameControl?.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('[data-testid="name-maxlength-error"]');
      expect(errorEl).toBeTruthy();
    });

    it('should show required error when name is empty and touched', () => {
      const nameControl = component.form.get('name');
      nameControl?.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('[data-testid="name-required-error"]');
      expect(errorEl).toBeTruthy();
    });

    it('should not show errors for valid name', () => {
      const nameControl = component.form.get('name');
      nameControl?.setValue('Valid Name');
      nameControl?.markAsTouched();
      fixture.detectChanges();

      const errorEls = fixture.nativeElement.querySelectorAll('[data-testid^="name-"]');
      const visibleErrors = Array.from(errorEls).filter((el: any) => el.textContent);
      // Should only have the input element
      expect(component.hasError('name', 'required')).toBeFalse();
      expect(component.hasError('name', 'minlength')).toBeFalse();
    });
  });

  describe('Budget Validation', () => {
    it('should show error for budget less than or equal to 0', () => {
      const budgetControl = component.form.get('budgetLimit');
      budgetControl?.setValue(0);
      budgetControl?.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('[data-testid="budget-min-error"]');
      expect(errorEl).toBeTruthy();
    });

    it('should show required error when budget is empty and touched', () => {
      const budgetControl = component.form.get('budgetLimit');
      budgetControl?.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('[data-testid="budget-required-error"]');
      expect(errorEl).toBeTruthy();
    });

    it('should accept valid budget', () => {
      const budgetControl = component.form.get('budgetLimit');
      budgetControl?.setValue(50);
      budgetControl?.markAsTouched();
      fixture.detectChanges();

      expect(component.hasError('budgetLimit', 'required')).toBeFalse();
      expect(component.hasError('budgetLimit', 'min')).toBeFalse();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Fill valid form
      component.form.setValue({
        name: 'Test Group',
        description: 'A test description',
        budgetLimit: 50,
      });
    });

    it('should call service on valid submit', fakeAsync(() => {
      mockGroupService.createGroup.and.returnValue(of(mockGroup));

      component.onSubmit();
      tick();

      expect(mockGroupService.createGroup).toHaveBeenCalledWith({
        name: 'Test Group',
        description: 'A test description',
        budgetLimit: 50,
      });
    }));

    it('should navigate to group on success', fakeAsync(() => {
      mockGroupService.createGroup.and.returnValue(of(mockGroup));

      component.onSubmit();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/groups', 'group-123']);
    }));

    it('should show error message on failure', fakeAsync(() => {
      mockGroupService.createGroup.and.returnValue(
        throwError(() => new Error('Creation failed'))
      );

      component.onSubmit();
      tick();
      fixture.detectChanges();

      expect(component.error).toBe('Creation failed');
      const errorEl = fixture.nativeElement.querySelector('[data-testid="error-message"]');
      expect(errorEl).toBeTruthy();
    }));

    it('should set isSubmitting while submitting', fakeAsync(() => {
      mockGroupService.createGroup.and.returnValue(of(mockGroup));

      expect(component.isSubmitting).toBeFalse();
      component.onSubmit();
      expect(component.isSubmitting).toBeTrue();
      tick();
    }));

    it('should reset isSubmitting on error', fakeAsync(() => {
      mockGroupService.createGroup.and.returnValue(
        throwError(() => new Error('Error'))
      );

      component.onSubmit();
      tick();

      expect(component.isSubmitting).toBeFalse();
    }));

    it('should not call service if form is invalid', () => {
      component.form.setValue({
        name: '',
        description: '',
        budgetLimit: null,
      });

      component.onSubmit();

      expect(mockGroupService.createGroup).not.toHaveBeenCalled();
    });

    it('should trim name and description', fakeAsync(() => {
      mockGroupService.createGroup.and.returnValue(of(mockGroup));
      component.form.setValue({
        name: '  Test Group  ',
        description: '  Description  ',
        budgetLimit: 50,
      });

      component.onSubmit();
      tick();

      expect(mockGroupService.createGroup).toHaveBeenCalledWith({
        name: 'Test Group',
        description: 'Description',
        budgetLimit: 50,
      });
    }));

    it('should handle empty description', fakeAsync(() => {
      mockGroupService.createGroup.and.returnValue(of(mockGroup));
      component.form.setValue({
        name: 'Test Group',
        description: '',
        budgetLimit: 50,
      });

      component.onSubmit();
      tick();

      expect(mockGroupService.createGroup).toHaveBeenCalledWith({
        name: 'Test Group',
        description: undefined,
        budgetLimit: 50,
      });
    }));
  });

  describe('Navigation', () => {
    it('should navigate back to list on cancel', () => {
      const cancelBtn = fixture.nativeElement.querySelector('[data-testid="cancel-btn"]');
      cancelBtn.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/groups']);
    });

    it('should navigate back on back button click', () => {
      const backBtn = fixture.nativeElement.querySelector('[data-testid="back-btn"]');
      backBtn.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/groups']);
    });
  });

  describe('Helper Methods', () => {
    it('hasError should return true for field with specific error', () => {
      const nameControl = component.form.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      expect(component.hasError('name', 'required')).toBeTrue();
    });

    it('hasError should return false for untouched field', () => {
      expect(component.hasError('name', 'required')).toBeFalse();
    });

    it('isInvalid should return true for invalid touched field', () => {
      const nameControl = component.form.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      expect(component.isInvalid('name')).toBeTrue();
    });
  });
});
