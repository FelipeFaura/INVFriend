import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { Language } from '../../domain/i18n/language.types';
import { EN } from '../../domain/i18n/translations.en';
import { ES } from '../../domain/i18n/translations.es';

describe('TranslationService', () => {
  let service: TranslationService;
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;

  function createService(): void {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  }

  beforeEach(() => {
    getItemSpy = spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    setItemSpy = spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('default language', () => {
    it('should default to "en" when localStorage is empty', () => {
      // Arrange
      getItemSpy.and.returnValue(null);

      // Act
      createService();

      // Assert
      expect(service.currentLang).toBe('en');
    });

    it('should default to "en" when localStorage contains an invalid value', () => {
      // Arrange
      getItemSpy.and.returnValue('fr');

      // Act
      createService();

      // Assert
      expect(service.currentLang).toBe('en');
    });
  });

  describe('loadPersistedLang', () => {
    it('should load "en" from localStorage', () => {
      // Arrange
      getItemSpy.and.returnValue('en');

      // Act
      createService();

      // Assert
      expect(service.currentLang).toBe('en' as Language);
    });

    it('should load "es" from localStorage', () => {
      // Arrange
      getItemSpy.and.returnValue('es');

      // Act
      createService();

      // Assert
      expect(service.currentLang).toBe('es' as Language);
    });
  });

  describe('setLanguage', () => {
    beforeEach(() => {
      createService();
    });

    it('should change the current language', () => {
      // Arrange — service defaults to "en"

      // Act
      service.setLanguage('es');

      // Assert
      expect(service.currentLang).toBe('es');
    });

    it('should persist the language to localStorage', () => {
      // Act
      service.setLanguage('es');

      // Assert
      expect(setItemSpy).toHaveBeenCalledWith('invfriend_lang', 'es');
    });

    it('should persist "en" when switching back', () => {
      // Arrange
      service.setLanguage('es');

      // Act
      service.setLanguage('en');

      // Assert
      expect(setItemSpy).toHaveBeenCalledWith('invfriend_lang', 'en');
    });
  });

  describe('currentLang$', () => {
    beforeEach(() => {
      createService();
    });

    it('should emit the initial language', (done) => {
      // Act & Assert
      service.currentLang$.subscribe((lang) => {
        expect(lang).toBe('en');
        done();
      });
    });

    it('should emit the new language after setLanguage', (done) => {
      // Arrange
      const emitted: Language[] = [];
      const subscription = service.currentLang$.subscribe((lang) => emitted.push(lang));

      // Act
      service.setLanguage('es');
      subscription.unsubscribe();

      // Assert
      expect(emitted).toEqual(['en', 'es']);
      done();
    });
  });

  describe('translate', () => {
    it('should return English string when lang is "en"', () => {
      // Arrange
      getItemSpy.and.returnValue('en');
      createService();

      // Act
      const result = service.translate('loginWelcomeBack');

      // Assert
      expect(result).toBe(EN.loginWelcomeBack);
    });

    it('should return Spanish string when lang is "es"', () => {
      // Arrange
      getItemSpy.and.returnValue('es');
      createService();

      // Act
      const result = service.translate('loginWelcomeBack');

      // Assert
      expect(result).toBe(ES.loginWelcomeBack);
    });

    it('should return the correct translation after language switch', () => {
      // Arrange
      createService();

      // Act
      service.setLanguage('es');
      const result = service.translate('navLogout');

      // Assert
      expect(result).toBe(ES.navLogout);
    });

    it('should return English translation for nav keys', () => {
      // Arrange
      createService();

      // Act & Assert
      expect(service.translate('navDashboard')).toBe(EN.navDashboard);
      expect(service.translate('navGroups')).toBe(EN.navGroups);
      expect(service.translate('navProfile')).toBe(EN.navProfile);
      expect(service.translate('navLogout')).toBe(EN.navLogout);
    });

    it('should return Spanish translation for nav keys', () => {
      // Arrange
      getItemSpy.and.returnValue('es');
      createService();

      // Act & Assert
      expect(service.translate('navDashboard')).toBe(ES.navDashboard);
      expect(service.translate('navGroups')).toBe(ES.navGroups);
      expect(service.translate('navProfile')).toBe(ES.navProfile);
      expect(service.translate('navLogout')).toBe(ES.navLogout);
    });

    it('should use langSelectorLabel from each dictionary', () => {
      // Arrange
      createService();

      // Act
      const en = service.translate('langSelectorLabel');
      service.setLanguage('es');
      const es = service.translate('langSelectorLabel');

      // Assert
      expect(en).toBe(EN.langSelectorLabel);
      expect(es).toBe(ES.langSelectorLabel);
    });
  });
});
