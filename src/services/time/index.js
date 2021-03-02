import * as moment from 'moment';

const time = {
  toYear: (timestamp) => {
    return moment.unix(timestamp).year();
  },
  current: (format = 'DD.MM.YYYY') => {
    return moment().format(format);
  },
  to: (timestamp, format = 'DD.MM.YYYY') => {
    return moment.unix(timestamp).format(format);
  },
  toChat: (timestamp) => {
    return moment(timestamp, 'X').calendar(null, {
      sameDay: 'HH:mm',
      lastDay: '[Вчера], HH:mm',
      sameElse: 'DD.MM.YYYY'
    })
  },
};

export default time;
