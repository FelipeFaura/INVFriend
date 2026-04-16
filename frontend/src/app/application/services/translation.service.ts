import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Language, ITranslationDictionary } from '../../domain/i18n/language.types';
import { EN } from '../../domain/i18n/translations.en';
import { ES } from '../../domain/i18n/translations.es';

const STORAGE_KEY = 'invfriend_lang';
const DICTIONARIES: Record<Language, ITranslationDictionary> = { en: EN, es: ES };

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly lang$ = new BehaviorSubject<Language>(this.loadPersistedLang());

  readonly currentLang$: Observable<Language> = this.lang$.asObservable();

  get currentLang(): Language {
    return this.lang$.getValue();
  }

  setLanguage(lang: Language): void {
    localStorage.setItem(STORAGE_KEY, lang);
    this.lang$.next(lang);
  }

  translate(key: keyof ITranslationDictionary): string {
    return DICTIONARIES[this.currentLang][key];
  }

  private loadPersistedLang(): Language {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'es' ? stored : 'en';
  }
}
