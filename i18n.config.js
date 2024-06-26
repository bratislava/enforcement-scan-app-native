import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import sk from './translations/sk.json'
import { environment } from './environment'

const resources = {
  sk: {
    translation: sk,
  },
}

/**
 *  Migration guides suggest to polyfill Intl using intl-pluralrules.
 *  https://www.i18next.com/misc/migration-guide#v20.x.x-to-v21.0.0
 *
 *  It's installed and imported in main layout, but it seems not to work, as mentioned here: https://github.com/i18next/react-i18next/issues/1495#issuecomment-1113990587
 *  So we use v3 for now. If we get the polyfill to work, compatibilityJSON mode should be removed.
 */
i18n
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: 'sk',
    debug: environment.deployment === 'development',
  })

export const t = i18n.t

export default i18n
