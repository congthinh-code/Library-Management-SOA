import { Component, effect, input, output } from '@angular/core';

@Component({
  selector: 'app-toast-banner',
  standalone: true,
  template: `
    @if (message()) {
      <div class="toast" [class.err]="type() === 'error'">
        <span>{{ message() }}</span>
        <button type="button" (click)="closed.emit()">×</button>
      </div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 20px;
      right: 24px;
      z-index: 1200;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #17365d;
      color: #fff;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 10px 30px #10243b28;
      border-left: 4px solid #0f9d9a;
    }
    .toast.err { background: #991b1b; border-left-color: #fca5a5; }
    button { background: transparent; border: none; color: inherit; font-size: 18px; line-height: 1; padding: 0 2px; }
  `],
})
export class ToastBanner {
  message = input('');
  type = input<'success' | 'error'>('success');
  closed = output<void>();

  constructor() {
    effect((onCleanup) => {
      if (!this.message()) return;
      const timer = setTimeout(() => this.closed.emit(), 3000);
      onCleanup(() => clearTimeout(timer));
    });
  }
}
