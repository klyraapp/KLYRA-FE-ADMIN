/**
 * Permission Normalization Utility
 * Converts backend permission strings to standardized resource:action format
 *
 * Examples:
 *   create_user       → user:create
 *   view_booking      → booking:read
 *   UPDATE_SUBSCRIPTION_PAYMENT_METHOD → subscription:update_payment_method
 */

/**
 * Explicit overrides for permissions that cannot be derived algorithmically.
 * Keys are lowercase backend permission names, values are normalized format.
 */
const PERMISSION_OVERRIDES = {
  assign_permissions: "permission:assign",
  view_users: "user:read",
  add_users: "user:create",
  edit_users: "user:update",
  delete_users: "user:delete",
  view_roles: "role:read",
  add_roles: "role:create",
  edit_roles: "role:update",
  delete_roles: "role:delete",
  view_locations: "location:read",
  add_locations: "location:create",
  edit_locations: "location:update",
  delete_locations: "location:delete",
};

/**
 * Maps action verbs found in permission strings to standardized CRUD actions.
 */
const ACTION_ALIASES = {
  view: "read",
  add: "create",
  edit: "update",
  remove: "delete",
  get: "read",
  list: "read",
  fetch: "read",
};

/**
 * Known action verbs used to split permission strings into action + resource.
 * Order matters — longer/more-specific prefixes first.
 */
const ACTION_PREFIXES = [
  "create",
  "update",
  "delete",
  "remove",
  "view",
  "add",
  "edit",
  "get",
  "list",
  "fetch",
  "assign",
  "manage",
  "export",
  "import",
  "approve",
  "reject",
];

/**
 * Normalizes a single backend permission string to `resource:action` format.
 * 
 * @param {string} raw - The raw backend permission string (e.g., "view_all_bookings").
 * @returns {string} Normalized permission in `resource:action` format (e.g., "booking:read_all").
 */
const normalizePermission = (raw = "") => {
  if (!raw || typeof raw !== "string") {
    return "";
  }

  const lower = raw.toLowerCase().trim();

  // 1. Check explicit overrides
  if (PERMISSION_OVERRIDES[lower]) {
    return PERMISSION_OVERRIDES[lower];
  }

  // 2. Extract action and resource
  const parts = lower.split("_");
  
  if (parts.length < 2) {
    return `${lower}:access`;
  }

  let action = "";
  let resource = "";

  // Handle "view_all_*" specifically
  if (parts[0] === "view" && parts[1] === "all") {
    action = "read_all";
    resource = parts.slice(2).join("_");
  } else {
    // Check if first word is a known action prefix
    const matchedPrefix = ACTION_PREFIXES.find(prefix => parts[0] === prefix);
    
    if (matchedPrefix) {
      action = ACTION_ALIASES[matchedPrefix] || matchedPrefix;
      resource = parts.slice(1).join("_");
    } else {
      // Check if last word is a known action prefix
      const matchedSuffix = ACTION_PREFIXES.find(prefix => parts[parts.length - 1] === prefix);
      if (matchedSuffix) {
        action = ACTION_ALIASES[matchedSuffix] || matchedSuffix;
        resource = parts.slice(0, -1).join("_");
      } else {
        // Fallback
        action = parts[0];
        resource = parts.slice(1).join("_");
      }
    }
  }

  // 3. Singularize resource names for consistency (e.g., "bookings" -> "booking")
  const pluralToSingular = {
    bookings: "booking",
    subscriptions: "subscription",
    offers: "offer",
    permissions: "permission",
    roles: "role",
    users: "user",
    app_settings: "setting", // Map app_settings to setting
    pricing_rules: "pricing_rule",
    extra_services: "extra_service",
    reviews: "review",
    payments: "payment",
    transactions: "payment", // Map transactions to payment
  };

  if (pluralToSingular[resource]) {
    resource = pluralToSingular[resource];
  }

  // If resource is "all_X", strip the "all_" prefix as we handle "all" via action
  if (resource.startsWith("all_")) {
    const stripped = resource.replace("all_", "");
    if (pluralToSingular[stripped]) {
      resource = pluralToSingular[stripped];
    } else {
      resource = stripped;
    }
    // If it was view_all_bookings, it's already read_all
    // If it was view_all_subscriptions, it's already read_all
    // But if it was just all_bookings:read, we upgrade it to read_all
    if (action === "read") {
      action = "read_all";
    }
  }

  return `${resource}:${action}`;
};

/**
 * Normalizes an array of backend permission objects into resource:action format.
 *
 * @param {Array<{id: number, name: string}>} permissions - Raw permission objects from backend.
 * @returns {Array<{id: number, raw: string, normalized: string, resource: string, action: string}>}
 */
const normalizePermissions = (permissions = []) => {
  if (!Array.isArray(permissions)) {
    return [];
  }

  return permissions
    .filter((perm) => perm?.name)
    .map((perm) => {
      const normalized = normalizePermission(perm.name);
      const [resource = "", action = ""] = normalized.split(":");

      return {
        id: perm.id,
        raw: perm.name,
        normalized,
        resource,
        action,
      };
    });
};

/**
 * Creates a Set of normalized permission strings for fast lookups.
 *
 * @param {Array<{id: number, name: string}>} permissions - Raw permission objects.
 * @returns {Set<string>} Set of normalized permission strings.
 */
const createPermissionSet = (permissions = []) => {
  const normalized = normalizePermissions(permissions);
  return new Set(normalized.map((p) => p.normalized));
};

export {
  normalizePermission,
  normalizePermissions,
  createPermissionSet,
  PERMISSION_OVERRIDES,
};
