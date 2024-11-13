import { format, parseISO } from "date-fns";

export const dateUtils = {
  formatTime: (dateTimeStr: string) => {
    return format(parseISO(dateTimeStr), "HH:mm");
  },

  formatDate: (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd, yyyy");
  },

  formatDateTime: (dateTimeStr: string) => {
    return format(parseISO(dateTimeStr), "HH:mm");
  },
};

export default dateUtils;
