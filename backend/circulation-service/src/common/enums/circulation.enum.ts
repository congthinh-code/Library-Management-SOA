export enum LoanStatus {
  BORROWED = 'BORROWED',
  PARTIALLY_RETURNED = 'PARTIALLY_RETURNED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

export enum LoanDetailStatus {
  BORROWED = 'BORROWED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  LOST = 'LOST',
}

export enum ReturnCondition {
  GOOD = 'GOOD',
  DAMAGED = 'DAMAGED',
  LOST = 'LOST',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum RenewalRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ViolationType {
  OVERDUE = 'OVERDUE',
  DAMAGED_BOOK = 'DAMAGED_BOOK',
  LOST_BOOK = 'LOST_BOOK',
  OTHER = 'OTHER',
}

export enum ViolationStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
  WAIVED = 'WAIVED',
}

export enum FineStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  WAIVED = 'WAIVED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  EWALLET = 'EWALLET',
}