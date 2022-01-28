import { reactive } from 'vue';
import moment from 'moment';

export const now = reactive({ value: moment() });

setInterval(() => {
  now.value = moment();
}, 1000);
