import { useTranslation as useTranslationI18n } from 'react-i18next'

/**
 * Simplified version of react-i18next useTranslation hook that helps to use it with keyPrefix.
 * Support for multiple namespaces has to be implemented if needed.
 * @param keyPrefix
 */
export const useTranslation = (keyPrefix?: string) => {
  const { t } = useTranslationI18n('translation', { keyPrefix })

  return t
}
