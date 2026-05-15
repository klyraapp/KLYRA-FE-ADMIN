/**
 * RBAC Permission Keys Registry
 * Centralized registry of all normalized permission keys used in the application.
 * Use these constants throughout the app instead of raw strings.
 *
 * NOTE: The backend API uses "view_all_*" as the single convention for all
 * read/view permissions. All _READ keys map to "resource:read_all" accordingly.
 * The usePermission hook's fallback logic ensures backwards compatibility
 * (checking "resource:read" will also match "resource:read_all").
 */

const PERMISSION_KEYS = {
  /* Users */
  USER_CREATE: "user:create",
  USER_READ: "user:read_all",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  ADMIN_READ: "admin_user:read_all",

  /* Roles */
  ROLE_CREATE: "role:create",
  ROLE_READ: "role:read_all",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",

  /* Service Locations */
  SERVICE_LOCATION_READ: "service_location:read_all",

  /* Permissions */
  PERMISSION_READ: "permission:read_all",
  PERMISSION_DELETE: "permission:delete",
  PERMISSION_ASSIGN: "permission:assign",

  /* Bookings */
  BOOKING_CREATE: "booking:create",
  BOOKING_READ: "booking:read_all",
  BOOKING_UPDATE: "booking:update",
  BOOKING_DELETE: "booking:delete",
  BOOKING_RETRY: "booking_payment:retry",

  /* Payments */
  PAYMENT_CREATE: "payment:create",
  PAYMENT_READ: "payment:read_all",

  /* Subscriptions */
  SUBSCRIPTION_READ: "subscription:read_all",
  SUBSCRIPTION_UPDATE: "subscription:update",

  /* Services */
  SERVICE_CREATE: "service:create",
  SERVICE_READ: "service:read_all",
  SERVICE_UPDATE: "service:update",
  SERVICE_DELETE: "service:delete",

  /* Extra Services */
  EXTRA_SERVICE_READ: "extra_service:read_all",
  EXTRA_SERVICE_CREATE: "extra_service:create",
  EXTRA_SERVICE_UPDATE: "extra_service:update",
  EXTRA_SERVICE_DELETE: "extra_service:delete",

  /* Pricing Rules */
  PRICING_RULE_CREATE: "pricing_rule:create",
  PRICING_RULE_READ: "pricing_rule:read_all",
  PRICING_RULE_UPDATE: "pricing_rule:update",
  PRICING_RULE_DELETE: "pricing_rule:delete",

  /* Analytics */
  ANALYTICS_READ: "analytics:read_all",

  /* Dashboard */
  DASHBOARD_READ: "dashboard:read_all",

  /* Settings */
  VIEW_APP_PRICE_SETTINGS: "app_price_settings:read_all",
  VIEW_APP_BOOKING_CALENDAR_SLOT_SETTINGS: "app_booking_calendar_slot_settings:read_all",
  VIEW_APP_CRON_SETTINGS: "app_cron_settings:read_all",
  UPDATE_APP_PRICE_SETTINGS: "app_price_settings:update",
  UPDATE_APP_BOOKING_CALENDAR_SLOT_SETTINGS: "app_booking_calendar_slot_settings:update",
  UPDATE_APP_CRON_SETTINGS: "app_cron_settings:update",

  /* Promo / Discount Codes */
  PROMO_CODE_READ: "promo_code:read_all",
  PROMO_CODE_CREATE: "promo_code:create",
  PROMO_CODE_UPDATE: "promo_code:update",
  PROMO_CODE_DELETE: "promo_code:delete",
  PROMO_CODE_VALIDATE: "promo_code:validate",

  /* Special Offers */
  OFFER_READ: "offer:read_all",
  OFFER_CREATE: "offer:create",
  OFFER_UPDATE: "offer:update",
};

/**
 * The super admin role name — bypasses all permission checks.
 */
const SUPER_ADMIN_ROLE = "super_admin";

export { PERMISSION_KEYS, SUPER_ADMIN_ROLE };
