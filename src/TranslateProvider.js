import { languages } from 'models/Constants';
import React from 'react'
import { IntlProvider } from 'react-intl'
import { useSelector } from 'react-redux'

export const TranslateProvider = ({children}) => {
    const locale = useSelector(state => state.language.locale);

  return (
    <IntlProvider locale={locale} messages={languages[locale]}>
        {children}
    </IntlProvider>
  )
}
