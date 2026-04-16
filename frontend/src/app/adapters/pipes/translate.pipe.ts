import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../application/services/translation.service';
import { ITranslationDictionary } from '../../domain/i18n/language.types';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private readonly subscription: Subscription;

  constructor(
    private readonly translationService: TranslationService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.subscription = this.translationService.currentLang$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: keyof ITranslationDictionary): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
