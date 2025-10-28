type Value = string | number | boolean | Date | null | undefined;

/**
 * Escapes values for use in Cloudflare Analytics Engine SQL queries
 * Based on https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/
 */
export function escapeSql(val: Value): string {
  if (val === null || val === undefined) {
    return "NULL";
  }

  if (typeof val === "boolean") {
    return val ? "true" : "false"; // Analytics Engine supports true/false literals
  }

  if (typeof val === "number") {
    if (!Number.isFinite(val)) {
      throw new Error("Invalid number value for SQL: must be finite");
    }
    return val.toString();
  }

  if (val instanceof Date) {
    // Use toDateTime function with ISO string
    return `toDateTime('${val.toISOString()}')`;
  }

  // Handle strings
  const str = val.toString();

  // Escape single quotes by doubling them (standard SQL escaping)
  // Remove any characters that could be used for SQL injection
  // Only allow: letters, numbers, spaces, and basic punctuation
  const escaped = str.replace(/'/g, "''").replace(/[^\w\s.,!?@#$%&*()-]/g, "");

  return `'${escaped}'`;
}

/**
 * Creates an IN clause for multiple values
 * Example: createInClause(['a', 'b']) => "IN ('a', 'b')"
 */
export function createInClause(values: Value[]): string {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error("Values must be a non-empty array");
  }

  const escapedValues = values.map((v) => escapeSql(v));
  return `IN (${escapedValues.join(", ")})`;
}

/**
 * Escapes a column name or table name
 * Only allows alphanumeric characters, underscores
 */
export function escapeIdentifier(identifier: string): string {
  if (!identifier || typeof identifier !== "string") {
    throw new Error("Invalid identifier");
  }

  // Only allow alphanumeric and underscore
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
    throw new Error("Invalid identifier format");
  }

  return identifier;
}

/**
 * Safely interpolate values into a SQL query
 * Example: interpolateQuery('SELECT * FROM ? WHERE name = ?', ['table', 'value'])
 */
export function interpolateQuery(query: string, values: Value[]): string {
  let index = 0;
  return query.replace(/\?/g, () => {
    if (index >= values.length) {
      throw new Error("Not enough values provided for query");
    }
    const val = values[index++];
    return Array.isArray(val) ? createInClause(val) : escapeSql(val);
  });
}
