/**
 * Booking Constants
 * Defines status enums and transition rules
 */

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const ALLOWED_STATUS_TRANSITIONS = {
  [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  [BookingStatus.CONFIRMED]: [
    BookingStatus.IN_PROGRESS,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.IN_PROGRESS]: [
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: [],
};

export const SubscriptionStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  // EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
};

export const ALLOWED_SUBSCRIPTION_STATUS_TRANSITIONS = {
  [SubscriptionStatus.PENDING]: [
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.CANCELLED,
  ],
  [SubscriptionStatus.ACTIVE]: [SubscriptionStatus.CANCELLED],
  [SubscriptionStatus.EXPIRED]: [
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.CANCELLED,
  ],
  [SubscriptionStatus.CANCELLED]: [],
};
