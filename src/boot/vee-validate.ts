import { defineRule, configure } from 'vee-validate';
import { required } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import enUS from '@vee-validate/i18n/dist/locale/en.json';

defineRule('required', required);

configure({
  generateMessage: localize({
    'en-US': enUS,
  }),
});

setLocale('en-US');
