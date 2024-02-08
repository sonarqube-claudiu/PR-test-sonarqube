let intl;

export const setIntl = (i) => {
    intl = i;
}

export const translate = (id) => {
     if(intl) {
        return `${intl.formatMessage({id})}`; //++++++++++++++ (Locale: ${intl.locale})
        // return `(Locale: ${intl.locale})`;
     }
}