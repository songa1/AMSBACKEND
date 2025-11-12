// helpers/dateHelpers.ts

/**
 * Subtracts a number of days from a date
 */
export function subtractDays(date: Date = new Date(), days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

/**
 * Subtracts a number of months from a date
 */
export function subtractMonths(date: Date = new Date(), months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

/**
 * Subtracts a number of weeks from a date
 */
export function subtractWeeks(date: Date = new Date(), weeks: number): Date {
  return subtractDays(date, weeks * 7);
}
