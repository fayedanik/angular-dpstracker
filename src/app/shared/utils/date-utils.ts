export function normalizeDateToUTC(date: Date): Date {
  console.log(date);
  if (!date) return date;
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
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
