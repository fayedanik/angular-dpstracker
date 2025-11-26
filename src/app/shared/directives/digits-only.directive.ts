import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDigitsOnly]',
  standalone: true,
})
export class DigitsOnlyDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Home',
      'End',
    ];
    if (event.ctrlKey || event.metaKey || event.key.startsWith('F')) {
      return;
    }
    if (allowedKeys.includes(event.key)) return;
    if (!/^[0-9]$/.test(event.key)) event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  async onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData: DataTransfer =
      event.clipboardData || (window as any).clipboardData;
    let pastedText = '';
    if (clipboardData) {
      pastedText = clipboardData.getData('text');
    } else if (navigator.clipboard) {
      try {
        pastedText = await navigator.clipboard.readText();
      } catch (err) {
        return;
      }
    } else {
      return;
    }

    const digitsOnly = pastedText.replace(/[^0-9]/g, '');
    if (!digitsOnly) return;
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const newValue =
      input.value.slice(0, start) + digitsOnly + input.value.slice(end);
    const newCursorPoint = start + digitsOnly.length;
    input.value = newValue;
    try {
      input.setSelectionRange(newCursorPoint, newCursorPoint);
    } catch (err) {}
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^0-9]/g, '');
    if (input.value !== cleaned) {
      const pos = input.selectionStart ?? cleaned.length;
      input.value = cleaned;
      const safePos = Math.min(pos, cleaned.length);
      try {
        input.setSelectionRange(safePos, safePos);
      } catch (err) {}
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
