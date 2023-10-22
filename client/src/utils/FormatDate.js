const moment = require('moment');

export function formatDateTime(date) {
    // Use Moment.js for formatting
    const formatted = moment(date).format('DD/MM/YYYY hh:mm A');
    return formatted;
}