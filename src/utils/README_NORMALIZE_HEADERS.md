# Header Normalization System

## Overview

Generic utility for converting flattened API response keys into human-friendly column headers for CSV and PDF exports.

## Features

- Removes array indices: `[0]`, `[1]`, etc.
- Converts camelCase and snake_case to readable labels
- Context-aware transformations using configurable mapping
- Zero breaking changes to existing export logic
- O(n) performance over headers
- Translation-compatible

## Usage

### Automatic Integration

The normalization layer is automatically applied in both `exportToCsv` and `exportToPdf` functions. No manual intervention required.

### Manual Usage

```javascript
import { normalizeHeaderKey } from "@/utils/normalizeHeaders";

const readable = normalizeHeaderKey("userRolePermission[0].role.name");
// Result: "Role Name"
```

## Transformation Examples

| Raw Key                            | Normalized Header  |
| ---------------------------------- | ------------------ |
| `userRolePermission[0].role.name`  | Role Name          |
| `userRolePermission[0].createdAt`  | Role Assigned At   |
| `permissions[2].id`                | Permission Id      |
| `bookingServices[1].service.price` | Service Price      |
| `originalData.permissions[0].id`   | Permission Id      |
| `storage_preference`               | Storage Preference |
| `isActive`                         | Is Active          |
| `userName`                         | User Name          |

## Context Mapping

The `CONTEXT_MAP` in `normalizeHeaders.js` defines context-aware transformations:

```javascript
const CONTEXT_MAP = {
  userRolePermission: "Role",
  bookingServices: "Service",
  originalData: "", // Removes this from output
  permissions: "Permission",
  createdAt: "Assigned At",
  updatedAt: "Updated At",
};
```

### Adding New Context Rules

Edit the `CONTEXT_MAP` object to add domain-specific transformations:

```javascript
const CONTEXT_MAP = {
  // Existing rules...
  customerOrders: "Order",
  invoiceItems: "Item",
  // Add more as needed
};
```

## Architecture

### Flow

1. Export function receives flattened data
2. `normalizeAndTranslateHeaders` normalizes keys
3. Normalized keys are translated via existing translation system
4. Headers are used in CSV/PDF generation
5. Original data structure remains unchanged

### Key Functions

#### `normalizeHeaderKey(key)`

Converts a single flattened key to readable label.

**Parameters:**

- `key` (string): Flattened API key

**Returns:**

- (string): Human-readable label

#### `normalizeAndTranslateHeaders(keys, language, translateFn)`

Normalizes and translates headers in one pass.

**Parameters:**

- `keys` (array): Array of original keys
- `language` (string): Target language code
- `translateFn` (function): Translation function

**Returns:**

- (object): `{ originalKey: "Translated Label" }`

## Performance

- O(n) complexity where n = number of headers
- No deep cloning or data mutation
- Minimal memory overhead
- Cached translations via existing system

## Testing

Run test cases to verify transformations:

```javascript
import { runTests } from "@/utils/normalizeHeaders.test";

const results = runTests();
console.log(results); // { passed, failed, total }
```

## Compatibility

- Works with existing translation system
- No changes to data structure
- No changes to CSV escaping logic
- No changes to PDF table layout
- Backward compatible with all exports

## Maintenance

- Add new context rules to `CONTEXT_MAP` as needed
- Keep transformations generic and domain-agnostic
- Test with real API responses
- Update test cases when adding new rules
