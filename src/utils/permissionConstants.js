/**
 * RBAC Permission Keys Registry
 * Centralized registry of all normalized permission keys used in the application.
 * Use these constants throughout the app instead of raw strings.
 */

const PERMISSION_KEYS = {
  /* Users */
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  ADMIN_READ: "admin_user:read",

  /* Roles */
  ROLE_CREATE: "role:create",
  ROLE_READ: "role:read",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",

  /* Locations */
  LOCATION_CREATE: "location:create",
  LOCATION_READ: "location:read",
  LOCATION_UPDATE: "location:update",
  LOCATION_DELETE: "location:delete",

  /* Permissions */
  PERMISSION_READ_ALL: "permission:read_all",
  PERMISSION_ASSIGN: "permission:assign",

  /* Bookings */
  BOOKING_CREATE: "booking:create",
  BOOKING_READ: "booking:read",
  BOOKING_UPDATE: "booking:update",
  BOOKING_DELETE: "booking:delete",
  BOOKING_READ_ALL: "booking:read_all",
  BOOKING_CALCULATE: "booking:calculate",

  /* Payments */
  PAYMENT_CREATE: "payment:create",
  PAYMENT_READ: "payment:read",
  PAYMENT_UPDATE: "payment:update",
  PAYMENT_DELETE: "payment:delete",
  PAYMENT_READ_ALL: "payment:read_all",
  PAYMENT_RETRY: "booking_payment:retry",

  /* Subscriptions */
  SUBSCRIPTION_CREATE: "subscription:create",
  SUBSCRIPTION_READ: "subscription:read",
  SUBSCRIPTION_UPDATE: "subscription:update",
  SUBSCRIPTION_DELETE: "subscription:delete",
  SUBSCRIPTION_READ_ALL: "subscription:read_all",
  SUBSCRIPTION_RESUME: "subscription:resume",
  SUBSCRIPTION_UPDATE_PAYMENT: "subscription_payment_method:update",
  SUBSCRIPTION_UPDATE_FUTURE: "subscription_future_booking:update",

  /* Services */
  SERVICE_CREATE: "service:create",
  SERVICE_READ: "service:read",
  SERVICE_UPDATE: "service:update",
  SERVICE_DELETE: "service:delete",

  /* Pricing Rules */
  PRICING_RULE_CREATE: "pricing_rule:create",
  PRICING_RULE_READ: "pricing_rule:read",
  PRICING_RULE_UPDATE: "pricing_rule:update",
  PRICING_RULE_DELETE: "pricing_rule:delete",

  /* Analytics */
  ANALYTICS_READ: "analytics:read",

  /* Settings */
  VIEW_APP_PRICE_SETTINGS: "app_price_settings:read",
  VIEW_APP_BOOKING_CALENDAR_SLOT_SETTINGS: "app_booking_calendar_slot_settings:read",
  VIEW_APP_CRON_SETTINGS: "app_cron_settings:read",
  UPDATE_APP_PRICE_SETTINGS: "app_price_settings:update",
  UPDATE_APP_BOOKING_CALENDAR_SLOT_SETTINGS: "app_booking_calendar_slot_settings:update",
  UPDATE_APP_CRON_SETTINGS: "app_cron_settings:update",

  /* Promo Codes / Offers */
  PROMO_CODE_VALIDATE: "promo_code:validate",
  OFFER_READ_ALL: "offer:read_all",
  OFFER_READ: "offer:read",
  OFFER_CREATE: "offer:create",
  OFFER_UPDATE: "offer:update",
  DASHBOARD_READ: "dashboard:read",
  /* Extra Services */
  EXTRA_SERVICE_READ: "extra_service:read",
  EXTRA_SERVICE_CREATE: "extra_service:create",
  EXTRA_SERVICE_UPDATE: "extra_service:update",
  EXTRA_SERVICE_DELETE: "extra_service:delete",
  /* Promo Codes */
  PROMO_CODE_READ: "promo_code:read",
  PROMO_CODE_CREATE: "promo_code:create",
  PROMO_CODE_UPDATE: "promo_code:update",
  PROMO_CODE_DELETE: "promo_code:delete",
  /* Reviews */
  REVIEW_READ: "review:read",
  REVIEW_DELETE: "review:delete",
};

/**
 * The super admin role name — bypasses all permission checks.
 */
const SUPER_ADMIN_ROLE = "super_admin";

export { PERMISSION_KEYS, SUPER_ADMIN_ROLE };
