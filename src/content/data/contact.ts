export const contactContent = {
  da: {
    hero: {
      title: 'Kontakt',
      subtitle: 'Vi vil gerne hoere fra dig',
    },
    mainPhone: {
      label: 'Hovednummer',
      value: '+45 3111 6633',
    },
    mainEmail: {
      label: 'Kontakt e-mail',
      value: 'info@sitehub.dk',
    },
    phones: [
      { label: 'Hovedkvarter, Glostrup', value: '+45 5356 7054' },
      { label: 'Salg', value: '+45 5355 7381' },
      { label: 'HR', value: '+45 5355 7645' },
      { label: 'Bogholderi', value: '+45 5355 7192' },
      { label: 'Naerlager, Glostrup', value: '+45 5388 0037' },
      { label: 'SiteHub Fyn', value: '+45 3118 1670' },
      { label: 'Oevrige henvendelser', value: '+45 5355 9456' },
    ],
    form: {
      title: 'Kontakt os',
      subtitle: 'Vil du have os til at kontakte dig?',
      description: 'Udfyld formularen og vi kontakter dig!',
      firstName: 'Fornavn',
      lastName: 'Efternavn',
      email: 'E-mail',
      message: 'Besked',
      submit: 'Send',
    },
  },
  en: {
    hero: {
      title: 'Contact',
      subtitle: 'We would like to hear from you',
    },
    mainPhone: {
      label: 'Main telephone number',
      value: '+45 3111 6633',
    },
    mainEmail: {
      label: 'Main contact email',
      value: 'info@sitehub.dk',
    },
    phones: [
      { label: 'Head office, Glostrup', value: '+45 5356 7054' },
      { label: 'Sales', value: '+45 5355 7381' },
      { label: 'HR', value: '+45 5355 7645' },
      { label: 'Accounting', value: '+45 5355 7192' },
      { label: 'Warehouse Hub, Glostrup', value: '+45 5388 0037' },
      { label: 'SiteHub Funen', value: '+45 3118 1670' },
      { label: 'Other functions', value: '+45 5355 9456' },
    ],
    form: {
      title: 'Contact us',
      subtitle: 'Would you like us to contact you?',
      description: 'Fill the form and we will get in touch!',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      message: 'Your message',
      submit: 'Send',
    },
  },
  nn: {
    hero: {
      title: 'Kontakt oss',
      subtitle: 'Vi vil gjerne hoere fraa deg',
    },
    mainPhone: {
      label: 'Hovudnummer',
      value: '+45 3111 6633',
    },
    mainEmail: {
      label: 'Kontakt e-post',
      value: 'info@sitehub.dk',
    },
    phones: [
      { label: 'Hovudkontor, Glostrup', value: '+45 5356 7054' },
      { label: 'Sal', value: '+45 5355 7381' },
      { label: 'HR', value: '+45 5355 7645' },
      { label: 'Rekneskap', value: '+45 5355 7192' },
      { label: 'Naerlager, Glostrup', value: '+45 5388 0037' },
      { label: 'SiteHub Fyn', value: '+45 3118 1670' },
      { label: 'Andre henvendingar', value: '+45 5355 9456' },
    ],
    form: {
      title: 'Kontakt oss',
      subtitle: 'Vil du at vi kontaktar deg?',
      description: 'Fyll ut skjemaet og vi kontaktar deg!',
      firstName: 'Fornamn',
      lastName: 'Etternamn',
      email: 'E-post',
      message: 'Melding',
      submit: 'Send',
    },
  },
  sv: {
    hero: {
      title: 'Kontakta oss',
      subtitle: 'Vi vill gaerna hoera fraan dig',
    },
    mainPhone: {
      label: 'Huvudnummer',
      value: '+45 3111 6633',
    },
    mainEmail: {
      label: 'Kontakt e-post',
      value: 'info@sitehub.dk',
    },
    phones: [
      { label: 'Huvudkontor, Glostrup', value: '+45 5356 7054' },
      { label: 'Foersaeljning', value: '+45 5355 7381' },
      { label: 'HR', value: '+45 5355 7645' },
      { label: 'Bokfoering', value: '+45 5355 7192' },
      { label: 'Naerlager, Glostrup', value: '+45 5388 0037' },
      { label: 'SiteHub Fyn', value: '+45 3118 1670' },
      { label: 'Oevriga aerenden', value: '+45 5355 9456' },
    ],
    form: {
      title: 'Kontakta oss',
      subtitle: 'Vill du att vi kontaktar dig?',
      description: 'Fyll i formulaeret saa kontaktar vi dig!',
      firstName: 'Foernamn',
      lastName: 'Efternamn',
      email: 'E-post',
      message: 'Meddelande',
      submit: 'Skicka',
    },
  },
  nl: {
    hero: {
      title: 'Contact',
      subtitle: 'Wij horen graag van u',
    },
    mainPhone: {
      label: 'Hoofdnummer',
      value: '+45 3111 6633',
    },
    mainEmail: {
      label: 'Contact e-mail',
      value: 'info@sitehub.dk',
    },
    phones: [
      { label: 'Hoofdkantoor, Glostrup', value: '+45 5356 7054' },
      { label: 'Verkoop', value: '+45 5355 7381' },
      { label: 'HR', value: '+45 5355 7645' },
      { label: 'Boekhouding', value: '+45 5355 7192' },
      { label: 'Magazijn, Glostrup', value: '+45 5388 0037' },
      { label: 'SiteHub Funen', value: '+45 3118 1670' },
      { label: 'Overige vragen', value: '+45 5355 9456' },
    ],
    form: {
      title: 'Neem contact op',
      subtitle: 'Wilt u dat wij contact met u opnemen?',
      description: 'Vul het formulier in en wij nemen contact met u op!',
      firstName: 'Voornaam',
      lastName: 'Achternaam',
      email: 'E-mail',
      message: 'Bericht',
      submit: 'Verzenden',
    },
  },
} as const;

export type ContactContent = (typeof contactContent)[keyof typeof contactContent];
