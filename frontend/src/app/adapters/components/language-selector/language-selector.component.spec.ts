import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { LanguageSelectorComponent } from './language-selector.component';
import { TranslationService } from '../../../application/services/translation.service';
import { Language } from '../../../domain/i18n/language.types';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let mockCurrentLang: Language;
  let setLanguageSpy: jasmine.Spy;
  let translateSpy: jasmine.Spy;

  beforeEach(async () => {
    mockCurrentLang = 'en';
    const langSubject = new Subject<Language>();
    setLanguageSpy = jasmine.createSpy('setLanguage').and.callFake((lang: Language) => {
      mockCurrentLang = lang;
    });
    translateSpy = jasmine.createSpy('translate').and.returnValue('');

    const translationServiceMock = {
      currentLang$: langSubject.asObservable(),
      get currentLang(): Language {
        return mockCurrentLang;
      },
      setLanguage: setLanguageSpy,
      translate: translateSpy,
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent],
      providers: [{ provide: TranslationService, useValue: translationServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the globe icon', () => {
    const globe = fixture.nativeElement.querySelector('.lang-selector__globe') as HTMLElement;
    expect(globe.textContent).toBe('🌐');
  });

  it('should render the current language code in uppercase', () => {
    const code = fixture.nativeElement.querySelector('.lang-selector__code') as HTMLElement;
    expect(code.textContent?.trim()).toBe('EN');
  });

  it('toggle() should call setLanguage with "es" when current lang is "en"', () => {
    component.toggle();

    expect(setLanguageSpy).toHaveBeenCalledWith('es');
  });

  it('toggle() should call setLanguage with "en" when current lang is "es"', () => {
    mockCurrentLang = 'es';

    component.toggle();

    expect(setLanguageSpy).toHaveBeenCalledWith('en');
  });

  it('should update the displayed language after toggle', () => {
    component.toggle();
    fixture.detectChanges();

    const code = fixture.nativeElement.querySelector('.lang-selector__code') as HTMLElement;
    expect(code.textContent?.trim()).toBe('ES');
  });
});
