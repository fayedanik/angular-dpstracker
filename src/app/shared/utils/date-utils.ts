export function normalizeDateToUTC(date: Date): Date {
  if (!date) return date;
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}
export function getInstallmentDates(
  stDate: string | Date,
  endDate: string | Date
) {
  let years: number[] = [];
  let dates: Date[] = [];
  if (!stDate || !endDate) return { years, dates };
  if (typeof stDate == 'string') stDate = new Date(stDate);
  if (typeof endDate == 'string') endDate = new Date(endDate);
  for (let year = stDate.getFullYear(); year <= endDate.getFullYear(); year++) {
    for (let month = 0; month < 12; month++) {
      const currDate = new Date(year, month, stDate.getDate());
      if (stDate <= currDate && currDate < endDate) {
        dates.push(currDate);
      }
    }
    years.push(year);
  }
  return { years, dates };
}
export const months = [
  { en: 'January', bn: 'জানুয়ারি' },
  { en: 'February', bn: 'ফেব্রুয়ারি' },
  { en: 'March', bn: 'মার্চ' },
  { en: 'April', bn: 'এপ্রিল' },
  { en: 'May', bn: 'মে' },
  { en: 'June', bn: 'জুন' },
  { en: 'July', bn: 'জুলাই' },
  { en: 'August', bn: 'আগস্ট' },
  { en: 'September', bn: 'সেপ্টেম্বর' },
  { en: 'October', bn: 'অক্টোবর' },
  { en: 'November', bn: 'নভেম্বর' },
  { en: 'December', bn: 'ডিসেম্বর' },
];
