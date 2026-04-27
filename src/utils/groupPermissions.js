/**
 * Permission Grouping Utility
 * Groups normalized permissions by resource (module) for UI rendering
 */

import { normalizePermissions } from "./normalizePermissions";

/**
 * Display-friendly resource names for UI labels.
 * Keys are normalized resource identifiers, values are human-readable labels.
 */
const RESOURCE_DISPLAY_NAMES = {
  user: "Users",
  role: "Roles",
  location: "Locations",
  booking: "Bookings",
  payment: "Payments",
  subscription: "Subscriptions",
  service: "Services",
  pricing_rule: "Pricing Rules",
  discount_code: "Discount Codes",
  special_offer: "Special Offers",
  additional_service: "Additional Services",
  analytics: "Analytics",
  permission: "Permissions",
  app_price_settings: "Price Settings",
  app_booking_calendar_slot_settings: "Calendar Slot Settings",
  app_cron_settings: "Cron Settings",
};

/**
 * Display-friendly action names for UI labels.
 */
const ACTION_DISPLAY_NAMES = {
  create: "Create",
  read: "View",
  read_all: "View",
  update: "Edit",
  delete: "Delete",
  assign: "Assign",
  manage: "Manage",
  cancel: "Cancel",
  calculate: "Calculate",
  export: "Export",
  import: "Import",
  approve: "Approve",
  reject: "Reject",
  access: "Access",
};

/**
 * Converts a resource key to a display-friendly label.
 *
 * @param {string} resource - The normalized resource key (e.g., "pricing_rule").
 * @returns {string} Human-readable label.
 */
const getResourceDisplayName = (resource = "") => {
  if (RESOURCE_DISPLAY_NAMES[resource]) {
    return RESOURCE_DISPLAY_NAMES[resource];
  }

  return resource
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Converts an action key to a display-friendly label.
 *
 * @param {string} action - The normalized action key (e.g., "create").
 * @returns {string} Human-readable label.
 */
const getActionDisplayName = (action = "") => {
  if (ACTION_DISPLAY_NAMES[action]) {
    return ACTION_DISPLAY_NAMES[action];
  }

  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Groups raw backend permissions by resource for grouped UI rendering.
 *
 * @param {Array<{id: number, name: string}>} rawPermissions - Raw permission objects from API.
 * @returns {Array<{resource: string, label: string, permissions: Array<{id, action, actionLabel, raw, normalized}>}>}
 */
const groupPermissionsByResource = (rawPermissions = []) => {
  const normalized = normalizePermissions(rawPermissions);
  const grouped = {};

  normalized.forEach((perm) => {
    const { resource, action } = perm;

    if (!grouped[resource]) {
      grouped[resource] = {
        resource,
        label: getResourceDisplayName(resource),
        permissions: [],
        hasReadAll: false,
      };
    }

    if (action === "read_all") {
      grouped[resource].hasReadAll = true;
    }

    grouped[resource].permissions.push({
      id: perm.id,
      action: action,
      actionLabel: getActionDisplayName(action),
      raw: perm.raw,
      normalized: perm.normalized,
    });
  });

  // Post-process to prioritize "read_all" over "read" and sort actions
  const actionOrder = {
    read_all: 1,
    read: 2,
    create: 3,
    update: 4,
    delete: 5,
    cancel: 6,
    calculate: 7,
  };

  const results = Object.values(grouped).map((group) => {
    // If we have read_all, filter out the simple read permission for this resource
    let filteredPermissions = group.permissions;
    if (group.hasReadAll) {
      filteredPermissions = group.permissions.filter(p => p.action !== "read");
    }

    // Sort permissions by the defined order
    filteredPermissions.sort((a, b) => {
      const orderA = actionOrder[a.action] || 99;
      const orderB = actionOrder[b.action] || 99;
      return orderA - orderB;
    });

    return {
      ...group,
      permissions: filteredPermissions,
    };
  });

  return results.sort((a, b) => a.label.localeCompare(b.label));
};

export {
  groupPermissionsByResource,
  getResourceDisplayName,
  getActionDisplayName,
  RESOURCE_DISPLAY_NAMES,
  ACTION_DISPLAY_NAMES,
};
