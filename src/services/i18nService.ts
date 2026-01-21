import ptBR from '../i18n/locales/pt-BR.json';
import enUS from '../i18n/locales/en-US.json';

type Locale = 'pt-BR' | 'en-US';
type Translations = typeof ptBR;

class I18nService {
  private currentLocale: Locale = (localStorage.getItem('ploutos_locale') as Locale) || 'pt-BR';
  private translations: Record<Locale, Translations> = {
    'pt-BR': ptBR,
    'en-US': enUS
  };

  public t(key: string): string {
    const keys = key.split('.');
    let result: any = this.translations[this.currentLocale];

    for (const k of keys) {
      if (result[k]) {
        result = result[k];
      } else {
        return key; // Retorna a chave se não encontrar a tradução
      }
    }

    return result as string;
  }

  public setLocale(locale: Locale): void {
    this.currentLocale = locale;
    localStorage.setItem('ploutos_locale', locale);
    window.location.reload(); // Recarrega para aplicar traduções globalmente
  }

  public getLocale(): Locale {
    return this.currentLocale;
  }
}

export const i18n = new I18nService();
