import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../application/services/translation.service';
import { Language } from '../../../domain/i18n/language.types';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <button
      type="button"
      class="lang-selector"
      (click)="toggle()"
      [attr.aria-label]="'Switch language, current: ' + (translationService.currentLang | uppercase)"
    >
      <span class="lang-selector__globe" aria-hidden="true">🌐</span>
      <span class="lang-selector__code">{{ translationService.currentLang | uppercase }}</span>
      <span class="lang-selector__arrow" aria-hidden="true">▾</span>
    </button>
  `,
  styles: [`
    .lang-selector {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 20px;
      padding: 4px 10px;
      color: inherit;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.6);
      }

      &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }
    }

    .lang-selector__globe { font-size: 0.95rem; }
    .lang-selector__code { font-weight: 600; letter-spacing: 0.03em; }
    .lang-selector__arrow { font-size: 0.65rem; opacity: 0.7; }
  `],
})
export class LanguageSelectorComponent {
  constructor(readonly translationService: TranslationService) {}

  toggle(): void {
    const next: Language = this.translationService.currentLang === 'en' ? 'es' : 'en';
    this.translationService.setLanguage(next);
  }
}
