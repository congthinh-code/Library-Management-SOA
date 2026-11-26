import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="shade" (click)="cancelled.emit()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h3>{{ title() }}</h3>
          <p>{{ message() }}</p>
          <div class="actions">
            <button type="button" class="btn-cancel" (click)="cancelled.emit()">Hủy bỏ</button>
            <button type="button" class="btn-danger" (click)="confirmed.emit()">{{ confirmLabel() }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .shade { position: fixed; inset: 0; background: #10243b80; display: grid; place-items: center; padding: 16px; z-index: 1100; }
    .dialog { background: #fff; border-radius: 14px; padding: 24px; width: min(420px, 100%); box-shadow: 0 20px 50px #10243b30; }
    h3 { color: #17365d; margin: 0 0 10px; font-size: 19px; }
    p { color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 20px; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; }
    .btn-cancel { background: #eef3f8; color: #34516f; border: none; border-radius: 8px; padding: 9px 16px; font-weight: 600; }
    .btn-danger { background: #dc2626; color: #fff; border: none; border-radius: 8px; padding: 9px 16px; font-weight: 600; }
  `],
})
export class ConfirmDialog {
  open = input(false);
  title = input('Xác nhận xóa');
  message = input('Bạn có chắc chắn muốn thực hiện thao tác này?');
  confirmLabel = input('Xác nhận');

  confirmed = output<void>();
  cancelled = output<void>();
}

