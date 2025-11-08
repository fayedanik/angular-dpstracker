export function normalizeDateToUTC(date: Date): Date {
  console.log(date);
  if (!date) return date;
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}
