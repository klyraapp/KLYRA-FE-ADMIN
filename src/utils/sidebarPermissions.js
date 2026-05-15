/**
 * Sidebar Permission Config
 * Maps each sidebar route to the minimum permission(s) needed to display it.
 * If no permission is specified, the route is visible to all authenticated users.
 *
 * NOTE: All view permissions now use the "view_all" convention from the API.
 * The PERMISSION_KEYS._READ constants already point to "resource:read_all".
 */

import { PERMISSION_KEYS } from "./permissionConstants";

/**
 * Route-to-permission mapping.
 * Each key is a sidebar route path, value is the normalized permission required.
 * `null` means no permission required (visible to all authenticated users).
 */
const SIDEBAR_PERMISSIONS = {
  "/": PERMISSION_KEYS.DASHBOARD_READ,
  "/customers": PERMISSION_KEYS.USER_READ,
  "/booking": PERMISSION_KEYS.BOOKING_READ,
  "/subscriptions": PERMISSION_KEYS.SUBSCRIPTION_READ,
  "/services-pricing": PERMISSION_KEYS.SERVICE_READ,
  "/pricing-rules": PERMISSION_KEYS.PRICING_RULE_READ,
  "/additional-services": PERMISSION_KEYS.EXTRA_SERVICE_READ,
  "/analytics": PERMISSION_KEYS.ANALYTICS_READ,
  "/discount-code": PERMISSION_KEYS.PROMO_CODE_READ,
  "/special-offers": PERMISSION_KEYS.OFFER_READ,
  "/payments": PERMISSION_KEYS.PAYMENT_READ,
  "/settings": null,
  "/roles": PERMISSION_KEYS.ROLE_READ,
  "/user-roles": PERMISSION_KEYS.USER_READ,
};

export { SIDEBAR_PERMISSIONS };
