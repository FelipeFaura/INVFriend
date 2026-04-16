import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { TranslatePipe } from './translate.pipe';
import { TranslationService } from '../../application/services/translation.service';
import { ITranslationDictionary, Language } from '../../domain/i18n/language.types';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let cdrMock: { markForCheck: jasmine.Spy };
  let langSubject: Subject<Language>;
  let mockCurrentLang: Language;
  let translateSpy: jasmine.Spy;

  beforeEach(() => {
    langSubject = new Subject<Language>();
    mockCurrentLang = 'en';
    translateSpy = jasmine.createSpy('translate').and.returnValue('Sign In');

    const translationServiceMock = {
      currentLang$: langSubject.asObservable(),
      get currentLang(): Language {
        return mockCurrentLang;
      },
      setLanguage: jasmine.createSpy('setLanguage'),
      translate: translateSpy,
    } as unknown as TranslationService;

    cdrMock = { markForCheck: jasmine.createSpy('markForCheck') };

    pipe = new TranslatePipe(
      translationServiceMock,
      cdrMock as unknown as ChangeDetectorRef,
    );
  });

  afterEach(() => {
    pipe.ngOnDestroy();
  });

  it('should return "Sign In" when lang is "en"', () => {
    translateSpy.and.returnValue('Sign In');

    const result: string = pipe.transform('loginSignIn' as keyof ITranslationDictionary);

    expect(result).toBe('Sign In');
    expect(translateSpy).toHaveBeenCalledWith('loginSignIn');
  });

  it('should return "Iniciar sesión" when lang is "es"', () => {
    mockCurrentLang = 'es';
    translateSpy.and.returnValue('Iniciar sesión');

    const result: string = pipe.transform('loginSignIn' as keyof ITranslationDictionary);

    expect(result).toBe('Iniciar sesión');
  });

  it('should call markForCheck when language changes to "es"', () => {
    langSubject.next('es');

    expect(cdrMock.markForCheck).toHaveBeenCalledTimes(1);
  });

  it('should return the new language string after language changes', () => {
    mockCurrentLang = 'es';
    translateSpy.and.returnValue('Iniciar sesión');
    langSubject.next('es');

    const result: string = pipe.transform('loginSignIn' as keyof ITranslationDictionary);

    expect(result).toBe('Iniciar sesión');
  });

  it('ngOnDestroy() should unsubscribe — no markForCheck after destroy', () => {
    pipe.ngOnDestroy();
    cdrMock.markForCheck.calls.reset();

    langSubject.next('es');

    expect(cdrMock.markForCheck).not.toHaveBeenCalled();
  });
});
