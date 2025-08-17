/*======================================================================================
 * Time Management Utilities
 * Provides reusable functions for handling dates and time ranges
======================================================================================*/

export interface MonthData {
  month: string;
  count: number;
}



//*======================================================================================


 const getMonthsRanges = (): { start: Date; end: Date; monthLabel: string }[] => {
  const ranges: { start: Date; end: Date; monthLabel: string }[] = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, currentDate.getDate());
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // start of the month

    const monthLabel = endDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    ranges.push({ start: startDate, end: endDate, monthLabel });
  }

  return ranges;
 };




//*======================================================================================


const getDateRange = (range: string, now: Date = new Date()) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateRanges: { [key: string]: Date } = {
    today,
    yesterday,
    "2d": new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    "7d": new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    "15d": new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
    "30d": new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    "2m": new Date(new Date(today).setMonth(today.getMonth() - 2)),
    "5m": new Date(new Date(today).setMonth(today.getMonth() - 5)),
    "10m": new Date(new Date(today).setMonth(today.getMonth() - 10)),
    "12m": new Date(new Date(today).setMonth(today.getMonth() - 12)),
    all: new Date(0),
    today_and_yesterday: yesterday,
  };

  return { fromDate: dateRanges[range] || new Date(0), toDate: today };
};



//*======================================================================================


const getStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getEndOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

/**
 * Get start of current week (Sunday) without mutating input.
 */
 const getStartOfWeek = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return getStartOfDay(start);
 };



//*======================================================================================

 const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

/*======================================================================================
 * Export all utilities
======================================================================================*/



export {
  getMonthsRanges,
  getDateRange,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getStartOfMonth,
};
