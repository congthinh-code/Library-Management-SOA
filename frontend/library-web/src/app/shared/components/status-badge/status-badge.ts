import { Component, input } from '@angular/core';
import { BookCopyStatus } from '../../../core/models/catalog.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="statusClass()">
      <span class="dot"></span>
      {{ label() }}
    </span>
  `,
  styles: [`
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
    .avail { background: #e8f6ef; color: #168052; }
    .loan { background: #eff6ff; color: #2563eb; }
    .hold { background: #fff4e5; color: #a05b00; }
    .bad { background: #fff0ef; color: #c0392b; }
  `],
})
export class StatusBadge {
  status = input.required<BookCopyStatus | string>();

  label(): string {
    switch (this.status()) {
      case 'AVAILABLE': return 'Sẵn sàng';
      case 'ON_LOAN': return 'Đang mượn';
      case 'ON_HOLD': return 'Đang giữ';
      case 'DAMAGED': return 'Hư hỏng';
      case 'LOST': return 'Mất';
      default: return this.status();
    }
  }

  statusClass(): string {
    switch (this.status()) {
      case 'AVAILABLE': return 'avail';
      case 'ON_LOAN': return 'loan';
      case 'ON_HOLD': return 'hold';
      case 'DAMAGED':
      case 'LOST': return 'bad';
      default: return 'hold';
    }
  }
}

