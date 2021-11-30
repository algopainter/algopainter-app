import { defineRule, configure } from 'vee-validate';
import { required, min_value as minValue } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import enUS from '@vee-validate/i18n/dist/locale/en.json';

defineRule('required', required);
defineRule('min_value', minValue);

configure({
  generateMessage: localize({
    'en-US': enUS,
  }),
});

setLocale('en-US');
