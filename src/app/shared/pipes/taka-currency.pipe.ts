import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taka',
  standalone: true,
})
export class TakaPipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
    showSymbol: boolean = true,
    decimals: number = 2
  ): string {
    if (value === null || value === undefined) return '';

    const num = Number(value);
    if (isNaN(num)) return '';

    const formatted = num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return showSymbol ? `৳${formatted}` : formatted;
  }
}
