/**
 * Test cases for normalizeHeaders utility
 * Demonstrates expected transformations for various key patterns
 */

import { normalizeHeaderKey } from "./normalizeHeaders";

const testCases = [
  {
    input: "userRolePermission[0].role.name",
    expected: "Role Name",
    description: "Nested object with array index and context mapping",
  },
  {
    input: "userRolePermission[0].createdAt",
    expected: "Role Assigned At",
    description: "Context-aware field transformation",
  },
  {
    input: "permissions[2].id",
    expected: "Permission Id",
    description: "Array with context mapping",
  },
  {
    input: "bookingServices[1].service.price",
    expected: "Service Price",
    description: "Nested service object",
  },
  {
    input: "originalData.permissions[0].id",
    expected: "Permission Id",
    description: "Removes empty context (originalData)",
  },
  {
    input: "storage_preference",
    expected: "Storage Preference",
    description: "Snake case conversion",
  },
  {
    input: "isActive",
    expected: "Is Active",
    description: "CamelCase conversion",
  },
  {
    input: "userName",
    expected: "User Name",
    description: "Simple camelCase",
  },
  {
    input: "user_email_address",
    expected: "User Email Address",
    description: "Multi-word snake_case",
  },
  {
    input: "id",
    expected: "Id",
    description: "Single word",
  },
];

const runTests = () => {
  let passed = 0;
  let failed = 0;

  testCases.forEach(({ input, expected, description }) => {
    const result = normalizeHeaderKey(input);
    const success = result === expected;

    if (success) {
      passed++;
    } else {
      failed++;
    }
  });

  return { passed, failed, total: testCases.length };
};

export { runTests, testCases };
