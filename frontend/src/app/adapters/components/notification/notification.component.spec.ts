import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of } from 'rxjs';
import { NotificationComponent } from './notification.component';
import { NotificationService } from '../../services/notification.service';
import { Notification, NotificationType } from '../../../domain/models/notification.model';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let notificationsSubject: BehaviorSubject<Notification[]>;

  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'success' as NotificationType,
      title: 'Success',
      message: 'Operation completed',
      duration: 5000
    },
    {
      id: '2',
      type: 'error' as NotificationType,
      title: 'Error',
      message: 'Something went wrong',
      duration: 0
    }
  ];

  beforeEach(async () => {
    notificationsSubject = new BehaviorSubject<Notification[]>([]);
    
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'dismiss',
      'dismissAll',
      'getNotifications'
    ]);
    mockNotificationService.getNotifications.and.returnValue(notificationsSubject.asObservable());

    await TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      imports: [NoopAnimationsModule],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('notifications subscription', () => {
    it('should subscribe to notifications on init', () => {
      notificationsSubject.next(mockNotifications);
      fixture.detectChanges();

      expect(component.notifications.length).toBe(2);
    });

    it('should update notifications when service emits', () => {
      expect(component.notifications.length).toBe(0);

      notificationsSubject.next([mockNotifications[0]]);
      fixture.detectChanges();
      expect(component.notifications.length).toBe(1);

      notificationsSubject.next(mockNotifications);
      fixture.detectChanges();
      expect(component.notifications.length).toBe(2);
    });
  });

  describe('dismiss', () => {
    it('should call service dismiss with notification id', () => {
      const notificationId = '1';
      
      component.dismiss(notificationId);
      
      expect(mockNotificationService.dismiss).toHaveBeenCalledWith('1');
    });
  });

  describe('getIcon', () => {
    it('should return check emoji for success', () => {
      expect(component.getIcon('success')).toBe('✅');
    });

    it('should return x emoji for error', () => {
      expect(component.getIcon('error')).toBe('❌');
    });

    it('should return info emoji for info', () => {
      expect(component.getIcon('info')).toBe('ℹ️');
    });

    it('should return warning emoji for warning', () => {
      expect(component.getIcon('warning')).toBe('⚠️');
    });

    it('should return info emoji for unknown type', () => {
      expect(component.getIcon('unknown')).toBe('ℹ️');
    });
  });

  describe('trackById', () => {
    it('should return notification id', () => {
      const notification = mockNotifications[0];
      
      expect(component.trackById(0, notification)).toBe('1');
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      notificationsSubject.next(mockNotifications);
      fixture.detectChanges();
    });

    it('should render notifications', () => {
      const notificationElements = fixture.nativeElement.querySelectorAll('.notification');
      expect(notificationElements.length).toBe(2);
    });

    it('should apply correct class for notification type', () => {
      const notificationElements = fixture.nativeElement.querySelectorAll('.notification');
      
      expect(notificationElements[0].classList.contains('notification-success')).toBeTrue();
      expect(notificationElements[1].classList.contains('notification-error')).toBeTrue();
    });

    it('should display notification title', () => {
      const titles = fixture.nativeElement.querySelectorAll('.notification-title');
      
      expect(titles[0].textContent).toContain('Success');
      expect(titles[1].textContent).toContain('Error');
    });

    it('should display notification message', () => {
      const messages = fixture.nativeElement.querySelectorAll('.notification-message');
      
      expect(messages[0].textContent).toContain('Operation completed');
      expect(messages[1].textContent).toContain('Something went wrong');
    });

    it('should display correct icon', () => {
      const icons = fixture.nativeElement.querySelectorAll('.notification-icon');
      
      expect(icons[0].textContent).toBe('✅');
      expect(icons[1].textContent).toBe('❌');
    });

    it('should call dismiss when close button clicked', () => {
      const closeButton = fixture.nativeElement.querySelector('.notification-close');
      closeButton.click();
      
      expect(mockNotificationService.dismiss).toHaveBeenCalledWith('1');
    });
  });

  describe('empty state', () => {
    it('should not render container when no notifications', () => {
      notificationsSubject.next([]);
      fixture.detectChanges();

      const notifications = fixture.nativeElement.querySelectorAll('.notification');
      expect(notifications.length).toBe(0);
    });
  });
});
