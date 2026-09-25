import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';

export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'color-scheme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly scheme = signal<ColorScheme>(this.initialScheme());
  readonly isDark = computed(() => this.scheme() === 'dark');

  constructor() {
    effect(() => {
      const scheme = this.scheme();
      // styles.scss builds the theme with light-dark(), so this alone switches every token.
      // Set on body because that's where styles.scss declares color-scheme.
      this.document.body.style.colorScheme = scheme;
      localStorage.setItem(STORAGE_KEY, scheme);
    });
  }

  toggle(): void {
    this.scheme.update((scheme) => (scheme === 'dark' ? 'light' : 'dark'));
  }

  private initialScheme(): ColorScheme {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    const prefersDark = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)');
    return prefersDark?.matches ? 'dark' : 'light';
  }
}
