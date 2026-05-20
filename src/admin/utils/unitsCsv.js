/**
 * Lightweight CSV helpers for the Units admin module.
 * No external dependency — handles quoted strings, escaped quotes, CRLF.
 */

const UNIT_FIELDS = [
  "unitNumber", "tower", "floor", "type",
  "carpetArea", "builtupArea", "price",
  "facing", "view", "status",
];

const VALID_STATUSES = new Set(["available", "booked", "sold", "blocked"]);

// ─── Parse ───────────────────────────────────────────
function parseLine(line) {
  const result = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result.map((s) => s.trim());
}

/**
 * Parses a CSV string. First row must be headers matching unit field names
 * (case-insensitive, spaces → camelCase tolerated, e.g. "Unit Number" or
 * "unitnumber" both work).
 *
 * Returns: { rows: Unit[], invalid: { line, reason }[], total }
 */
export function parseUnitsCsv(text) {
  if (!text || !text.trim()) return { rows: [], invalid: [], total: 0 };

  const lines = text.replace(/﻿/g, "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return { rows: [], invalid: [], total: 0 };

  const headers = parseLine(lines[0]).map((h) =>
    h
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      // map common variants
      .replace(/^unitno$|^unit$/, "unitnumber")
      .replace(/^unitnumber$/, "unitnumber")
      .replace(/^carpet$|^carpetarea$/, "carpetarea")
      .replace(/^builtup$|^builtuparea$/, "builtuparea")
  );

  // Map canonical field names (camelCase) to header column index
  const fieldIndex = {};
  UNIT_FIELDS.forEach((f) => {
    const key = f.toLowerCase();
    const idx = headers.indexOf(key);
    if (idx !== -1) fieldIndex[f] = idx;
  });

  const rows = [];
  const invalid = [];

  lines.slice(1).forEach((line, i) => {
    if (!line.trim()) return;
    const cells = parseLine(line);
    const row = {};
    UNIT_FIELDS.forEach((f) => {
      const idx = fieldIndex[f];
      row[f] = idx !== undefined ? (cells[idx] || "").trim() : "";
    });

    if (!row.unitNumber) {
      invalid.push({ line: i + 2, reason: "Missing unit number" });
      return;
    }
    // Normalise status — fall back to available if unrecognised
    row.status = VALID_STATUSES.has(row.status.toLowerCase())
      ? row.status.toLowerCase()
      : "available";

    rows.push(row);
  });

  return { rows, invalid, total: lines.length - 1 };
}

// ─── Serialize ───────────────────────────────────────
function escapeCell(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function unitsToCsv(units = []) {
  const headerRow = UNIT_FIELDS.join(",");
  const dataRows = units.map((u) =>
    UNIT_FIELDS.map((f) => escapeCell(u[f])).join(",")
  );
  return [headerRow, ...dataRows].join("\n");
}

// ─── Download helpers ────────────────────────────────
export function downloadCsv(filename, csvText) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const SAMPLE_UNITS_CSV = `unitNumber,tower,floor,type,carpetArea,builtupArea,price,facing,view,status
A-301,A,3,3 BHK,1840 sq.ft,2200 sq.ft,₹ 8.5 Cr,East,Sea,available
A-302,A,3,3 BHK,1840 sq.ft,2200 sq.ft,₹ 8.5 Cr,West,Park,booked
A-303,A,3,3 BHK,1840 sq.ft,2200 sq.ft,₹ 8.5 Cr,North,City,sold
B-501,B,5,4 BHK,2800 sq.ft,3400 sq.ft,₹ 14 Cr,East,Sea,available
`;

export { UNIT_FIELDS };
